'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_SLIDES = [
  { id: 1, src: '/herohomapage/1.webp', alt: 'Luxury Pool Villa in Ubud' },
  { id: 2, src: '/herohomapage/2.webp', alt: 'Jungle Canopy House' },
  { id: 3, src: '/herohomapage/3.webp', alt: 'Balinese Architecture Detail' },
];

export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split Text Helper
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="inline-block opacity-0 translate-y-8 hero-char">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // 1. Initial Entry Animation & Scroll Parallax
  useGSAP(() => {
    const tl = gsap.timeline();

    // Text Reveal (Staggered)
    tl.to('.hero-char', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.04,
      ease: "power3.out",
      delay: 0.5
    })
      .to('.hero-subtitle', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8")
      .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6");

    // Parallax Effect on Scroll
    gsap.to(textRef.current, {
      yPercent: 50, // Move text down slower than scroll
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: containerRef });

  // 2. Slide Transition & Ken Burns Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Animate Slide Changes
  useGSAP(() => {
    // Current Slide Entry (Ken Burns + Fade In)
    const currentSlideEl = slideRefs.current[activeSlide];
    if (currentSlideEl) {
      // Reset scale and opacity for entry
      gsap.set(currentSlideEl, { zIndex: 10, opacity: 1 });
      gsap.fromTo(currentSlideEl.querySelector('img'),
        { scale: 1.1 },
        { scale: 1.0, duration: 8, ease: "power1.out" } // Subtle Ken Burns
      );
    }

    // Previous Slides Exit
    HERO_SLIDES.forEach((_, idx) => {
      if (idx !== activeSlide) {
        const slideEl = slideRefs.current[idx];
        if (slideEl) {
          gsap.to(slideEl, {
            opacity: 0,
            duration: 1.5,
            zIndex: 1,
            ease: "power2.inOut"
          });
        }
      }
    });
  }, [activeSlide]);

  return (
    <section ref={containerRef} className="relative w-full h-[100svh] overflow-hidden bg-forest">

      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            ref={el => { slideRefs.current[index] = el }}
            className="absolute inset-0 opacity-0 will-change-transform" // Default hidden
          >
            <OptimizedImage
              src={slide.src}
              alt={slide.alt}
              priority={index === 0} // Only priority 1 is critical, others preload via logic or native
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-transparent to-forest/60 mix-blend-multiply" />
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div ref={textRef} className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 will-change-transform">

        {/* Headline */}
        <h1 className="font-serif text-sand mb-8 leading-none drop-shadow-xl overflow-hidden">
          <span className="block text-[12vw] md:text-[11vw] lg:text-[10vw] tracking-widest whitespace-nowrap">
            {splitText('STAYINUBUD')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle opacity-0 translate-y-4 font-sans text-sand text-sm md:text-xl font-light max-w-2xl leading-relaxed mb-12 tracking-wide">
          Curated sanctuaries in the heart of Bali&apos;s jungle.
        </p>

        {/* CTA Button */}
        <div className="hero-cta opacity-0 translate-y-4">
          <Link
            href="/villas"
            className="group relative px-10 py-4 border border-sand/40 overflow-hidden rounded-full transition-all duration-300 inline-block backdrop-blur-sm bg-forest/10 hover:border-sand"
          >
            {/* Magnetic Fill Effect */}
            <div className="absolute inset-0 bg-sand translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out will-change-transform"></div>

            <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-sand group-hover:text-forest-dark transition-colors duration-300 font-bold">
              Explore Villas
            </span>
          </Link>
        </div>
      </div>

      {/* Custom Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-[2px] transition-all duration-700 ease-out rounded-full ${idx === activeSlide ? 'w-12 bg-sand opacity-100' : 'w-4 bg-sand opacity-30 hover:opacity-60'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
