'use client';

import React, { useRef } from 'react';
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

  useGSAP(() => {
    // Parallax Effect: Video moves against the scroll to create depth
    // Using a timeline linked to the scroll position of the section
    gsap.fromTo(videoRef.current,
      { yPercent: 20 }, // Start shifted down
      {
        yPercent: -20, // Move up as we scroll down
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", // Start when top of section hits bottom of viewport
          end: "bottom top",   // End when bottom of section hits top of viewport
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
          start: "top 60%", // Trigger when section is near center of screen
          toggleActions: "play none none reverse"
        }
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative h-[80vh] w-full overflow-hidden bg-forest flex items-center justify-center">

      {/* 
        Video Background Layer 
        Height is set to 140% to allow for the vertical parallax movement without showing empty space
      */}
      <div className="absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1920"
        >
          {/* Using a high-quality stock video of wind blowing through fabric/curtains/nature for that sensory feel */}
          <source src="https://videos.pexels.com/video-files/6582697/6582697-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay (Opacity 40%) */}
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