'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const VideoParallax: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load video only when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!isVisible) return;

    // Parallax Effect: Video moves against the scroll to create depth
    gsap.fromTo(videoRef.current,
      { yPercent: 20 },
      {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Text Reveal Animation: Blur in
    gsap.fromTo(textRef.current,
      { opacity: 0, filter: "blur(20px)", scale: 0.95 },
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      }
    );

  }, { scope: sectionRef, dependencies: [isVisible] });

  return (
    <section ref={sectionRef} className="relative h-[80vh] w-full overflow-hidden bg-forest flex items-center justify-center">

      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
        {isVisible ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1920"
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
      <div ref={textRef} className="relative z-10 text-center px-6 mix-blend-screen">
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