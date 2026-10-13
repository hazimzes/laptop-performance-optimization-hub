"use client";

import { useEffect, useState } from "react";
import { sectionVideo, type VideoEntry } from "./video-map";

type Props = { taskId: string };

// Click-to-load YouTube embed: the thumbnail only downloads when the card is
// open, so a closed page makes no requests to YouTube.
function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button type="button" className="video-thumb" onClick={() => setPlaying(true)} aria-label={`Play video guide: ${title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
        <span className="video-play" aria-hidden="true"><i /></span>
      </button>
    );
  }

  return (
    <div className="video-frame">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={`Video guide: ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// Animated fallback: steps through a settings click-path one crumb at a time.
function PathDemo({ path }: { path: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % (path.length + 1)), 1200);
    return () => window.clearInterval(timer);
  }, [path.length]);

  return (
    <div className="path-demo" aria-hidden="true">
      <div className="path-crumbs">
        {path.map((crumb, position) => (
          <span key={crumb + position} className={`path-crumb ${position < index ? "hit" : ""} ${position === index - 1 ? "current" : ""}`}>
            {crumb}
          </span>
        ))}
      </div>
      <div className="path-progress"><i style={{ width: `${Math.round((index / path.length) * 100)}%` }} /></div>
    </div>
  );
}

export default function SectionVideo({ taskId }: Props) {
  const entry: VideoEntry | undefined = sectionVideo[taskId];
  if (!entry) return null;

  if ("videoId" in entry) {
    return (
      <div className="section-video">
        <b className="video-label">Video guide</b>
        <VideoEmbed videoId={entry.videoId} title={entry.title} />
        <p className="video-credit">{entry.title} — {entry.channel} on YouTube</p>
      </div>
    );
  }

  return (
    <div className="section-video">
      <b className="video-label">Animated walkthrough</b>
      <PathDemo path={entry.path} />
    </div>
  );
}
