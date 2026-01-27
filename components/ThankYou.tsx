'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const ThankYou: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Icon Animation
    tl.fromTo(circleRef.current,
      { strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 },
      { strokeDashoffset: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }
    )
      .fromTo(checkRef.current,
        { strokeDasharray: 60, strokeDashoffset: 60, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );

    // 2. Text Reveal
    tl.from('.ty-text', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    }, "-=1");

    // 3. Button Fade
    tl.from('.ty-btn', {
      opacity: 0,
      y: 10,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-sand flex flex-col items-center justify-center text-center px-6">

      {/* Animated Icon */}
      <div className="w-24 h-24 md:w-32 md:h-32 mb-12 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full text-forest-dark fill-none stroke-current stroke-[2px]">
          {/* Circle */}
          <circle
            ref={circleRef}
            cx="50" cy="50" r="45"
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
          />
          {/* Checkmark */}
          <path
            ref={checkRef}
            d="M30 52 L45 67 L70 35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto mb-16">
        <h1 className="ty-text text-4xl md:text-6xl font-serif text-forest-dark mb-6 tracking-tight">
          REQUEST <span className="italic">RECEIVED</span>
        </h1>
        <div className="ty-text w-px h-12 bg-forest-dark/20 mx-auto mb-8"></div>
        <p className="ty-text font-sans text-forest-dark/80 text-lg md:text-xl leading-relaxed font-light">
          Thank you. Our concierge team is reviewing your request and will contact you via WhatsApp shortly to finalize your sanctuary.
        </p>
      </div>

      {/* Action */}
      <Link
        href="/"
        className="ty-btn group relative px-10 py-4 overflow-hidden rounded-full border border-forest-dark/20 hover:border-forest-dark transition-colors duration-300 inline-block"
      >
        <span className="relative z-10 font-sans text-xs uppercase tracking-[0.2em] text-forest-dark group-hover:text-sand-light transition-colors duration-300 font-bold">
          Back to Home
        </span>
        <div className="absolute inset-0 bg-forest transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
      </Link>

    </div>
  );
};