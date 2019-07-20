import * as React from "react";
import Typeahead from "./Typehead";

interface FigureTypeaheadProps {
  setDance(dance: string): void;
  setFigure(figure: string): void;
}

export default function FigureTypeahead({
  setDance,
  setFigure
}: FigureTypeaheadProps) {
  function onSelect(selectedItem: string) {
    const [figure, dance] = selectedItem.split(" in ");
    setDance(dance);
    setFigure(figure);
  }
  return (
    <Typeahead
      placeholder="Search for a figure"
      label="Figure"
      suggestions={[
        "Natural Turn in Waltz",
        "Reverse Turn in Waltz",
        "Fallaway in Waltz",
        "Fallaway in Tango"
      ]}
      onSelect={onSelect}
    />
  );
}
