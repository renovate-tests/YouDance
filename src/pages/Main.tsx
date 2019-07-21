import * as React from "react";
import { Paper, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import FigureTypeahead from "../components/FigureTypeahead";
import VideoPreviews from "../containers/VideoPreviews";

import {
  useDancesAndFiguresQuery,
  DancesAndFiguresQuery
} from "../generated/graphql";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

interface FigureSearchProps {
  suggestions: UniqueFigure[];
}

function FigureSearch({ suggestions }: FigureSearchProps) {
  const classes = useStyles();
  const [dance, setDance] = React.useState<string>("");
  const [figure, setFigure] = React.useState<string>("");

  return (
    <Paper className={classes.root}>
      <FigureTypeahead
        suggestions={suggestions}
        setDance={setDance}
        setFigure={setFigure}
      />

      {dance !== "" && figure !== "" ? (
        <VideoPreviews dance={dance} figure={figure} />
      ) : null}
    </Paper>
  );
}

export interface UniqueFigure {
  label: string;
  danceId: string;
  figureId: string;
}

export function getUniqueFigures(data: DancesAndFiguresQuery): UniqueFigure[] {
  if (!data.dances) {
    return [];
  }

  return (data.dances.data || []).reduce(
    (suggestions: UniqueFigure[], dance) => {
      if (!dance) {
        return suggestions;
      }

      const danceName = dance.name;

      return [
        ...suggestions,
        ...dance.figures.data
          .filter(figure => figure !== null)
          .map(figure =>
            figure
              ? {
                  label: `${figure.name} in ${danceName}`,
                  danceId: dance._id,
                  figureId: figure._id
                }
              : { label: "", danceId: "", figureId: "" }
          )
      ];
    },
    []
  );
}

type DanceType = DancesAndFiguresQuery["dances"]["data"][0];

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

function Main() {
  const { data } = useDancesAndFiguresQuery();

  let leastClassifiedDance: DanceType | null = null;

  if (data) {
    leastClassifiedDance = getDanceWithLeastVideos(data);
  }

  return (
    <Box m={4}>
      <FigureSearch suggestions={data ? getUniqueFigures(data) : []} />
      {leastClassifiedDance ? (
        <Link to={"/classify/" + leastClassifiedDance._id}>
          Help us get more figures
        </Link>
      ) : null}
    </Box>
  );
}

export default Main;
