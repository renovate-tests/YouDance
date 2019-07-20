import * as React from "react";

interface VideoPreviewsProps {
  dance: string;
  figure: string;
}

export default function VideoPreviews({ dance, figure }: VideoPreviewsProps) {
  if (dance === "" || figure === "") {
    return null;
  }

  return (
    <p>
      {dance}: {figure}
    </p>
  );
}
