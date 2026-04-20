'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Model3D } from '../components/Model3D';
import { getAudio } from '../utils/audio';
import FlipCard from './flipCard';
import Image from "next/image";
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const targetTime = targetDate.getTime();

    const update = () => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [targetDate.getTime()]);

  return timeLeft;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);

    setMounted(true);
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile, mounted };
}

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, isVisible };
}


function AutoRotate({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group
      ref={ref}
      scale={isMobile ? 1.4 : 1.2}
position={isMobile ? [0, -0.5, 0] : [0, 0, 0]}
    >
      {children}
    </group>
  );
}


export default function Invitation() {
  const venueName = 'Hajmus Convention Centre';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueName
  )}`;

  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    venueName
  )}&output=embed`;

  const targetDate = new Date('2026-05-16T00:00:00');

  const timeLeft = useCountdown(targetDate);
  const { isMobile, mounted } = useIsMobile();
  const [isMuted, setIsMuted] = useState(false);

  const namesRef = useScrollAnimation();
  const countdownRef = useScrollAnimation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const audio = getAudio();
    if (audio) {
      setIsMuted(audio.muted);
    }
  }, []);
  
  const toggleSound = () => {
    const audio = getAudio();
    if (!audio) return;
  
    const newMuted = !audio.muted;
    audio.muted = newMuted;
    setIsMuted(newMuted);
  };
  return (
    <div className="min-h-screen w-full font-sans overflow-x-hidden">
      <main className="flex flex-col">

        <section className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">

          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          >
            <source src="/my.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/30 z-0" />

          {/* 3D Model */}
          <div className="
  absolute inset-0 
  w-full h-full 
  md:left-auto md:right-0 md:inset-y-0 md:w-1/2 
  pointer-events-none 
  opacity-70 md:opacity-100
">
            
              <Canvas
              style={{ pointerEvents: 'none' }}
                camera={{
                  fov: 45,
                  position: isMobile ? [0, 0, 7] : [0, 0, 6],
                }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />

                  <Bounds fit clip margin={1.2}>
                    <AutoRotate isMobile={isMobile}>
                      <Model3D />
                    </AutoRotate>
                  </Bounds>

                  <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                  <Environment preset="sunset" />
                </Suspense>
              </Canvas>
            
          </div>

          {/* Names */}
          <div
            ref={namesRef.ref}
            className={`text-center transition-all duration-1000 ease-out relative z-10 ${
              namesRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-sm tracking-[0.35em] uppercase text-[#E8E2D6] mb-6 font-serif">
              The Wedding of
            </p>

            <h1
              className="text-6xl md:text-7xl lg:text-8xl text-[#D8A7B1] mb-2"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Shahana
            </h1>

            <p
              className="text-2xl md:text-3xl text-[#D8A7B1]"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              &amp;
            </p>

            <h2
              className="text-6xl md:text-7xl lg:text-8xl text-[#D8A7B1] mb-4"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Shareef
            </h2>

            <p className="text-lg md:text-xl text-[#E8E2D6] mb-8 font-serif italic">
              16 May 2026
            </p>

            {/* Bundle of flowers */}
            <div className="flex items-center justify-center mt-2">
              <img
                src="/flower4.png"
                alt="Flower decoration"
                className="max-w-[150px] md:max-w-[250px] h-auto drop-shadow-lg"
              />
            </div>
     
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">

<div className="arrow-float">
  <svg
    className="w-5 h-5 md:w-6 md:h-6 text-[#E8E2D6]/90"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
</div>

{/* ✅ Inline CSS */}
<style>
  {`
    .arrow-float {
      animation: floatArrow 1.6s ease-in-out infinite;
    }

    @keyframes floatArrow {
      0%, 100% {
        transform: translateY(0);
        opacity: 0.7;
      }
      50% {
        transform: translateY(10px);
        opacity: 1;
      }
    }
  `}
</style>

</div>
        </section>
        
        <section className="bg-[#7A8060] py-24 text-center relative">
  <div
    ref={countdownRef.ref}
    className={`transition-all duration-1000 ${
      countdownRef.isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-10'
    }`}
  >
    <h2
      className="text-5xl md:text-7xl text-white mb-2"
      style={{ fontFamily: 'var(--font-great-vibes)' }}
    >
      Countdown
    </h2>

    <p className="text-sm md:text-base text-[#E8E2D6]/90 tracking-wide mb-10 font-serif italic">
      For the most special day of our lives
    </p>

    {timeLeft && (
      <div className="flex justify-center">
        
        <div className="w-full max-w-[260px] rounded-2xl px-8 py-10 ">

          {/* 🔥 SCALE HERE */}
          <div className="flex justify-center scale-[1.8] origin-center">
            <FlipCard />
          </div>

          

        </div>

      </div>
    )}
  </div>
</section>
        {/* Wave separator exactly between Section 2 and Section 3 */}
        <div className="w-full overflow-hidden leading-none pointer-events-none -mt-1 bg-[#7A8060]">
          <svg
            className="block w-full h-[70px] md:h-[90px]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="countdownToVenueWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A8060" />
                <stop offset="100%" stopColor="#8FF2CD" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1440" height="320" fill="#7A8060" />
            <path
              fill="url(#countdownToVenueWave)"
              d="M0,192 C320,120 520,260 840,180 C1100,120 1300,200 1440,160 L1440,320 L0,320 Z"
            />
          </svg>
        </div>
        <div className="relative h-0">
  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float z-20 text-center">
    
    <img
      src="/doodle.png"
      alt="Couple doodle"
      className="max-w-[220px] md:max-w-[300px] drop-shadow-2xl"
    />

    <p className="mt-3 inline-block px-3 py-1 bg-white/80 text-gray-700 text-sm italic font-serif rounded-full shadow">
      That’s us ❤️
    </p>

  </div>
</div>
        {/* ================= VENUE ================= */}
        <section className="bg-[#8FF2CD] py-10 md:py-16 text-center px-4">
          <h2
            className="text-5xl md:text-7xl text-[#2E6B5B] mb-3 mt-12 md:mt-14"
            style={{ fontFamily: 'var(--font-great-vibes)' }}
          >
            Venue Details
          </h2>
          <p className="text-base md:text-xl text-[#2E6B5B]/90 mb-10 font-serif">
            Everything you need to know
          </p>

          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl mx-auto overflow-hidden">
            <div className="p-6 md:p-10 lg:p-14">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-[#D9F9EA] mx-auto flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#2E6B5B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
              </div>

              {/* Location label */}
              <p
                className="text-2xl md:text-4xl text-[#2E6B5B] mb-6"
                style={{ fontFamily: 'var(--font-great-vibes)' }}
              >
                Location
              </p>

              {/* Venue name */}
              <p className="text-2xl md:text-3xl text-[#3A5D56] font-serif mb-6">
                {venueName}
              </p>

              {/* Time row */}
              <div className="flex items-center justify-center gap-3 text-[#3A5D56] mb-6">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <p className="text-base md:text-lg font-serif">
                  Time: 6:00 PM - 10:00 PM
                </p>
              </div>

              {/* Venue photo */}
              <div className="w-full rounded-2xl overflow-hidden">
                <img
                  src="/venue.webp"
                  alt="Venue"
                  className="w-full h-52 md:h-72 object-cover"
                />
              </div>
            </div>

            {/* Map preview (kept from your existing code) */}
            <div className="relative">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 left-3 z-10 rounded-full bg-white/90 px-4 py-2 text-xs md:text-sm text-[#2E6B5B] shadow hover:bg-white"
              >
                Open in Maps ↗
              </a>
              <iframe
                src={mapsEmbedUrl}
                className="w-full h-56 md:h-80"
                loading="lazy"
              />
            </div>

          </div>
        </section>

        {/* Wave separator exactly between Section 3 and Section 4 */}
        <div className="w-full overflow-hidden leading-none pointer-events-none -mt-1 bg-[#8FF2CD]">
          <svg
            className="block w-full h-[70px] md:h-[90px]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="venueToProgrammeWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8FF2CD" />
                <stop offset="100%" stopColor="#f7ecd0" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1440" height="320" fill="#8FF2CD" />
            <path
              fill="url(#venueToProgrammeWave)"
              d="M0,192 C320,120 520,260 840,180 C1100,120 1300,200 1440,160 L1440,320 L0,320 Z"
            />
          </svg>
        </div>
        <div className="relative h-0">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-float">

        <Image
  src="/doodle2.png"
  alt="Couple doodle"
  width={180}
  height={150}
  priority
  className="drop-shadow-2xl"
  style={{ height: "auto" }}
/>

<p className="mt-3 inline-block px-3 py-1 
  bg-white/70 backdrop-blur-md 
  text-gray-700 text-sm italic font-serif 
  rounded-full shadow">
  let's celebrate ❤️
</p>

</div>
</div>
        {/* ================= DAY PROGRAMME (Section 4) ================= */}
        <section className="bg-[#f7ecd0] py-16 px-4 text-center overflow-hidden relative">
          <div className="max-w-5xl mx-auto">
              <h2
               className="text-4xl md:text-7xl text-[#8a6a3b] mb-3 mt-22 md:mt-24"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Day Programme
            </h2>
            <p className="text-sm md:text-base text-[#8a6a3b]/90 tracking-wide mb-10 font-serif italic">
              16 may 2026
            </p>

            <div className="relative max-w-3xl mx-auto">
              {/* center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#c7ae74] transform -translate-x-1/2" />

              <div className="relative space-y-8 md:space-y-10">
                {/* Arrival (right) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
                  <div />
                  <div className="text-left pl-4 md:pl-6">
                    <p className="text-xs md:text-sm text-[#8a6a3b] tracking-[0.25em] font-serif">
                      15:30
                    </p>
                    <p className="text-xs md:text-sm text-[#8a6a3b]/90 tracking-[0.35em] font-serif mt-1">
                      ARRIVAL
                    </p>
                  </div>
                </div>

                {/* Ceremony (left) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
                <div className="text-right pr-4 md:pr-6">
                    <p className="text-xs md:text-sm text-[#8a6a3b] tracking-[0.25em] font-serif">
                      16:30
                    </p>
                    <p className="text-xs md:text-sm text-[#8a6a3b]/90 tracking-[0.35em] font-serif mt-1">
                      NIKKAH
                    </p>
                  </div>
                  <div />
                </div>

                {/* Cocktails (right) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
                  <div />
                  <div className="text-left pl-4 md:pl-6">
                    <p className="text-xs md:text-sm text-[#8a6a3b] tracking-[0.25em] font-serif">
                      17:00
                    </p>
                    <p className="text-xs md:text-sm text-[#8a6a3b]/90 tracking-[0.35em] font-serif mt-1">
                      SNACKS
                    </p>
                  </div>
                </div>

                {/* Dinner (left) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
                <div className="text-right pr-4 md:pr-6">
                    <p className="text-xs md:text-sm text-[#8a6a3b] tracking-[0.25em] font-serif">
                      18:00
                    </p>
                    <p className="text-xs md:text-sm text-[#8a6a3b]/90 tracking-[0.35em] font-serif mt-1">
                      DINNER
                    </p>
                  </div>
                  <div />
                </div>

                {/* Cutting the cake (right) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
                  <div />
                  <div className="text-left pl-4 md:pl-6">
                    <p className="text-xs md:text-sm text-[#8a6a3b] tracking-[0.25em] font-serif">
                      21:00
                    </p>
                    <p className="text-xs md:text-sm text-[#8a6a3b]/90 tracking-[0.35em] font-serif mt-1">
                      CUTTING THE CAKE
                    </p>
                  </div>
                </div>

                {/* Finish (left) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
                <div className="text-right pr-4 md:pr-6">
                    <p className="text-xs md:text-sm text-[#8a6a3b] tracking-[0.25em] font-serif">
                      23:00
                    </p>
                    <p className="text-xs md:text-sm text-[#8a6a3b]/90 tracking-[0.35em] font-serif mt-1">
                      FINISH
                    </p>
                  </div>
                  <div />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ================= SECTION 5: CLOSING ================= */}
        <div className="w-full overflow-hidden leading-none pointer-events-none -mt-1 bg-[#f7ecd0]">
  <svg
    className="block w-full h-[70px] md:h-[90px]"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="beigeToWhiteWave" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f7ecd0" />
        <stop offset="100%" stopColor="#fffaf2" />
      </linearGradient>
    </defs>

    {/* base fill */}
    <rect x="0" y="0" width="1440" height="320" fill="#f7ecd0" />

    {/* wave */}
    <path
      fill="url(#beigeToWhiteWave)"
      d="M0,192 C320,120 520,260 840,180 C1100,120 1300,200 1440,160 L1440,320 L0,320 Z"
    />
  </svg>
</div>
<div className="relative h-0">
  <div
    className="absolute top-0 left-0 w-full z-20 pointer-events-none"
    style={{
      animation: 'carMove 60s linear infinite',
    }}
  >
   <div className="relative w-full h-[120px]">
  <Image
    src="/doodle3.png"
    alt="Car doodle"
    width={180}
    height={120}
    priority
    className="absolute top-[20%] -translate-y-1/2 
    drop-shadow-2xl mix-blend-multiply opacity-95"
  />
</div>
  </div>

  <style>
    {`
      @keyframes carMove {
        0% {
          transform: translateX(110vw);
        }
        100% {
          transform: translateX(-30vw);
        }
      }
    `}
  </style>
</div>
<section className="relative py-20 px-4 text-center overflow-hidden">

{/* 🌸 Background Image */}
<img
  src="/section5.png"  // <-- save the generated image as this
  alt="Background"
  className="absolute inset-0 w-full h-full object-cover opacity-90"
/>

{/* Overlay for readability */}
<div className="absolute inset-0 bg-white/70" />

{/* Content */}
<div className="relative z-10 max-w-3xl mx-auto">

  <h2
    className="text-5xl md:text-7xl text-[#8a6a3b] mb-6"
    style={{ fontFamily: 'var(--font-great-vibes)' }}
  >
    With Love
  </h2>

  <p className="text-xl md:text-2xl text-[#8a6a3b] font-serif mb-4">
    Shahana & Shareef
  </p>

  <p className="text-base md:text-lg text-[#8a6a3b]/80 italic mb-6">
    We look forward to celebrating with you 🤍
  </p>

  <p className="text-sm md:text-base text-[#8a6a3b]/70">
    Keep us in your prayers 🤲
  </p>

</div>
</section>

      </main>

     <div className="fixed bottom-6 right-6 z-20">
     <button
       onClick={toggleSound}
       className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95"
     >
       {isMuted ? (
         // 🔇 Muted
         <svg
         className="w-5 h-5 text-gray-600"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.8"
         viewBox="0 0 24 24"
       >
         <path d="M11 5L6 9H3v6h3l5 4V5z" />
         <line x1="15" y1="9" x2="20" y2="14" />
         <line x1="20" y1="9" x2="15" y2="14" />
       </svg>
        
       ) : (
         // 🔊 Sound
         <svg
         className="w-5 h-5 text-gray-600"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.8"
         viewBox="0 0 24 24"
       >
         <path d="M11 5L6 9H3v6h3l5 4V5z" />
         <path d="M15 9a3 3 0 010 6" />
       </svg>
       )}
     </button>
   </div>

    </div>
  );
}