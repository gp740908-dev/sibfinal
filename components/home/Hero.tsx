import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onNavigate: (view: 'villas') => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  
  // Helper to split text for character animations
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

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Intro Animation (Ken Burns + Text Reveal)
    tl.to(bgRef.current, {
      scale: 1, // Scale down from 1.2 (set in style) to 1
      duration: 3,
      ease: "power2.out",
    })
    .to('.hero-char', {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 1,
      ease: "power3.out"
    }, "<0.5") // Start 0.5s after bg animation starts
    .fromTo('.hero-sub', {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        stagger: 0.2, // Stagger the subheadline and button
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

    // 2. Parallax Scroll Effect
    // Text moves up faster than background to create depth
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

    // Background moves slower
    gsap.to(bgRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-forest">
      
      {/* Layer 1: Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <img 
          ref={bgRef}
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1920" 
          alt="Bali Jungle Villa Infinity Pool" 
          className="w-full h-full object-cover origin-center" 
          style={{ transform: 'scale(1.2)' }} 
        />
        {/* Layer 1.5: Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-forest/20 to-forest/60 mix-blend-multiply z-10" />
      </div>

      {/* Layer 2: Content */}
      <div ref={textRef} className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto h-full pt-20">
        
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
        <button 
          onClick={() => onNavigate('villas')}
          className="hero-sub group relative px-10 py-4 overflow-hidden border border-sand transition-all duration-300"
        >
           <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-sand group-hover:text-forest transition-colors duration-300 font-bold">
            Explore Villas
           </span>
           <div className="absolute inset-0 bg-sand transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom ease-out" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 opacity-70 cursor-pointer" onClick={scrollDown}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#D3D49F" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
};