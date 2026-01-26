'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Default to true so it blocks view initially if JS hasn't run, 
  // but we'll check session storage immediately.
  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    // Check if user has already seen the preloader in this session
    const hasLoaded = sessionStorage.getItem('hasLoaded');

    if (hasLoaded) {
      setIsVisible(false);
      document.body.style.overflow = ''; // Ensure scroll is unlocked
    } else {
      // Lock scroll while preloader is active
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useGSAP(() => {
    if (!isVisible) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        document.body.style.overflow = ''; // Unlock scroll
        sessionStorage.setItem('hasLoaded', 'true'); // Mark session
      }
    });

    // Phase 1: Counting Animation (0 to 100) - Fast!
    const counterProxy = { value: 0 };

    tl.to(counterProxy, {
      value: 100,
      duration: 0.5, // Ultra-fast (was 0.8)
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = Math.floor(counterProxy.value) + "%";
        }
      }
    });

    // Phase 2: Exit Content
    tl.to([counterRef.current, textRef.current], {
      y: -50,
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in"
    });

    // Phase 3: The Curtain Reveal (Background slides UP)
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.5, // Ultra-fast (was 0.8)
      ease: "power4.inOut"
    }, "-=0.2"); // Overlap slightly with content fade out

  }, { scope: containerRef, dependencies: [isVisible] });

  // If invisible (either finished or session exists), do not render
  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-forest flex flex-col items-center justify-center text-sand"
    >
      {/* Counter */}
      <div
        ref={counterRef}
        className="text-8xl md:text-[10rem] font-serif leading-none font-medium tabular-nums"
      >
        0%
      </div>

      {/* Brand Label */}
      <div
        ref={textRef}
        className="mt-6 font-sans text-xs md:text-sm uppercase tracking-[0.4em] opacity-80"
      >
        StayinUBUD
      </div>
    </div>
  );
};
