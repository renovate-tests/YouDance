import * as React from "react";
import { Paper, Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import FigureTypeahead from "./components/FigureTypeahead";
import VideoPreviews from "./containers/VideoPreviews";

import "./App.css";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

function FigureSearch() {
  const classes = useStyles();
  const [dance, setDance] = React.useState<string>("");
  const [figure, setFigure] = React.useState<string>("");

  return (
    <Paper className={classes.root}>
      <FigureTypeahead setDance={setDance} setFigure={setFigure} />
      <VideoPreviews dance={dance} figure={figure} />
    </Paper>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">YouDance</h1>
      </header>
      <Container>
        <Box m={4}>
          <FigureSearch />
        </Box>
      </Container>
    </div>
  );
}

export default App;
