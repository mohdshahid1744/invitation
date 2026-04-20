'use client';

import React, { useState, useEffect } from 'react';
import './flipCard.css';
// https://3d-countdown.netlify.app/
function FlipCard() {

   // * To flip all card
   const flipAllCards = (time:any) => {
      // * Breaking the time into sec, min, hours
      const days = Math.floor(time / 86400);
const hours = Math.floor(time / 3600) % 24;
const minutes = Math.floor(time / 60) % 60;
const seconds = Math.floor(time % 60);
flip(document.querySelector("[data-days-tens]"), Math.floor(days / 10));
flip(document.querySelector("[data-days-ones]"), days % 10);
flip(document.querySelector("[data-hours-tens]"), Math.floor(hours / 10));
flip(document.querySelector("[data-hours-ones]"), hours % 10);
flip(document.querySelector("[data-minutes-tens]"), Math.floor(minutes / 10));
flip(document.querySelector("[data-minutes-ones]"), minutes % 10);
flip(document.querySelector("[data-seconds-tens]"), Math.floor(seconds / 10));
flip(document.querySelector("[data-seconds-ones]"), seconds % 10);
   }

   // * call to flip single card 
   const flip = (flipCard: any, value: any) => {
    if (!flipCard) return; // ✅ prevent crash
  
    const top = flipCard.querySelector('.top');
    const bottom = flipCard.querySelector('.bottom');
    const startNumber = top.textContent;
  
    if (value == startNumber) return;
  
    top.textContent = startNumber;
    bottom.textContent = startNumber;
  
    flipCard.dataset.currentNumber = value;
    flipCard.dataset.nextNumber = value;
  
    flipCard.addEventListener('animationstart', () => {
      top.textContent = value;
    });
  
    flipCard.addEventListener('animationend', () => {
      bottom.textContent = value;
      flipCard.classList.remove('flip');
    });
  
    flipCard.classList.add('flip');
  };

   useEffect(() => {
    const startTime = new Date('2026-05-16T00:00:00').getTime();
      const interval = setInterval(() => {
         const currentTime = new Date().getTime();
         var totalCountDownTime = Math.ceil((startTime - currentTime) / 1000);
         if(totalCountDownTime == 0) clearInterval(interval)
         flipAllCards(totalCountDownTime)
      }, 250)

      // * Cleanup function
      return () => {
         clearInterval(interval)
      }
   }, []);

   return (
      <div>
         <div className="countdown-container">
            <div className="countdown-cards">
            <p className="mt-6 text-xs md:text-sm text-[#D8A7B1] tracking-[0.25em] font-serif">
            DAYS
          </p>
               <div className='card-container'>
                  <div className="flip-card" data-days-tens>
                     <div className="top text-[#D8A7B1]">0</div>
                     <div className="bottom text-[#D8A7B1]">0</div>
                  </div>
                  <div className="flip-card" data-days-ones>
    <div className="top text-[#D8A7B1]">0</div>
    <div className="bottom text-[#D8A7B1]    ">0</div>
  </div>
               </div>
            </div>
            <div className="countdown-cards">
            <p className="mt-6 text-xs md:text-sm text-[#D8A7B1] tracking-[0.25em] font-serif">
            HOURS
          </p>
               <div className='card-container' >
                  <div className="flip-card" data-hours-tens>
                     <div className="top text-[#D8A7B1]">2</div>
                     <div className="bottom text-[#D8A7B1]">2</div>
                  </div>
                  <div className="flip-card" data-hours-ones>
                     <div className="top text-[#D8A7B1]">4</div>
                     <div className="bottom text-[#D8A7B1]">4</div>
                  </div>
               </div>
            </div>
            <div className="countdown-cards">
            <p className="mt-6 text-xs md:text-sm text-[#D8A7B1] tracking-[0.25em] font-serif">
            MINUTES
          </p>
               <div className='card-container'>
                  <div className="flip-card" data-minutes-tens>
                     <div className="top text-[#D8A7B1]">0</div>
                     <div className="bottom text-[#D8A7B1]">0</div>
                  </div>
                  <div className="flip-card" data-minutes-ones>
                     <div className="top text-[#D8A7B1]">0</div>
                     <div className="bottom text-[#D8A7B1]">0</div>
                  </div>
               </div>
            </div>
            <div className="countdown-cards">
            <p className="mt-6 text-xs md:text-sm text-[#D8A7B1] tracking-[0.25em] font-serif">
            SECONDS
          </p>
               <div className='card-container'>
                  <div className="flip-card" data-seconds-tens>
                     <div className="top text-[#D8A7B1]">0</div>
                     <div className="bottom text-[#D8A7B1]">0</div>
                  </div>
                  <div className="flip-card " data-seconds-ones>
                     <div className="top text-[#D8A7B1]">0</div>
                     <div className="bottom text-[#D8A7B1]">0</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FlipCard