'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    if (!fadeOverlay) {
      // While envelope is visible → lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // When envelope disappears → enable scroll
      document.body.style.overflow = 'auto';
    }
  
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fadeOverlay]);

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
      className="absolute inset-0 w-full h-full object-cover "
    />
  )}
  {!isPlaying && (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {/* Ripple effect */}
    <motion.div
      className="absolute w-16 h-16 rounded-full bg-white/20 backdrop-blur-md"
      animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />

    {/* Glass Finger */}
    <motion.div
  animate={{ y: [0, -12, 0] }}
  transition={{
    duration: 1.4,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
  className="relative w-16 h-16 flex items-center justify-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-full shadow-lg"
>
  <img
    src="/finger.png"
    alt="Tap finger"
    className="w-16 h-16 object-contain opacity-90"
  />
</motion.div>

    {/* Text */}
    <motion.p
      className="mt-3 text-sm text-white/80 italic font-serif"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      Tap to open
    </motion.p>
  </motion.div>
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
