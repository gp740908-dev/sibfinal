
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, Instagram, Facebook, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'home' | 'villas' | 'journal' | 'about' | 'experiences' | 'faq' | 'thank-you' | 'privacy' | 'terms') => void;
}

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Initialize Timeline (Paused)
    tl.current = gsap.timeline({ paused: true });

    // 1. Container Visibility & Background Expansion
    tl.current
      .to(containerRef.current, {
        autoAlpha: 1, // specific GSAP property for visibility + opacity
        duration: 0
      })
      .fromTo('.menu-bg', 
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
        { 
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.8,
          ease: "power4.inOut"
        }
      )
      // 2. Header & Footer Reveal
      .from('.menu-header, .menu-footer', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")
      // 3. Stagger Main Links
      .from('.menu-link-item', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.5")
      // 4. Stagger Right Column Info
      .from('.menu-info-item', {
        x: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.8");

  }, { scope: containerRef });

  // Control Animation based on prop
  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      tl.current?.reverse();
      document.body.style.overflow = ''; // Unlock scroll
    }
  }, [isOpen]);

  const handleLinkClick = (view: any, hash?: string) => {
    onNavigate(view);
    onClose();
    // Short delay to allow view transition before hash scroll if needed
    if (hash) {
      setTimeout(() => {
        window.location.hash = hash;
      }, 100);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] invisible w-full h-full"
    >
      {/* Background Layer */}
      <div className="menu-bg absolute inset-0 bg-forest w-full h-full"></div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 text-sand">
        
        {/* A. Header */}
        <div className="menu-header flex justify-between items-center">
          <div className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
            Stayin<span className="italic font-light">UBUD</span>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <span className="hidden md:block font-sans text-xs uppercase tracking-widest">Close</span>
            {/* Removed border border-sand/30 rounded-full classes */}
            <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
               <X size={24} />
            </div>
          </button>
        </div>

        {/* Middle Section: Split Grid */}
        <div className="flex-1 flex flex-col md:flex-row items-center md:items-stretch py-12 md:py-0">
          
          {/* B. Left Column: Primary Nav */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start space-y-2 md:space-y-6">
            {[
              { label: 'Home', view: 'home' as const },
              { label: 'Our Villas', view: 'villas' as const }, // Updated to 'villas' view
              { label: 'Experiences', view: 'experiences' as const },
              { label: 'The Journal', view: 'journal' as const },
              { label: 'Our Story', view: 'about' as const },
              { label: 'FAQ', view: 'faq' as const },
            ].map((item, idx) => (
              <div key={idx} className="menu-link-item overflow-hidden">
                <button
                  onClick={() => handleLinkClick(item.view)}
                  className="group block text-4xl md:text-6xl lg:text-7xl font-serif text-sand leading-tight transition-all duration-500 hover:italic hover:translate-x-4 md:hover:translate-x-8 text-left"
                >
                  <span className="group-hover:text-accent-light transition-colors">{item.label}</span>
                </button>
              </div>
            ))}
          </div>

          {/* C. Right Column: Informative */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:items-end md:text-right mt-12 md:mt-0 space-y-12">
            
            {/* Socials */}
            <div className="menu-info-item flex flex-col gap-4 items-start md:items-end">
              <span className="font-serif text-lg italic opacity-50">Connect</span>
              <div className="flex flex-col gap-2 items-start md:items-end">
                <a href="#" className="flex items-center gap-2 font-sans text-sm md:text-base uppercase tracking-widest hover:text-accent-light transition-colors">
                  Instagram <ArrowUpRight size={14} />
                </a>
                <a href="#" className="flex items-center gap-2 font-sans text-sm md:text-base uppercase tracking-widest hover:text-accent-light transition-colors">
                  TikTok <ArrowUpRight size={14} />
                </a>
                <a href="#" className="flex items-center gap-2 font-sans text-sm md:text-base uppercase tracking-widest hover:text-accent-light transition-colors">
                  Facebook <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="menu-info-item flex flex-col gap-4 items-start md:items-end">
              <span className="font-serif text-lg italic opacity-50">Enquire</span>
              <div className="flex flex-col gap-2 items-start md:items-end font-sans text-lg">
                <a href="mailto:host@stayinubud.com" className="flex items-center gap-3 hover:text-accent-light transition-colors">
                  <Mail size={18} /> host@stayinubud.com
                </a>
                <a href="tel:+6281234567890" className="flex items-center gap-3 hover:text-accent-light transition-colors">
                  <Phone size={18} /> +62 812 3456 7890
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="menu-info-item flex flex-col gap-4 items-start md:items-end max-w-xs">
              <span className="font-serif text-lg italic opacity-50">Visit</span>
              <p className="flex items-start gap-3 text-left md:text-right font-sans opacity-80 leading-relaxed">
                 Jl. Raya Ubud No. 88, Gianyar, Bali, Indonesia 80571.
              </p>
            </div>

          </div>
        </div>

        {/* D. Footer */}
        <div className="menu-footer relative h-20 overflow-hidden">
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-full text-center opacity-10 pointer-events-none select-none">
             <span className="font-serif text-[5rem] md:text-[10rem] lg:text-[14rem] leading-none whitespace-nowrap text-sand">
               ESCAPE TO PARADISE
             </span>
          </div>
        </div>

      </div>
    </div>
  );
};
