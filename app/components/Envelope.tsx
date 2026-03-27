'use client';

import { useState, useRef, useEffect } from 'react';

export default function Envelope() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeVideo, setFadeVideo] = useState(false);
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScreenClick = () => {
    if (!isPlaying && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play();

      // After 2s: fade video to white (keep white background)
      fadeTimeoutRef.current = setTimeout(() => {
        setFadeVideo(true);

        // Then after white flash, fade the overlay itself to reveal invitation
        overlayTimeoutRef.current = setTimeout(() => {
          setFadeOverlay(true);
        }, 700); // match CSS transition duration
      }, 2000);
    }
  };

  useEffect(() => {
    // Ensure video is paused initially
    if (videoRef.current) {
      videoRef.current.pause();
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
  onClick={handleScreenClick}
  className={`fixed inset-0 z-30 flex items-center justify-center bg-white transition-opacity duration-700 ${
    fadeOverlay ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'
  }`}
>

  {/* 👇 FALLBACK IMAGE (always visible initially) */}
  {!isPlaying && (
    <img
      src="/envelope.PNG"
      alt="Envelope preview"
      className="absolute inset-0 w-full h-full object-cover scale-85 md:scale-100"
    />
  )}

  {/* 👇 VIDEO */}
  <video
    ref={videoRef}
    className={`w-full h-full object-cover transition-opacity duration-700 ${
      fadeVideo ? 'opacity-0' : 'opacity-100'
    }`}
    muted
    playsInline
    preload="auto"
  >
    <source src="/envelope.mp4" type="video/mp4" />
  </video>


</div>
  );
}
