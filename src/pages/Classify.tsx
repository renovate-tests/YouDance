import * as React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { match } from "react-router";
import ReactPlayer from "react-player";

import {
  useFindDanceQuery,
  useDancesAndFiguresQuery,
  FindDanceQuery
} from "../generated/graphql";

import "./Classify.css";

import { getUniqueFigures } from "./Main";
import AddFigureForm from "../containers/AddFigureForm";

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

      <AddFigureForm
        currentPlaybackTime={playbackTime}
        danceId={danceId}
        youtubeId={youtubeId}
        knownFigures={figures}
      />
    </>
  );
}

type DanceType = FindDanceQuery["findDanceByID"];
function getYoutubeIds(dance: DanceType): string[] {
  if (!dance) {
    return [];
  }

  return (dance.figures.data || [])
    .reduce(
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
    )
    .filter(youtubeId => youtubeId !== "");
}

interface ClassifyProps {
  match: match<{ id: string }>;
}
// TODO: if no id is present we should request a dance from the backend
export default function Classify({ match }: ClassifyProps) {
  const [knownYoutubeIds, setYoutubeIds] = React.useState<null | string[]>(
    null
  );

  const id = match.params.id;
  // Load dance from ID (we need this for the search)
  const { data, loading } = useFindDanceQuery({
    variables: { id }
  });

  if (loading || !data || !data.findDanceByID) {
    return <CircularProgress />;
  }

  const dance = data.findDanceByID;

  if (knownYoutubeIds === null) {
    setYoutubeIds(getYoutubeIds(data.findDanceByID));
  }

  return (
    <Box m={4}>
      <h1>Help us get new videos for {dance.name}</h1>
      <VideoClassification
        danceId={id}
        danceName={dance.name}
        knownYoutubeIds={knownYoutubeIds}
      />
    </Box>
  );
}
