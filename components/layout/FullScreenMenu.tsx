'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'Our Villas', href: '/villas' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'The Journal', href: '/journal' },
  { label: 'Bali Guide', href: '/bali-guide' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to ensure render before animation starts
      requestAnimationFrame(() => setMounted(true));
    } else {
      document.body.style.overflow = '';
      setMounted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // If completely closed and unmounted animation state, we can return null (or keep it for exit ani)
  // For exit animations to work, we need to keep it rendered until transition finishes.
  // Ideally we should use a AnimatePresence-like logic, but CSS transitions work if we delay unmount.
  // For simplicity with this current structure, we rely on `isOpen` for visibility control 
  // and `mounted` for animation triggering. 
  // However, to keep it simple and effective as per previous working versions:
  if (!isOpen && !mounted) return null;
  // Wait, if !isOpen we usually want to show the exit animation.
  // But standard React conditional rendering unmounts immediately. 
  // Let's stick to the previous pattern: Render always if isOpen, or use a delay unmount.
  // The user wants "Overlay Fullscreen", so we can use a fixed div that is 'pointer-events-none' when closed.

  const showMenu = isOpen || mounted;

  // Custom Ease: cubic-bezier(0.4, 0.0, 0.2, 1) - "Standard Easing" / Material Design / iOS
  // It starts quickly and decelerates slowly.
  const LUXURY_EASE = "cubic-bezier(0.4, 0.0, 0.2, 1)";

  return (
    <div
      className={`fixed inset-0 z-[100] transition-visibility duration-1000 ${isOpen ? 'visible' : 'invisible delay-1000'}`}
    >
      {/* 1. Background Overlay 
          - Appears first
          - Opacity 0 -> 1
          - Static (No parallax/noise)
      */}
      <div
        className={`absolute inset-0 bg-forest-dark transition-opacity duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 2. Content Container */}
      <nav className="relative z-10 h-full w-full flex flex-col justify-center px-8 md:px-16 lg:px-24">

        {/* Header (Menu Label & Close) */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-8 md:p-12 lg:p-16">
          <span
            className={`text-sand/50 text-[10px] uppercase tracking-[0.25em] font-sans transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
            style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
          >
            Navigation
          </span>

          <button
            onClick={onClose}
            className={`group flex items-center gap-2 text-sand/50 hover:text-sand transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
            style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">Close</span>
            <X size={24} strokeWidth={1} className="transition-transform duration-500 group-hover:rotate-90" />
          </button>
        </div>

        {/* Main Links - Staggered Reveal */}
        <ul className="flex flex-col gap-2 md:gap-4">
          {NAV_LINKS.map((link, idx) => (
            <li key={link.href} className="overflow-hidden">
              <Link
                href={link.href}
                onClick={onClose}
                className={`block py-2 md:py-3 transition-opacity duration-300 hover:opacity-50`}
              >
                <div
                  className={`flex items-start gap-4 md:gap-8 transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    `}
                  style={{ transitionDelay: isOpen ? `${200 + (idx * 100)}ms` : '0ms' }}
                >
                  <span className="text-sand/30 text-xs md:text-sm font-sans pt-2 md:pt-4 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sand text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[0.9]">
                    {link.label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer Info - Lowest priority */}
        <div
          className={`absolute bottom-0 left-0 w-full p-8 md:p-16 flex justify-between items-end transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: isOpen ? '600ms' : '0ms' }}
        >
          <div className="flex flex-col gap-2">
            <span className="text-sand/30 text-[10px] uppercase tracking-widest">Enquiries</span>
            <a href="mailto:book@stayinubud.com" className="text-sand/80 font-serif text-xl hover:text-sand transition-colors">book@stayinubud.com</a>
          </div>

          <div className="flex gap-8">
            <span className="text-sand/30 text-[10px] uppercase tracking-widest">© 2024</span>
          </div>
        </div>

      </nav>
    </div>
  );
};
