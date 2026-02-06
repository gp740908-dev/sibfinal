'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    src: '/herohomapage/1.webp',
    alt: 'Luxury Pool Villa in Ubud',
    featuredTitle: 'The Infinity Pool',
    featuredDesc: 'Suspended over the jungle valley, offering a weightless swimming experience.'
  },
  {
    id: 2,
    src: '/herohomapage/2.webp',
    alt: 'Jungle Canopy House',
    featuredTitle: 'Architecture',
    featuredDesc: 'Sustainable bamboo structure blending seamlessly with the surrounding canopy.'
  },
  {
    id: 3,
    src: '/herohomapage/3.webp',
    alt: 'Balinese Architecture Detail',
    featuredTitle: 'Local Craftsmanship',
    featuredDesc: 'Hand-carved teak wood details sourced from local Ubud artisans.'
  },
];

// Kinetic Typography Component - Letter by letter reveal with hover breathing
const KineticText = ({
  text,
  className = '',
  baseDelay = 0,
  letterDelay = 30
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  letterDelay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text.split('').map((letter, index) => (
        <span
          key={index}
          className={`inline-block opacity-0 animate-letter-reveal transition-all duration-300 ${isHovered ? 'tracking-[0.05em]' : 'tracking-normal'
            }`}
          style={{
            animationDelay: `${baseDelay + index * letterDelay}ms`,
            animationFillMode: 'forwards',
            transitionDelay: `${index * 20}ms`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

// Accent dot with pulse animation
const AccentDot = () => (
  <span className="inline-block ml-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-accent rounded-sm animate-pulse-glow mb-1 sm:mb-2 md:mb-4" />
);

export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeData = HERO_SLIDES[activeSlide];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-forest-dark">

      {/* --- LAYER 1: BACKGROUND CAROUSEL --- */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          )
        })}
        {/* Cinematic Overlay: Darker on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest-dark/50 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" /> {/* General dim */}

        {/* Ambient Particles - Floating dust motes */}
        <div className="ambient-particles" aria-hidden="true" />

        {/* Subtle Grain Texture for organic feel */}
        <div className="grain-overlay" aria-hidden="true" />
      </div>


      {/* --- LAYER 2: CONTENT --- */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pb-32">

        <div className="max-w-4xl">
          {/* Accent Line - Animated draw */}
          <div className="w-0 h-[2px] bg-sand mb-8 animate-line-draw" />

          {/* Title with Kinetic Typography */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-sand leading-[0.9] mb-6 md:mb-8">
            <span className="block overflow-hidden">
              <KineticText
                text="UBUD"
                baseDelay={200}
                letterDelay={50}
              />
            </span>
            <span className="block overflow-hidden">
              <KineticText
                text="UNFILTERED"
                baseDelay={400}
                letterDelay={40}
              />
              <AccentDot />
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-text-inverse-muted text-xs sm:text-sm md:text-lg leading-relaxed max-w-md md:max-w-lg mb-8 md:mb-12 opacity-0 animate-fade-in [animation-delay:800ms] [animation-fill-mode:forwards] border-l border-sand/30 pl-4 md:pl-6">
            A raw exploration of monolithic luxury. Where concrete meets the jungle canopy in a brutalist symphony of silence.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 md:gap-6 opacity-0 animate-fade-in [animation-delay:1000ms] [animation-fill-mode:forwards]">
            <Link
              href="/villas"
              className="group flex items-center gap-3 md:gap-4 px-5 py-3 md:px-8 md:py-4 border border-sand/30 hover:border-sand hover:bg-sand/10 transition-all duration-500 rounded-sm magnetic-button"
            >
              <Compass size={16} className="text-sand group-hover:rotate-45 transition-transform duration-500 md:w-[18px] md:h-[18px]" />
              <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-sand">Explore The Space</span>
            </Link>
          </div>
        </div>

      </div>

      {/* --- LAYER 3: FOOTER ELEMENTS --- */}

      {/* Coordinates (Bottom Left) */}
      <div className="absolute bottom-12 left-6 md:left-16 lg:left-24 z-20 opacity-0 animate-fade-in [animation-delay:1200ms] [animation-fill-mode:forwards]">
        <span className="block font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] text-text-inverse-muted mb-1">
          8.5069° S, 115.2625° E
        </span>
        <span className="block font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] text-text-inverse-muted/70">
          Gianyar Regency, Bali
        </span>
      </div>

      {/* Scroll Indicator (Bottom Right) */}
      <div className="absolute bottom-12 right-6 md:right-16 lg:right-24 z-20 flex flex-col items-center gap-4 opacity-0 animate-fade-in [animation-delay:1200ms] [animation-fill-mode:forwards]">
        <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-text-inverse-muted vertical-lr rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-sand/30 animate-scroll-indicator" />
      </div>

    </section>
  );
};
