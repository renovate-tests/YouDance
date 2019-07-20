import * as React from "react";
import { Paper, Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import FigureTypeahead from "./components/FigureTypeahead";
import VideoPreviews from "./containers/VideoPreviews";

import "./App.css";
import {
  useDancesAndFiguresQuery,
  DancesAndFiguresQuery
} from "./generated/graphql";

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

function getSuggestions(data: DancesAndFiguresQuery): string[] {
  if (!data.dances) {
    return [];
  }

  return (data.dances.data || []).reduce((suggestions: string[], dance) => {
    if (!dance) {
      return suggestions;
    }

    const danceName = dance.name;

    return [
      ...suggestions,
      ...dance.figures.data
        .filter(figure => figure !== null)
        .map(figure => (figure ? `${figure.name} in ${danceName}` : ""))
    ];
  }, []);
}

function App() {
  const { data } = useDancesAndFiguresQuery();

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">YouDance</h1>
      </header>
      <Container maxWidth="lg">
        <Box m={4}>
          <FigureSearch suggestions={data ? getSuggestions(data) : []} />
        </Box>
      </Container>
    </div>
  );
}

export default App;
