'use client';

import { useEffect, useState } from 'react';

export default function FlipCard({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== display) {
      setPrev(display);
      setDisplay(value);
      setFlip(true);

      const timeout = setTimeout(() => setFlip(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [value, display]);

  const format = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative w-full h-[80px] [perspective:1000px]">

      {/* TOP STATIC */}
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-xl bg-white/10 border border-white/20 flex items-end justify-center text-3xl font-semibold text-[#F5F1E8]">
        {format(display)}
      </div>

      {/* BOTTOM STATIC */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden rounded-b-xl bg-white/10 border border-white/20 flex items-start justify-center text-3xl font-semibold text-[#F5F1E8]">
        {format(prev)}
      </div>

      {/* FLIP TOP */}
      <div
        className={`absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-xl bg-white/20 flex items-end justify-center text-3xl font-semibold text-[#F5F1E8] ${
          flip ? 'flip-top' : ''
        }`}
      >
        {format(prev)}
      </div>

      {/* FLIP BOTTOM */}
      <div
        className={`absolute bottom-0 left-0 w-full h-1/2 overflow-hidden rounded-b-xl bg-white/20 flex items-start justify-center text-3xl font-semibold text-[#F5F1E8] ${
          flip ? 'flip-bottom' : ''
        }`}
      >
        {format(display)}
      </div>

      {/* INLINE CSS */}
      <style>
        {`
          .flip-top {
            transform-origin: bottom;
            animation: flipTop 0.6s ease-in-out forwards;
          }

          .flip-bottom {
            transform-origin: top;
            animation: flipBottom 0.6s ease-in-out forwards;
          }

          @keyframes flipTop {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(-90deg); }
          }

          @keyframes flipBottom {
            0% { transform: rotateX(90deg); }
            100% { transform: rotateX(0deg); }
          }
        `}
      </style>

    </div>
  );
}