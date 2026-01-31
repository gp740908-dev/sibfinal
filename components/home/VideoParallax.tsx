'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

export const VideoParallax: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);

  // Text Reveal Trigger
  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTextVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      textObserver.observe(sectionRef.current);
    }

    return () => textObserver.disconnect();
  }, []);

  // Simple Scroll Parallax Logic (Vanilla JS - lighter than GSAP)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const height = window.innerHeight;

      // Calculate percentage of section in view
      if (rect.top < height && rect.bottom > 0) {
        const progress = (height - rect.top) / (height + rect.height);
        // Move image slightly opposite to scroll
        // Range: -10% to +10%
        const moveY = (progress - 0.5) * 20;
        imageRef.current.style.transform = `translateY(${moveY}%) scale(1.1)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[80vh] w-full overflow-hidden bg-forest flex items-center justify-center">

      {/* Image Background Layer - CSS Parallax Container */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <div
          ref={imageRef}
          className="relative w-full h-[120%] -top-[10%] transition-transform duration-100 ease-linear lg:will-change-transform"
          style={{ transform: 'scale(1.1)' }}
        >
          <Image
            src="/imagehomepage/imagelaut.webp"
            alt="Bali ocean view"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-forest/40 mix-blend-multiply"></div>
      </div>

      {/* Centered Text Content */}
      <div
        className={`relative z-10 text-center px-6 mix-blend-screen transition-all duration-1000 ease-out transform
            ${textVisible ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-95'}
        `}
      >
        <h2 className="font-serif italic text-5xl md:text-7xl lg:text-9xl text-sand leading-[1.1] tracking-tight text-shadow-lg">
          <span className="block">Time stands still</span>
          <span className="block">in the heart</span>
          <span className="block">of the jungle.</span>
        </h2>
      </div>

    </section>
  );
};

export default VideoParallax;