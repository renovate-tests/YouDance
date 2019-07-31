import * as React from "react";
import ReactPlayer from "react-player";

export interface FigureVideo {
  youtubeId: string;
  start: number; // in seconds
  end: number; // in seconds
}

export function getUniqueId({ youtubeId, start, end }: FigureVideo): string {
  return `${youtubeId}:${start}:${end}`;
}

export function getEmbeddedVideoUrl(video: FigureVideo): string {
  // Adds two seconds before and after
  return `https://www.youtube.com/embed/${video.youtubeId}?start=${
    video.start <= 2 ? 0 : video.start - 2
  }&end=${video.end + 2}&version=3`;
}

export default function FigureView(video: FigureVideo) {
  const playerRef = React.useRef<ReactPlayer | null>(null);

  return (
    <ReactPlayer
      ref={playerRef}
      onEnded={() => {
        console.log("Ended", playerRef);

        if (playerRef && playerRef.current) {
          const player = playerRef.current as ReactPlayer;
          player.seekTo(video.start, "seconds");

          const youtubePlayer = player.getInternalPlayer();
          (youtubePlayer as any).playVideo();
        }
      }}
      className="figureView"
      url={getEmbeddedVideoUrl(video)}
    />
  );
}
