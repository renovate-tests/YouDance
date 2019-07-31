import * as React from "react";

export interface FigureVideo {
  youtubeId: string;
  start: number; // in seconds
  end: number; // in seconds
}

export function getUniqueId({ youtubeId, start, end }: FigureVideo): string {
  return `${youtubeId}:${start}:${end}`;
}

export function getEmbeddedVideoUrl(video: FigureVideo): string {
  return `https://www.youtube.com/embed/${video.youtubeId}?start=${
    video.start
  }&end=${video.end}&version=3`;
}

export default function FigureView(video: FigureVideo) {
  return (
    <iframe
      title={getUniqueId(video)}
      className="figureView"
      src={getEmbeddedVideoUrl(video)}
    />
  );
}
