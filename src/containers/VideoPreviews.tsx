import * as React from "react";
import "./VideoPreviews.css";

interface VideoPreviewsProps {
  dance: string;
  figure: string;
}

interface FigureVideo {
  youtubeId: string;
  start: number; // in seconds
  end: number; // in seconds
}

export function getEmbeddedVideoUrl(video: FigureVideo): string {
  return `https://www.youtube.com/embed/${video.youtubeId}?start=${
    video.start
  }&end=${video.end}&version=3`;
}

function FigureView(figure: FigureVideo) {
  return <iframe className="figureView" src={getEmbeddedVideoUrl(figure)} />;
}

export default function VideoPreviews({ dance, figure }: VideoPreviewsProps) {
  if (dance === "" || figure === "") {
    return null;
  }

  const figureVideos: FigureVideo[] = [
    {
      youtubeId: "f2a-3WfkFu4",
      start: 48,
      end: 55
    },
    {
      youtubeId: "dUYCShksaUI",
      start: 20,
      end: 28
    },
    {
      youtubeId: "kMr0EQQF8EE",
      start: 66,
      end: 89
    }
  ];

  return (
    <section className="videoPreviewsContainer">
      {figureVideos.slice(0, 3).map(figureVideo => (
        <FigureView {...figureVideo} />
      ))}
    </section>
  );
}
