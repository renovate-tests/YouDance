import * as React from "react";
import Typeahead from "./Typehead";

interface FigureTypeaheadProps {
  suggestions: string[];
  setDance(dance: string): void;
  setFigure(figure: string): void;
}

export default function FigureTypeahead({
  setDance,
  setFigure,
  suggestions
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
      suggestions={suggestions}
      onSelect={onSelect}
    />
  );
}
