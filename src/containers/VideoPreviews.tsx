import * as React from "react";
import "./VideoPreviews.css";
import { useVideosByFigureQuery } from "../generated/graphql";
import { CircularProgress } from "@material-ui/core";

interface VideoPreviewsProps {
  dance: string;
  figure: string;
}

interface FigureVideo {
  youtubeId: string;
  start: number; // in seconds
  end: number; // in seconds
}

function getUniqueId({ youtubeId, start, end }: FigureVideo): string {
  return `${youtubeId}:${start}:${end}`;
}

export function getEmbeddedVideoUrl(video: FigureVideo): string {
  return `https://www.youtube.com/embed/${video.youtubeId}?start=${
    video.start
  }&end=${video.end}&version=3`;
}

function FigureView(video: FigureVideo) {
  return (
    <iframe
      title={getUniqueId(video)}
      className="figureView"
      src={getEmbeddedVideoUrl(video)}
    />
  );
}

function EmptyListView() {
  return (
    <section className="videoPreviewsContainer">
      <h3>We don't have any videos for this figure :/</h3>
    </section>
  );
}

export default function VideoPreviews({ figure }: VideoPreviewsProps) {
  const { data, loading } = useVideosByFigureQuery({
    variables: { figureId: figure }
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (!data || !data.findFigureByID) {
    return <EmptyListView />;
  }

  const videos = data.findFigureByID.videos.data || [];
  const filteredVideos = videos.filter(video => video !== null);

  if (!filteredVideos.length) {
    return <EmptyListView />;
  }

  return (
    <section className="videoPreviewsContainer">
      {filteredVideos.map(figureVideo => {
        if (!figureVideo) {
          return null;
        }

        return <FigureView key={getUniqueId(figureVideo)} {...figureVideo} />;
      })}
    </section>
  );
}
