'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Configuration for the slideshow
const SLIDE_DURATION = 6000; // 6 seconds
const HERO_SLIDES = [
  {
    id: 1,
    // Pool/Villa View
    src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1920',
    alt: 'Luxury Infinity Pool overlooking Jungle',
  },
  {
    id: 2,
    // Interior/Bedroom
    src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1920',
    alt: 'Master Bedroom with Balinese Decor',
  },
  {
    id: 3,
    // Jungle Detail
    src: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1920',
    alt: 'Lush Tropical Gardens',
  },
  {
    id: 4,
    // Aerial/Architecture
    src: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=1920',
    alt: 'Aerial View of Villa Estate',
  },
];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // State for Slideshow
  const [activeSlide, setActiveSlide] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // 1. Text Animation Logic (Runs once on mount)
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="hero-char inline-block opacity-0 translate-y-10 will-change-transform">
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

  // 2. Cycle Slides Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  // 3. GSAP Animations
  useGSAP(() => {
    // A. Text Reveal Sequence
    const tl = gsap.timeline();
    tl.to('.hero-char', {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 1,
      ease: "power3.out",
      delay: 0.5 // Wait a bit for first image to load
    })
      .fromTo('.hero-sub', {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");

    // B. Text Parallax (Moves slower than scroll)
    gsap.to(textRef.current, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: containerRef });

  // 4. Ken Burns Effect (Triggered on Slide Change)
  useGSAP(() => {
    const currentImg = imageRefs.current[activeSlide];
    if (currentImg) {
      // Reset scale instantly then animate
      gsap.fromTo(currentImg,
        { scale: 1.15 },
        {
          scale: 1.0,
          duration: SLIDE_DURATION / 1000 + 1, // Slightly longer than slide duration to prevent abrupt stop
          ease: "power1.out"
        }
      );
    }
  }, [activeSlide]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-forest">

      {/* LAYER 1: Background Slideshow */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out
              ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
            <img
              ref={(el) => { if (el) imageRefs.current[index] = el; }}
              src={slide.src}
              alt={slide.alt}
              className="object-cover w-full h-full"
              // Priority equivalent logic for first image
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Layer 1.5: Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-forest/10 to-forest/60 mix-blend-multiply z-20 pointer-events-none" />

        {/* Layer 1.6: Subtle Texture (Optional Luxury Feel) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-20 pointer-events-none" />
      </div>

      {/* LAYER 2: Text Content */}
      <div ref={textRef} className="relative z-30 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto h-full pt-20">

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-serif text-sand mb-6 tracking-widest leading-none drop-shadow-2xl">
          <span className="block whitespace-nowrap">
            {splitText("STAYINUBUD")}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub text-sand/90 font-sans text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-md tracking-wide">
          Curated sanctuaries in the heart of Bali's jungle.
        </p>

        {/* CTA Button */}
        <Link
          href="/villas"
          className="hero-sub group relative px-10 py-4 overflow-hidden border border-sand transition-all duration-300 inline-block"
        >
          <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-sand group-hover:text-forest transition-colors duration-300 font-bold">
            Explore Villas
          </span>
          <div className="absolute inset-0 bg-sand transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom ease-out" />
        </Link>
      </div>

      {/* LAYER 3: Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-[3px] rounded-full transition-all duration-500 ease-out
              ${idx === activeSlide ? 'w-12 bg-sand' : 'w-6 bg-sand/30 hover:bg-sand/60'}
            `}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 opacity-70 cursor-pointer hidden md:block" onClick={scrollDown}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#D3D49F" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
};
