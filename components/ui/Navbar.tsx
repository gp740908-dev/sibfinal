'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

import { Globe, Search } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { FullScreenMenu } from '../layout/FullScreenMenu';
import { SearchModal } from '../search/SearchModal';



interface NavbarProps {
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView = 'home' }) => {
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Handle Scroll State and Visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      // Show/Hide Logic
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Determine Theme - Always use scroll-based logic (global consistency)
  // Removed `isInnerPage` check to unify behavior across all pages
  const isDarkState = isScrolled;

  const textColor = isDarkState ? 'text-forest-dark' : 'text-white';
  const borderColor = isDarkState ? 'border-forest-dark/10' : 'border-transparent';
  const iconColorClass = isDarkState ? 'text-forest-dark' : 'text-white';

  return (
    <>
      {/* Skip to main content - for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-forest focus:text-sand focus:px-6 focus:py-3 focus:rounded-md focus:shadow-xl"
      >
        Skip to main content
      </a>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[50] border-b transition-all duration-500 ease-in-out
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled
            ? 'bg-sand/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-6 border-transparent'
          }
          ${borderColor}
        `}
      >
        <div className="px-6 md:px-12 grid grid-cols-3 items-center">

          {/* LEFT: Social Icons */}
          <div className="flex items-center gap-4 md:gap-6 justify-start">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={`transition-colors duration-300 hover:opacity-70 ${iconColorClass}`}
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://wa.me/6282269128232"
              target="_blank"
              rel="noreferrer"
              className={`transition-colors duration-300 hover:opacity-70 ${iconColorClass}`}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>

          {/* CENTER: Brand / Logo Stack */}
          <Link
            href="/"
            className="flex flex-col items-center justify-start cursor-pointer group -my-2"
          >
            {/* Icon Image - Dual Layer for Color Control */}
            <div className={`relative w-auto transition-all duration-700 ease-in-out ${isScrolled ? 'h-0 opacity-0 w-0 overflow-hidden' : 'h-20 opacity-100'}`}>

              {/* 1. Layout Spacer (Invisible) */}
              <img src="/rumah.png" alt="" className="h-full w-auto opacity-0 pointer-events-none select-none" />

              {/* 2. Forest Version - Hidden on scroll */}
              <div
                className={`absolute inset-0 h-full w-full bg-forest [mask-image:url(/rumah.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] transition-opacity duration-500 opacity-0`}
              />

              {/* 3. White Version (Mask) - Visible at top */}
              <div
                className={`absolute inset-0 h-full w-full bg-white [mask-image:url(/rumah.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] transition-opacity duration-500 ${!isScrolled ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>

            {/* Text Container - ALWAYS VISIBLE (adjusted for scroll) */}
            <div
              className={`flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out
                ${isScrolled
                  ? 'mt-0 scale-90' // Slight scale down on scroll if desired, or keep 100
                  : 'mt-0 scale-100'
                }
              `}
            >
              <span className={`font-serif text-xl md:text-2xl leading-none tracking-tight whitespace-nowrap transition-colors duration-500 ${textColor}`}>
                Stayin<span className="italic font-light">UBUD</span>
              </span>
              <span className={`font-sans text-[0.55rem] md:text-[0.65rem] uppercase tracking-[0.35em] leading-none mt-1.5 whitespace-nowrap transition-colors duration-500 ${textColor} opacity-90`}>
                Villa Bali Culture
              </span>
            </div>
          </Link>

          {/* RIGHT: Utilities */}
          <div className="flex items-center gap-6 justify-end">

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-forest/5 transition-colors ${iconColorClass}`}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Language */}
            <button
              className={`hidden md:flex items-center gap-2 group transition-colors duration-300 ${iconColorClass}`}
              aria-label="Language Selector"
            >
              <Globe size={20} strokeWidth={1.5} />
              <span className={`text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2 group-hover:ml-0`}>
                EN
              </span>
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-3 group cursor-pointer"
              aria-label="Open Menu"
            >
              <span className={`hidden md:block font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300
                  ${textColor}
               `}>
                Menu
              </span>
              <div className="w-8 flex flex-col items-end gap-[5px]">
                <span className={`block w-full h-[1.5px] transition-all duration-300 group-hover:w-2/3 
                   ${isDarkState ? 'bg-forest-dark' : 'bg-white'}
                 `} />
                <span className={`block w-2/3 h-[1.5px] transition-all duration-300 group-hover:w-full 
                   ${isDarkState ? 'bg-forest-dark' : 'bg-white'}
                 `} />
                <span className={`block w-full h-[1.5px] transition-all duration-300 group-hover:w-2/3 
                   ${isDarkState ? 'bg-forest-dark' : 'bg-white'}
                 `} />
              </div>
            </button>
          </div>

        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <FullScreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
