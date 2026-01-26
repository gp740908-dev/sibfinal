'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const HERO_SLIDES = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1920',
    alt: 'Luxury Pool Villa in Ubud',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1920',
    alt: 'Jungle Canopy House',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1601369363069-425b09579de0?auto=format&fit=crop&q=80&w=1920',
    alt: 'Balinese Architecture Detail',
  },
];

export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textTitleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    // Initial Text Reveal
    const tl = gsap.timeline();

    tl.from('.hero-char', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.5,
    })
      .from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5');

  }, { scope: containerRef });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="hero-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const scrollDown = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-forest">
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <OptimizedImage
              src={slide.src}
              alt={slide.alt}
              priority={index === 0} // Critical for LCP
              className="object-cover"
              sizes="100vw"
              containerClassName="w-full h-full"
              fill
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-transparent to-forest/80 z-20" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 ref={textTitleRef} className="text-5xl md:text-7xl lg:text-9xl font-serif text-sand mb-6 tracking-widest leading-none drop-shadow-2xl overflow-hidden">
          {splitText('STAYINUBUD')}
        </h1>

        <p className="hero-sub text-sand/90 font-sans text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-md tracking-wide">
          Curated sanctuaries in the heart of Bali&apos;s jungle.
        </p>

        <Link
          href="/villas"
          className="hero-sub group relative px-8 py-3 overflow-hidden border border-sand transition-all duration-300 inline-block"
        >
          <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-sand group-hover:text-forest transition-colors duration-300 font-bold">
            Explore Villas
          </span>
          <div className="absolute inset-0 bg-sand transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom ease-out" />
        </Link>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-[3px] rounded-full transition-all duration-500 ease-out ${idx === activeSlide ? 'w-12 bg-sand' : 'w-6 bg-sand/30 hover:bg-sand/60'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div
        onClick={scrollDown}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-bounce cursor-pointer p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#F4FFC3" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
};
