'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const HERO_SLIDES = [
  {
    id: 1,
    src: '/herohomapage/1.webp',
    alt: 'Luxury Pool Villa in Ubud',
  },
  {
    id: 2,
    src: '/herohomapage/2.webp',
    alt: 'Jungle Canopy House',
  },
  {
    id: 3,
    src: '/herohomapage/3.webp',
    alt: 'Balinese Architecture Detail',
  },
];

export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Simple interval for slide switching - lightweight
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); // 6s per slide
    return () => clearInterval(interval);
  }, []);

  const scrollDown = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-forest selection:bg-sand selection:text-forest">

      {/* 1. Background Slideshow (CSS Transitions) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            {/* Ken Burns Effect via CSS - GPU Optimized */}
            <div className={`w-full h-full relative will-change-transform transform-gpu backface-hidden ${index === activeSlide ? 'animate-ken-burns' : ''}`}>
              <OptimizedImage
                src={slide.src}
                alt={slide.alt}
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-cover"
                sizes="100vw"
                quality={90}
                containerClassName="absolute inset-0 w-full h-full"
                fill
              />
            </div>

            {/* Cinematic Gradients */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-transparent to-forest/80" />
          </div>
        ))}
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">

        {/* Main Title - CSS Staggered Reveal */}
        <h1 className="font-serif text-sand mb-8 leading-none drop-shadow-2xl overflow-hidden flex flex-wrap justify-center gap-x-[0.05em] w-full">
          <span className="block whitespace-nowrap text-[12vw] md:text-[11vw] lg:text-[10vw] tracking-widest">
            {"STAYINUBUD".split('').map((char, i) => (
              <span
                key={i}
                className="inline-block animate-slide-up opacity-0"
                style={{ animationDelay: `${0.2 + (i * 0.05)}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle - Fade In */}
        <p className="font-sans text-sand/90 text-sm md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12 tracking-wide animate-fade-in opacity-0 [animation-delay:0.8s]">
          Curated sanctuaries in the heart of Bali&apos;s jungle.
        </p>

        {/* CTA Button - Square & Magnetic */}
        <div className="animate-fade-in opacity-0 [animation-delay:1s]">
          <Link
            href="/villas"
            className="group relative px-10 py-4 overflow-hidden border border-sand/40 hover:border-sand transition-all duration-500 inline-block backdrop-blur-sm bg-forest/10 hover:bg-forest/20 active:scale-95"
          >
            <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-sand group-hover:text-forest transition-colors duration-500 font-bold">
              Explore Villas
            </span>
            <div className="absolute inset-0 bg-sand transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </Link>
        </div>
      </div>

      {/* 3. Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-[2px] transition-all duration-700 ease-out ${idx === activeSlide ? 'w-12 bg-sand' : 'w-4 bg-sand/30 hover:bg-sand/60'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Hint */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce p-4 group opacity-60 hover:opacity-100 transition-opacity"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-sand to-transparent group-hover:h-16 transition-all duration-500" />
      </button>

    </section>
  );
};

