'use client';

import React, { useRef, useState, useEffect } from 'react';

export const VideoParallax: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  // Lazy load video
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      if (!sectionRef.current || !videoRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const height = window.innerHeight;

      // Calculate percentage of section in view
      // 0 when top of section acts viewport bottom
      // 1 when bottom of section exits viewport top
      if (rect.top < height && rect.bottom > 0) {
        const progress = (height - rect.top) / (height + rect.height);
        // Move video slightly opposite to scroll
        // Range: -10% to +10%
        const moveY = (progress - 0.5) * 20;
        videoRef.current.style.transform = `translateY(${moveY}%) scale(1.1)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[80vh] w-full overflow-hidden bg-forest flex items-center justify-center">

      {/* Video Background Layer - CSS Parallax Container */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {isVisible ? (
          <video
            ref={videoRef}
            className="w-full h-[120%] -top-[10%] object-cover transition-transform duration-100 ease-linear lg:will-change-transform"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1920"
            style={{ transform: 'scale(1.1)' }} // Initial state
          >
            <source src="https://videos.pexels.com/video-files/6582697/6582697-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1920"
            alt="Video placeholder"
            className="w-full h-full object-cover"
          />
        )}

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