'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowUpRight } from 'lucide-react';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIMARY_LINKS = [
  { label: 'Our Villas', href: '/villas', image: 'https://images.unsplash.com/photo-1576013551627-0cc60a6f1d22?auto=format&fit=crop&q=80&w=2000' },
  { label: 'Experiences', href: '/experiences', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=2000' },
  { label: 'The Journal', href: '/journal', image: 'https://images.unsplash.com/photo-1552802058-202bc9bd791e?auto=format&fit=crop&q=80&w=2000' },
  { label: 'Bali Guide', href: '/bali-guide', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80&w=2000' },
];

const SECONDARY_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/stayinubud' },
  { label: 'TikTok', href: 'https://tiktok.com/@stayinubud' },
  { label: 'Facebook', href: 'https://facebook.com/stayinubud' },
];

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setHoveredIndex(null);
      // Wait for close transition to clear image
      const timer = setTimeout(() => setActiveImage(null), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Helper: Only apply stagger delay on OPEN, instant on CLOSE
  const getDelay = (openDelayMs: number) => isOpen ? `${openDelayMs}ms` : '0ms';

  return (
    <div
      className={`fixed inset-0 z-[100] w-full h-[100dvh] pointer-events-none
      ${isOpen ? 'visible pointer-events-auto' : 'invisible'}`}
      style={{ transitionDelay: isOpen ? '0ms' : '500ms' }}
    >
      {/* 1. Background Layer */}
      <div
        className={`absolute inset-0 bg-forest-dark w-full h-full transform-gpu transition-all ease-out
        ${isOpen ? 'opacity-100 duration-500' : 'opacity-0 duration-300'}`}
      >
        {/* Dynamic Image Layer */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out
          ${activeImage ? 'opacity-40 scale-105' : 'opacity-0 scale-100'}
          `}
          style={{ backgroundImage: activeImage ? `url(${activeImage})` : 'none' }}
        />

        {/* Cinematic Noise Texture (Subtle) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest-dark/80 to-forest-dark/40" />
      </div>

      {/* 2. Content Layer */}
      <nav className="relative z-10 w-full h-full flex flex-col p-6 md:p-12 lg:p-16 text-sand">

        {/* Header */}
        <div className="flex justify-between items-start mb-8 md:mb-0">
          <div
            className={`font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] transform-gpu transition-all duration-500 ease-out
            ${isOpen ? 'translate-y-0 opacity-70' : '-translate-y-4 opacity-0'}`}
            style={{ transitionDelay: getDelay(100) }}
          >
            Navigation
          </div>

          <button
            onClick={onClose}
            className={`group flex items-center justify-center w-12 h-12 rounded-full border border-sand/10 hover:bg-sand hover:text-forest-dark transform-gpu transition-all duration-300 ease-out
             ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
            style={{ transitionDelay: getDelay(100) }}
            aria-label="Close Menu"
          >
            <X size={20} className="transition-transform duration-500 group-hover:rotate-90" />
          </button>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 content-center items-center gap-12 lg:gap-0">

          {/* Primary Navigation (Big Type) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <ul className="flex flex-col gap-2 md:gap-4 group/list">
              {PRIMARY_LINKS.map((link, idx) => (
                <li key={idx} className="overflow-hidden">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    onMouseEnter={() => { setActiveImage(link.image); setHoveredIndex(idx); }}
                    onMouseLeave={() => { setActiveImage(null); setHoveredIndex(null); }}
                    className="block relative py-2"
                  >
                    <div
                      className={`text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif tracking-tight leading-[0.9] transform-gpu transition-all duration-500 ease-out
                        ${hoveredIndex !== null && hoveredIndex !== idx ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-0'}
                        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
                      `}
                      style={{ transitionDelay: getDelay(150 + (idx * 50)) }}
                    >
                      <span className="relative z-10 block group-hover:translate-x-4 transition-transform duration-500 ease-out">
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secondary Info (Minimalist) */}
          <div className="lg:col-span-5 w-full flex flex-col justify-end lg:justify-center items-start lg:pl-24 h-full pt-12 lg:pt-0">

            <div className={`flex flex-col gap-12 w-full transform-gpu transition-all duration-500 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: getDelay(400) }}>

              {/* Secondary Links */}
              <ul className="flex flex-col gap-4">
                {SECONDARY_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-lg md:text-xl font-sans font-light tracking-wide text-sand/80 hover:text-sand hover:pl-2 transition-all duration-300 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="w-12 h-[1px] bg-sand/20" />

              {/* Contact */}
              <div className="flex flex-col gap-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Enquiries</span>
                  <a href="mailto:book@stayinubud.com" className="font-serif text-2xl hover:underline decoration-sand/30 underline-offset-4">book@stayinubud.com</a>
                </div>

                <div className="flex gap-6">
                  {SOCIAL_LINKS.map((social, idx) => (
                    <a key={idx} href={social.href} target="_blank" className="text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className={`w-full flex justify-between items-end text-[10px] uppercase tracking-widest opacity-40 transform-gpu transition-all duration-500
          ${isOpen ? 'opacity-40' : 'opacity-0'}`}
          style={{ transitionDelay: getDelay(600) }}
        >
          <span>Est. 2024</span>
          <span>Designed for Serenity</span>
        </div>

      </nav>
    </div>
  );
};
