'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

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

  // Only render current and next slide
  const visibleSlides = useMemo(() => {
    const nextSlide = (activeSlide + 1) % HERO_SLIDES.length;
    return [activeSlide, nextSlide];
  }, [activeSlide]);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-forest">

      {/* Background Slideshow - Only 2 slides max */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_SLIDES.map((slide, index) => {
          if (!visibleSlides.includes(index)) return null;

          const isActive = index === activeSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              {/* REMOVED Ken Burns - gunakan static image */}
              <OptimizedImage
                src={slide.src}
                alt={slide.alt}
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-cover scale-105" // Static subtle zoom
                sizes="100vw"
                quality={85} // Turunkan dari 90 ke 85
                containerClassName="absolute inset-0"
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

        {/* Simplified Title - Word-based animation instead of letter */}
        <h1 className="font-serif text-sand mb-8 leading-none drop-shadow-2xl animate-slide-up opacity-0 [animation-delay:0.2s]">
          <span className="block text-[12vw] md:text-[11vw] lg:text-[10vw] tracking-widest">
            STAYINUBUD
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-sand text-sm md:text-xl font-light max-w-2xl leading-relaxed mb-12 tracking-wide animate-fade-in opacity-0 [animation-delay:0.5s]">
          Curated sanctuaries in the heart of Bali&apos;s jungle.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in opacity-0 [animation-delay:0.7s]">
          <Link
            href="/villas"
            className="group relative px-10 py-4 border border-sand/40 hover:border-sand transition-all duration-300 inline-block backdrop-blur-sm bg-forest/10 hover:bg-sand active:scale-95"
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
