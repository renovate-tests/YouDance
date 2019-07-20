import * as React from "react";
import FigureTypeahead from "./components/FigureTypeahead";
import VideoPreviews from "./containers/VideoPreviews";
import "./App.css";

function FigureSearch() {
  const [dance, setDance] = React.useState<string>("");
  const [figure, setFigure] = React.useState<string>("");

  return (
    <>
      <FigureTypeahead setDance={setDance} setFigure={setFigure} />
      <VideoPreviews dance={dance} figure={figure} />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">YouDance</h1>
      </header>
      <main>
        <FigureSearch />
      </main>
    </div>
  );
}

export default App;
