import * as React from "react";
import { Box, CircularProgress, Select, MenuItem } from "@material-ui/core";
import ReactPlayer from "react-player";

import {
  useDancesAndFiguresQuery,
  DancesAndFiguresQuery
} from "../generated/graphql";

import "./Classify.css";
import AddFigureForm from "../containers/AddFigureForm";
import { getUniqueFigures } from "./Main";

interface YoutubeVideoResponse {
  id: {
    videoId: string;
  };
}

async function getYoutubeVideos(danceName: string) {
  const apiKey = process.env.REACT_APP_YOUTUBE_API_TOKEN;
  const searchTerm = encodeURIComponent(`wdsf ${danceName}`);

  return fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchTerm}&key=${apiKey}`
  ).then(res => res.json());
}

type DanceType = DancesAndFiguresQuery["dances"]["data"][0];

interface VideoClassificationProps {
  danceName: string;
  danceId: string;
  knownYoutubeIds: string[] | null;
}

function VideoClassification({
  danceName,
  danceId,
  knownYoutubeIds
}: VideoClassificationProps) {
  const [playbackTime, setPlaybackTime] = React.useState(0);
  const { data, loading } = useDancesAndFiguresQuery();
  const [youtubeResponse, setYoutubeResponse] = React.useState();
  // Search video on youtube

  React.useEffect(() => {
    getYoutubeVideos(danceName).then(result => setYoutubeResponse(result));
  }, [danceName]);

  if (!youtubeResponse || loading || !data || !knownYoutubeIds) {
    return <CircularProgress />;
  }

  // TODO: only load what we need
  const figures = getUniqueFigures(data).filter(
    item => item.danceId === danceId
  );

  let youtubeId = null;
  if (youtubeResponse && youtubeResponse.items) {
    const youtubeIds = youtubeResponse.items.map(
      (item: YoutubeVideoResponse) => item.id.videoId
    );
    const filteredIds = youtubeIds.filter((item: string) => {
      return !knownYoutubeIds.includes(item);
    });

    if (filteredIds.length) {
      youtubeId = filteredIds[0];
    } else {
      youtubeId = youtubeIds[0];
    }
  }

  if (!youtubeId) {
    return null;
  }

  return (
    <>
      <ReactPlayer
        className="Classify-review"
        url={"https://www.youtube.com/watch?v=" + youtubeId}
        onProgress={({ playedSeconds }) =>
          setPlaybackTime(Math.floor(playedSeconds))
        }
      />

      <Box m={4}>
        <AddFigureForm
          currentPlaybackTime={playbackTime}
          danceId={danceId}
          youtubeId={youtubeId}
          knownFigures={figures}
        />
      </Box>
    </>
  );
}

function getYoutubeIds(dances: DanceType[]): string[] {
  if (!dances) {
    return [];
  }

  return dances
    .reduce(
      (carry, dance) => {
        if (!dance) {
          return carry;
        }

        const youtubeIdsForDance = (dance.figures.data || []).reduce(
          (carry, figure) => {
            if (!figure) {
              return carry;
            }

            const youtubeIds = (figure.videos.data || []).map(video =>
              video ? video.youtubeId : ""
            );

            return [...carry, ...youtubeIds];
          },
          [] as string[]
        );

        return [...carry, ...youtubeIdsForDance];
      },
      [] as string[]
    )
    .filter((youtubeId: string) => youtubeId !== "");
}

function getDanceById(selectedDanceId: string, dances: DanceType[]) {
  return dances.find(dance => dance && dance._id === selectedDanceId);
}

function getNumberOfVideos(dance: DanceType): number {
  if (!dance) {
    return Infinity; // we search for the smallest where this is used
  }

  return dance.figures.data.reduce((carry, figure) => {
    if (!figure) {
      return carry;
    }

    return carry + (figure.videos.data || []).length;
  }, 0);
}

function getDanceWithLeastVideos(data: DancesAndFiguresQuery): DanceType {
  if (!data.dances) {
    return null;
  }

  return (data.dances.data || []).sort((danceA, danceB) =>
    getNumberOfVideos(danceA) < getNumberOfVideos(danceB) ? -1 : 1
  )[0];
}

export default function Classify() {
  const [selectedDanceId, setSelectedDanceId] = React.useState<string>("");
  const { data, loading } = useDancesAndFiguresQuery();

  const [knownYoutubeIds, setYoutubeIds] = React.useState<null | string[]>(
    null
  );

  if (loading || !data || !data.dances || !data.dances.data) {
    return <CircularProgress />;
  }

  // TODO: use effect or sth?
  if (!knownYoutubeIds) {
    setYoutubeIds(getYoutubeIds(data.dances.data));
  }

  const dances = data.dances.data;
  if (!selectedDanceId) {
    const dance = getDanceWithLeastVideos(data);
    if (dance) {
      setSelectedDanceId(dance._id);
    }
  }
  const dance = getDanceById(selectedDanceId, dances);

  return (
    <Box m={4}>
      <h1>
        Help us get new videos for{" "}
        <Select
          value={selectedDanceId}
          onChange={e => setSelectedDanceId(e.target.value as string)}
        >
          {dances.map(dance =>
            dance ? (
              <MenuItem key={dance._id} value={dance._id}>
                {dance.name}
              </MenuItem>
            ) : null
          )}
        </Select>
      </h1>

      {dance && knownYoutubeIds ? (
        <VideoClassification
          danceId={dance._id}
          danceName={dance.name}
          knownYoutubeIds={knownYoutubeIds}
        />
      ) : null}
    </Box>
  );
}
