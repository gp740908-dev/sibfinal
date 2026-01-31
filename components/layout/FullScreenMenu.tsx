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
      // Small delay for mount animation
      requestAnimationFrame(() => setMounted(true));
    } else {
      document.body.style.overflow = '';
      setMounted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-forest-dark transition-opacity duration-500 ease-out
          ${mounted ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Content */}
      <nav className="relative z-10 h-full w-full flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-10 lg:p-12">
          <span
            className={`text-sand/60 text-xs uppercase tracking-[0.3em] font-sans transition-all duration-500 delay-100
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            Menu
          </span>

          <button
            onClick={onClose}
            className={`w-12 h-12 flex items-center justify-center rounded-full border border-sand/20 text-sand hover:bg-sand hover:text-forest-dark transition-all duration-300
              ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </header>

        {/* Main Navigation */}
        <div className="flex-1 flex items-center px-6 md:px-10 lg:px-20">
          <ul className="w-full max-w-4xl">
            {NAV_LINKS.map((link, idx) => (
              <li
                key={link.href}
                className="border-b border-sand/10 first:border-t"
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between py-5 md:py-6 transition-all duration-500 ease-out
                    ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: mounted ? `${150 + idx * 50}ms` : '0ms' }}
                >
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span className="text-sand/30 text-xs md:text-sm font-sans tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sand text-3xl md:text-5xl lg:text-6xl font-serif tracking-tight group-hover:text-sand/70 transition-colors duration-300">
                      {link.label}
                    </span>
                  </div>

                  <span className="text-sand/0 group-hover:text-sand/60 text-sm font-sans uppercase tracking-widest transition-all duration-300 group-hover:translate-x-0 translate-x-4">
                    View →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <footer
          className={`p-6 md:p-10 lg:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 transition-all duration-500 delay-500
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sand/40 text-xs uppercase tracking-widest">Enquiries</span>
            <a
              href="mailto:book@stayinubud.com"
              className="text-sand text-lg md:text-xl font-serif hover:text-sand/70 transition-colors"
            >
              book@stayinubud.com
            </a>
          </div>

          <div className="flex gap-8 text-sand/50 text-xs uppercase tracking-widest">
            <a href="https://instagram.com/stayinubud" target="_blank" className="hover:text-sand transition-colors">Instagram</a>
            <a href="https://tiktok.com/@stayinubud" target="_blank" className="hover:text-sand transition-colors">TikTok</a>
          </div>
        </footer>

      </nav>
    </div>
  );
};
