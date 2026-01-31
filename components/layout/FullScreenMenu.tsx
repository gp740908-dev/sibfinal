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

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveImage(null);
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
      {/* 1. Background Layer - Opacity Reveal (Simpler than clip-path) */}
      <div
        className={`absolute inset-0 bg-forest w-full h-full transform-gpu transition-all ease-out
        ${isOpen ? 'opacity-100 duration-500' : 'opacity-0 duration-300'}`}
      >
        {/* Dynamic Image Layer */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-out
          ${activeImage ? 'opacity-30' : 'opacity-0'}`}
          style={{ backgroundImage: activeImage ? `url(${activeImage})` : 'none' }}
        />
        {/* Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/80 to-forest/40" />
      </div>

      {/* 2. Content Layer */}
      <nav className="relative z-10 w-full h-full flex flex-col p-6 md:p-12 lg:p-16 text-sand-light">

        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div
            className={`font-sans text-xs uppercase tracking-widest transform-gpu transition-all duration-300 ease-out
            ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
            style={{ transitionDelay: getDelay(100) }}
          >
            Menu
          </div>

          <button
            onClick={onClose}
            className={`group flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-sand/20 hover:bg-sand-light hover:text-forest-dark transform-gpu transition-all duration-300 ease-out
             ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
            style={{ transitionDelay: getDelay(100) }}
            aria-label="Close Menu"
          >
            <X size={24} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Main Navigation Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 content-center items-center">

          {/* Main Links */}
          <ul className="lg:col-span-8 flex flex-col gap-0 md:gap-2">
            {PRIMARY_LINKS.map((link, idx) => (
              <li key={idx} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={onClose}
                  onMouseEnter={() => setActiveImage(link.image)}
                  onMouseLeave={() => setActiveImage(null)}
                  className="group block relative py-1"
                >
                  <div
                    className={`text-[2.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[7rem] leading-[0.9] font-serif font-medium tracking-tight transform-gpu transition-all duration-500 ease-out
                      text-sand-light/80 group-hover:text-sand-light group-hover:translate-x-4
                      ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                    style={{ transitionDelay: getDelay(150 + (idx * 50)) }}
                  >
                    {link.label}
                  </div>
                  <span className="opacity-0 absolute top-1/2 -translate-y-1/2 -left-8 group-hover:left-0 group-hover:opacity-100 transition-all duration-300 text-sm font-sans tracking-widest hidden lg:block">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary Info / Links */}
          <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-start h-full pt-8 lg:pt-0 gap-8 lg:gap-12 lg:pl-12">

            {/* Pages */}
            <ul className="flex flex-col gap-3">
              {SECONDARY_LINKS.map((link, idx) => (
                <li key={idx} className="overflow-hidden">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`inline-block text-lg md:text-xl font-sans font-light tracking-wide hover:text-accent-light transform-gpu transition-all duration-400 ease-out
                      ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: getDelay(350 + (idx * 30)) }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className={`w-full h-px bg-sand/20 origin-left transform-gpu transition-all duration-500 ease-out
              ${isOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
              style={{ transitionDelay: getDelay(400) }}
            />

            {/* Contact & Socials */}
            <div
              className={`flex flex-col gap-8 w-full transform-gpu transition-all duration-400 ease-out
              ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: getDelay(450) }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest opacity-90 mb-2">Get in touch</span>
                <a href="mailto:host@stayinubud.com" className="font-serif text-2xl hover:underline">host@stayinubud.com</a>
              </div>

              <div className="flex gap-6">
                {SOCIAL_LINKS.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-sans uppercase tracking-widest hover:text-accent-light flex items-center gap-1 group"
                  >
                    {social.label}
                    <ArrowUpRight size={10} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div
          className={`w-full flex justify-between items-end text-[10px] md:text-xs uppercase tracking-widest transform-gpu transition-all duration-300 ease-out
          ${isOpen ? 'opacity-80' : 'opacity-0'}`}
          style={{ transitionDelay: getDelay(500) }}
        >
          <span>© {new Date().getFullYear()} StayinUbud</span>
          <span>Bali, Indonesia</span>
        </div>

      </nav>
    </div>
  );
};
