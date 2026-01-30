'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, CloudSun, Leaf } from 'lucide-react';

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
    <section className="relative w-full min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-sand">

      {/* --- LEFT COLUMN: CONTENT --- */}
      <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24 lg:py-0 order-2 lg:order-1 lg:h-screen">

        {/* Top Tagline */}
        <div className="relative mb-8 lg:absolute lg:top-40 lg:mb-0 left-0 md:left-16 lg:left-24 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-[1px] bg-forest/30"></div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest/60">Bali, Indonesia</span>
        </div>

        {/* Main Title */}
        <div className="mb-8 relative">
          <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl leading-tight text-forest-dark">
            <span className="block animate-slide-up [animation-delay:100ms] mb-2 md:mb-4">A</span>
            <span className="block animate-slide-up [animation-delay:200ms] mb-2 md:mb-4">Sanctuary</span>
            <span className="block font-light italic text-forest/80 animate-slide-up [animation-delay:300ms]">for the Soul</span>
          </h1>
        </div>

        {/* Description */}
        <p className="font-sans text-stone-600 text-sm md:text-base leading-relaxed max-w-md mb-12 animate-fade-in opacity-0 [animation-delay:500ms]">
          Experience the raw elegance of natural textures.
          Linen, stone, and teak converge in a symphony of silence and luxury
          in the heart of the Ubud jungle.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 animate-fade-in opacity-0 [animation-delay:700ms]">
          <Link
            href="/villas"
            className="group flex items-center justify-between pl-8 pr-2 py-2 bg-forest-dark text-sand-light rounded-full hover:bg-forest transition-all duration-300 gap-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Discover Villas</span>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight size={14} />
            </div>
          </Link>

          <button className="group flex items-center gap-3 text-forest-dark hover:text-forest transition-colors">
            <div className="w-10 h-10 border border-forest/20 rounded-full flex items-center justify-center group-hover:border-forest transition-colors">
              <Play size={14} className="ml-1 fill-forest-dark text-forest-dark" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Watch Film</span>
          </button>
        </div>

        {/* Bottom Elements */}
        <div className="relative mt-16 w-full lg:absolute lg:bottom-12 lg:mt-0 lg:w-auto left-0 md:left-16 lg:left-24 right-6 lg:right-12 flex items-end justify-between animate-fade-in opacity-0 [animation-delay:1000ms]">

          {/* Weather / Temperature */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-forest/40">Temperature</span>
            <div className="flex items-center gap-2 text-forest-dark">
              <CloudSun size={18} />
              <span className="font-serif text-lg">27°C / Sunny</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden md:flex flex-col items-center gap-2 animate-bounce-slow">
            <span className="text-[10px] font-bold uppercase tracking-widest text-forest/40">Scroll</span>
            <div className="w-[1px] h-8 bg-forest/20"></div>
          </div>

        </div>

      </div>

      {/* --- RIGHT COLUMN: IMAGE CAROUSEL --- */}
      <div className="relative w-full h-[50vh] lg:h-screen order-1 lg:order-2 overflow-hidden">

        {/* Slides */}
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
                className="object-cover"
                priority={index === 0}
              />
              {/* Subtle Overlay for connection */}
              <div className="absolute inset-0 bg-forest/10 mix-blend-multiply" />
            </div>
          )
        })}

        {/* Floating Featured Card */}
        {isMounted && (
          <div className="absolute bottom-8 lg:bottom-24 left-8 right-8 lg:left-12 lg:right-auto lg:max-w-xs animate-slide-up-fade">
            <div className="bg-sand/90 backdrop-blur-md p-6 rounded-sm shadow-xl border-l-2 border-forest">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest/60">Featured Material</span>
                <Leaf size={14} className="text-forest/40" />
              </div>
              <h3 className="font-serif text-xl text-forest-dark mb-2 italic">
                {activeData.featuredTitle}
              </h3>
              <p className="font-sans text-xs text-forest/70 leading-relaxed">
                {activeData.featuredDesc}
              </p>
            </div>
          </div>
        )}

        {/* Slide Indicators (Right Side) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 rounded-full border border-sand/50
                        ${idx === activeSlide ? 'w-3 h-3 bg-sand' : 'w-2 h-2 bg-transparent hover:bg-sand/30'}
                    `}
            />
          ))}
        </div>

      </div>

    </section>
  );
};
