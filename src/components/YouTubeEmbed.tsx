"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

export default function YouTubeEmbed({ videoId, title }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl shadow-gray-900/20">
      <div className="relative aspect-video w-full">
        {!playing ? (
          // Thumbnail + play button
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex w-full items-center justify-center"
          >
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // fallback to standard quality
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Play button */}
            <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF0000]">
              <svg className="ml-1 h-7 w-7 text-gray-900 transition-colors group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8">
              <p className="text-sm font-semibold text-white drop-shadow">{title}</p>
            </div>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            onLoad={() => setLoaded(true)}
          />
        )}

        {playing && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
