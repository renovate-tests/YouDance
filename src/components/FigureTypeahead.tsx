import * as React from "react";
import Typeahead from "./Typehead";
import { UniqueFigure } from "../pages/Main";

interface FigureTypeaheadProps {
  suggestions: UniqueFigure[];
  setDance(dance: string): void;
  setFigure(figure: string): void;
}

export default function FigureTypeahead({
  setDance,
  setFigure,
  suggestions
}: FigureTypeaheadProps) {
  function onSelect(selectedItem: string) {
    const uniqueFigure = suggestions.find(
      ({ label }) => label === selectedItem
    );

    if (!uniqueFigure) {
      throw "Something was selected that can not be in the list";
    }

    setDance(uniqueFigure.danceId);
    setFigure(uniqueFigure.figureId);
  }
  return (
    <Typeahead
      placeholder="Search for a figure"
      label="Figure"
      suggestions={suggestions.map(suggestion => suggestion.label)}
      onSelect={onSelect}
    />
  );
}
