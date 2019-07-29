import * as React from "react";
import { Box, CircularProgress, Select, MenuItem } from "@material-ui/core";

import {
  useDancesAndFiguresQuery,
  DancesAndFiguresQuery
} from "../generated/graphql";
import VideoClassification from "../containers/VideoClassification";

import "./Classify.css";

type DanceType = DancesAndFiguresQuery["dances"]["data"][0];

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
