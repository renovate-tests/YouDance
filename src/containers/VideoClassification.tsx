import * as React from "react";
import { Box, CircularProgress, Button } from "@material-ui/core";
import ReactPlayer from "react-player";

import { useDancesAndFiguresQuery } from "../generated/graphql";

import AddFigureForm from "../containers/AddFigureForm";
import { getUniqueFigures } from "../pages/Main";

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
interface YoutubeVideoResponse {
  id: {
    videoId: string;
  };
}

export default function VideoClassification({
  danceName,
  danceId,
  knownYoutubeIds
}: VideoClassificationProps) {
  const [playbackTime, setPlaybackTime] = React.useState(0);
  const { data, loading } = useDancesAndFiguresQuery();
  const [youtubeResponse, setYoutubeResponse] = React.useState();
  const [youtubeIndex, setYoutubeIndex] = React.useState(0);

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
      youtubeId = filteredIds[youtubeIndex];
    } else {
      youtubeId = youtubeIds[youtubeIndex];
    }
  }

  if (!youtubeId) {
    return null;
  }

  return (
    <>
      <ReactPlayer
        controls
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

        <Button onClick={() => setYoutubeIndex(youtubeIndex + 1)}>
          Next Video
        </Button>
      </Box>
    </>
  );
}
