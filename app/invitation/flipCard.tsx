'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import './flipCard.css';

const COUNTDOWN_TARGET_MS = new Date('2026-05-16T00:00:00').getTime();

function secsRemaining(): number {
  return Math.ceil((COUNTDOWN_TARGET_MS - Date.now()) / 1000);
}

/** Set digits immediately (no flip animation) so first paint matches the real countdown */
function applyDigitsQuiet(root: HTMLElement, totalSeconds: number) {
  const t = Math.max(0, totalSeconds);
  const days = Math.floor(t / 86400);
  const hours = Math.floor(t / 3600) % 24;
  const minutes = Math.floor(t / 60) % 60;
  const seconds = Math.floor(t % 60);

  const cells: [string, number][] = [
    ['[data-days-tens]', Math.floor(days / 10)],
    ['[data-days-ones]', days % 10],
    ['[data-hours-tens]', Math.floor(hours / 10)],
    ['[data-hours-ones]', hours % 10],
    ['[data-minutes-tens]', Math.floor(minutes / 10)],
    ['[data-minutes-ones]', minutes % 10],
    ['[data-seconds-tens]', Math.floor(seconds / 10)],
    ['[data-seconds-ones]', seconds % 10],
  ];

  cells.forEach(([selector, digit]) => {
    const flipCard = root.querySelector(selector);
    if (!flipCard) return;
    const top = flipCard.querySelector('.top');
    const bottom = flipCard.querySelector('.bottom');
    if (!top || !bottom) return;
    const s = String(digit);
    top.textContent = s;
    bottom.textContent = s;
  });
}

export default function FlipCard() {
  const rootRef = useRef<HTMLDivElement>(null);

  const flipAllCards = (time: number) => {
    const root = rootRef.current;
    if (!root) return;

    const days = Math.floor(time / 86400);
    const hours = Math.floor(time / 3600) % 24;
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time % 60);
    const q = (sel: string) => root.querySelector(sel);

    flip(q('[data-days-tens]'), Math.floor(days / 10));
    flip(q('[data-days-ones]'), days % 10);
    flip(q('[data-hours-tens]'), Math.floor(hours / 10));
    flip(q('[data-hours-ones]'), hours % 10);
    flip(q('[data-minutes-tens]'), Math.floor(minutes / 10));
    flip(q('[data-minutes-ones]'), minutes % 10);
    flip(q('[data-seconds-tens]'), Math.floor(seconds / 10));
    flip(q('[data-seconds-ones]'), seconds % 10);
  };

  const flip = (flipCard: Element | null, value: number) => {
    if (!flipCard) return;

    const top = flipCard.querySelector('.top');
    const bottom = flipCard.querySelector('.bottom');
    if (!top || !bottom) return;

    const startNumber = top.textContent;
    const sv = String(value);

    if (sv === startNumber) return;

    top.textContent = startNumber!;
    bottom.textContent = startNumber!;

    (flipCard as HTMLElement).dataset.currentNumber = sv;
    (flipCard as HTMLElement).dataset.nextNumber = sv;

    flipCard.addEventListener('animationstart', () => {
      top.textContent = sv;
    });

    flipCard.addEventListener('animationend', () => {
      bottom.textContent = sv;
      flipCard.classList.remove('flip');
    });

    flipCard.classList.add('flip');
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    applyDigitsQuiet(root, secsRemaining());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalCountDownTime = secsRemaining();
      if (totalCountDownTime <= 0) clearInterval(interval);
      flipAllCards(totalCountDownTime);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={rootRef}>
      <div className="countdown-container">
        <div className="countdown-cards">
          <p className="mt-6 text-xs md:text-sm text-[#E3BCC4] tracking-[0.25em] font-serif">
            DAYS
          </p>
          <div className="card-container">
            <div className="flip-card text-[#F5F1E8]" data-days-tens>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
            <div className="flip-card text-[#F5F1E8]" data-days-ones>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
          </div>
        </div>
        <div className="countdown-cards">
          <p className="mt-6 text-xs md:text-sm text-[#E3BCC4] tracking-[0.25em] font-serif">
            HOURS
          </p>
          <div className="card-container">
            <div className="flip-card text-[#F5F1E8]" data-hours-tens>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
            <div className="flip-card text-[#F5F1E8]" data-hours-ones>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
          </div>
        </div>
        <div className="countdown-cards">
          <p className="mt-6 text-xs md:text-sm text-[#E3BCC4] tracking-[0.25em] font-serif">
            MINUTES
          </p>
          <div className="card-container">
            <div className="flip-card text-[#F5F1E8]" data-minutes-tens>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
            <div className="flip-card text-[#F5F1E8]" data-minutes-ones>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
          </div>
        </div>
        <div className="countdown-cards">
          <p className="mt-6 text-xs md:text-sm text-[#E3BCC4] tracking-[0.25em] font-serif">
            SECONDS
          </p>
          <div className="card-container">
            <div className="flip-card text-[#F5F1E8]" data-seconds-tens>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
            <div className="flip-card text-[#F5F1E8]" data-seconds-ones>
              <div className="top text-[#F5F1E8]">0</div>
              <div className="bottom text-[#F5F1E8]">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
