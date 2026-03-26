'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Model3D } from '../components/Model3D';

/* =========================
   HOOK: Countdown
========================= */
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

/* =========================
   HOOK: Mobile Check
========================= */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Treat tablet like mobile so the 3D model stays proportionate.
    const check = () => setIsMobile(window.innerWidth < 1024);

    setMounted(true);
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile, mounted };
}

/* =========================
   HOOK: Scroll Animation
========================= */
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

/* =========================
   COMPONENT: Auto Rotate
========================= */
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
      // Smaller on phones/tablets so the model doesn't overflow.
      scale={isMobile ? 0.8 : 1.2}
      // Move up a bit and slightly toward center for phone/tablet framing.
      position={isMobile ? [0.1, -0.2, 0] : [0, 0, 0]}
    >
      {children}
    </group>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
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

  const namesRef = useScrollAnimation();
  const countdownRef = useScrollAnimation();

  return (
    <div className="min-h-screen w-full font-sans">
      <main className="flex flex-col">

        {/* ================= HERO SECTION ================= */}
        <section className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">

          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay to make the text readable */}
          <div className="absolute inset-0 bg-black/30 z-0" />

          {/* 3D Model */}
          <div className="absolute right-0 inset-y-0 w-[70%] sm:w-[80%] md:w-[55%] lg:w-1/2 pointer-events-none opacity-60 md:opacity-100">
            {mounted && (
              <Canvas
                camera={{
                  fov: 45,
                  // Push camera a bit back on smaller screens to reduce perceived size.
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
            )}
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
            <p className="text-sm tracking-[0.35em] uppercase text-[#9AAFA3] mb-6 font-serif">
              The Wedding of
            </p>

            <h1
              className="text-6xl md:text-7xl lg:text-8xl text-[#8B5A6A] mb-2"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Shahana
            </h1>

            <p
              className="text-2xl md:text-3xl text-rose-800 mb-2"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              &amp;
            </p>

            <h2
              className="text-6xl md:text-7xl lg:text-8xl text-[#8B5A6A] mb-4"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Shareef
            </h2>

            <p className="text-lg md:text-xl text-[#9AAFA3] mb-8 font-serif italic">
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
        </section>

        {/* ================= COUNTDOWN ================= */}
        <section className="bg-[#7A8060] py-24 text-center relative">
          <div ref={countdownRef.ref} className="max-w-5xl mx-auto px-4">
            <h2
              className="text-5xl md:text-7xl text-white mb-2"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Countdown
            </h2>
            <p className="text-sm md:text-base text-[#9AAFA3]/90 tracking-wide mb-10 font-serif italic">
              For the most special day of our lives
            </p>

            {timeLeft && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
                {(
                  [
                    { key: 'days', label: 'DAYS' },
                    { key: 'hours', label: 'HOURS' },
                    { key: 'minutes', label: 'MINUTES' },
                    { key: 'seconds', label: 'SECONDS' },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="w-full max-w-[170px] border border-white/25 rounded-xl px-6 py-8 bg-transparent"
                  >
                    <p
                      className="text-4xl md:text-5xl text-white"
                      style={{ fontFamily: 'var(--font-great-vibes)' }}
                    >
                      {timeLeft[item.key]}
                    </p>
                    <p className="mt-3 text-xs md:text-sm text-white/70 tracking-[0.25em] font-serif">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
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
            className="text-5xl md:text-7xl text-[#2E6B5B] mb-3"
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
        <div className="relative h-0">
  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float z-20 text-center">
    
    <img
      src="/doodle2.png"
      alt="Couple doodle"
      className="max-w-[180px] md:max-w-[150px] drop-shadow-2xl"
    />

    <p className="mt-3 inline-block px-3 py-1 bg-white/80 text-gray-700 text-sm italic font-serif rounded-full shadow">
      let's celebrate ❤️
    </p>

  </div>
</div>
        {/* ================= DAY PROGRAMME (Section 4) ================= */}
        <section className="bg-[#f7ecd0] py-16 px-4 text-center overflow-hidden relative">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-7xl text-[#8a6a3b] mb-3"
              style={{ fontFamily: 'var(--font-great-vibes)' }}
            >
              Day Programme
            </h2>
            <p className="text-sm md:text-base text-[#8a6a3b]/90 tracking-wide mb-10 font-serif italic">
              12 September 2026
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

      </main>
    </div>
  );
}