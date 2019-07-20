import * as React from "react";
import { Paper, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
  suggestions: string[];
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
      <VideoPreviews dance={dance} figure={figure} />
    </Paper>
  );
}

interface UniqueFigure {
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

function Main() {
  const { data } = useDancesAndFiguresQuery();

  return (
    <Box m={4}>
      <FigureSearch
        suggestions={
          data ? getUniqueFigures(data).map(suggestion => suggestion.label) : []
        }
      />
    </Box>
  );
}

export default Main;
