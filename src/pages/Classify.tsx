import * as React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { match } from "react-router";
import { useFindDanceQuery } from "../generated/graphql";

import "./Classify.css";

async function getYoutubeVideoId(danceName: string) {
  const searchTerm = encodeURIComponent(`wdsf ${danceName}`);
  const apiKey = "AIzaSyCkD0MSqi0g9ZYCqk3C9QXXNJ0Ykdoh354";
  return fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${apiKey}`
  )
    .then(res => res.json())
    .then(response => {
      if (
        response &&
        response.items &&
        response.items[0] &&
        response.items[0].id &&
        response.items[0].id.videoId
      ) {
        return response.items[0].id.videoId;
      } else {
        return null;
      }
    });
}

interface VideoClassificationProps {
  danceName: string;
  danceId: string;
}

function VideoClassification({ danceName }: VideoClassificationProps) {
  const [youtubeId, setYoutubId] = React.useState();
  // Search video on youtube

  React.useEffect(() => {
    getYoutubeVideoId(danceName).then(result => setYoutubId(result));
  });

  if (!youtubeId) {
    return <CircularProgress />;
  }

  return (
    <iframe
      className="Classify-review"
      src={"https://www.youtube.com/embed/" + youtubeId}
    />
  );
}

interface ClassifyProps {
  match: match<{ id: string }>;
}
// TODO: if no id is present we should request a dance from the backend
export default function Classify({ match }: ClassifyProps) {
  const id = match.params.id;
  // Load dance from ID (we need this for the search)
  const { data, loading } = useFindDanceQuery({
    variables: { id }
  });

  if (loading || !data || !data.findDanceByID) {
    return <CircularProgress />;
  }

  const danceName = data.findDanceByID.name;

  return (
    <Box m={4}>
      <h1>Help us get new videos for {danceName}</h1>
      <VideoClassification danceId={id} danceName={danceName} />
    </Box>
  );
}
