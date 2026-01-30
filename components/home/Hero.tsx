'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HERO_SLIDES = [
  { id: 1, src: '/herohomapage/1.webp', alt: 'Luxury Pool Villa in Ubud' },
  { id: 2, src: '/herohomapage/2.webp', alt: 'Jungle Canopy House' },
  { id: 3, src: '/herohomapage/3.webp', alt: 'Balinese Architecture Detail' },
];

export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);

      // Reset animation flag after transition
      setTimeout(() => setIsAnimating(false), 1500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const scrollDown = useCallback(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black">

      {/* Background Slideshow - Render all to prevent unmount flashing */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          const isPrev = index === (activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
          const shouldAnimate = isActive || isPrev;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                ${isActive
                  ? 'opacity-100 z-10'
                  : 'opacity-0 z-0 delay-1000' // Keep old slide visible while new one fades in
                }`}
            >
              {/* Static image with slow zoom animation */}
              <Image
                src={slide.src}
                alt={slide.alt}
                priority={index === 0}
                className={`object-cover will-change-transform ${shouldAnimate ? 'animate-slow-zoom' : ''}`}
                sizes="100vw"
                quality={85}
                fill
              />

              {/* Single gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-transparent to-forest/70" />
            </div>
          );
        })}
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">

        {/* Text Reveal Animation: Overflow Hidden + Slide Up */}
        <h1 className="font-serif text-sand mb-8 leading-none drop-shadow-2xl overflow-hidden py-2">
          <span className="block text-[12vw] md:text-[11vw] lg:text-[10vw] tracking-widest animate-reveal-up [animation-delay:0.2s]">
            STAYINUBUD
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-sand text-sm md:text-xl font-light max-w-2xl leading-relaxed mb-12 tracking-wide animate-fade-in opacity-0 [animation-delay:0.5s]">
          Curated sanctuaries in the heart of Bali&apos;s jungle.
        </p>

        {/* NEW: Trust Badge & Price Anchor - Phase 1 Confidence Booster */}
        <div className="flex items-center gap-4 mb-10 animate-fade-in opacity-0 [animation-delay:0.6s]">
          <div className="flex items-center gap-3 px-5 py-2 bg-sand/10 backdrop-blur-md rounded-full border border-sand/20 shadow-lg">
            <div className="flex items-center gap-1.5 border-r border-sand/30 pr-3">
              <svg className="w-4 h-4 text-gold fill-gold" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-sand text-xs md:text-sm font-medium">4.9/5</span>
            </div>
            <span className="text-sand/90 text-xs md:text-sm font-serif italic">From IDR 2.0M/night</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in opacity-0 [animation-delay:0.7s]">
          <Link
            href="/villas"
            className="group relative px-10 py-4 border-2 border-sand/70 hover:border-sand transition-all duration-300 inline-block backdrop-blur-sm bg-forest/10 hover:bg-sand active:scale-95"
            aria-label="Explore our luxury villas"
          >
            <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-sand group-hover:text-forest transition-colors duration-300 font-bold">
              Explore Villas
            </span>
          </Link>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-[2px] transition-all duration-500 ${idx === activeSlide ? 'w-12 bg-sand' : 'w-4 bg-sand/30'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Scroll down"
      >
        <svg className="w-6 h-6 text-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

    </section>
  );
};
