
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FullScreenMenu } from '../layout/FullScreenMenu';

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  onNavigate: (view: 'home' | 'villas' | 'journal' | 'about' | 'experiences' | 'faq' | 'thank-you' | 'privacy' | 'terms') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll State for styling changes (Transparent -> Solid)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    // Navbar scroll visibility animation (Hide on scroll down, Show on scroll up)
    const showAnim = gsap.from(navRef.current, { 
      yPercent: -100,
      paused: true,
      duration: 0.5,
      ease: "power3.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === 1 && self.progress > 0.05) {
            showAnim.reverse();
        } else {
            showAnim.play();
        }
      }
    });
  });

  // Pages with light backgrounds need dark text/logo immediately
  // Note: 'villa-detail' is usually passed as 'about' or handled via isInnerPage logic if passed directly
  const isInnerPage = ['villas', 'journal', 'about', 'experiences', 'faq', 'thank-you', 'privacy', 'terms', 'villa-detail'].includes(currentView);
  
  // Logic: 
  // If Scrolled OR Inner Page -> Dark Text / Original Logo / Solid Background
  // If Top of Home Page -> White Text / White Logo / Transparent Background
  const useDarkTheme = isScrolled || isInnerPage;

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[50] px-6 md:px-12 flex justify-between items-center transition-all duration-500 
          ${useDarkTheme
            ? 'bg-sand/95 backdrop-blur-md shadow-sm py-4 border-b border-forest/5' 
            : 'bg-transparent py-6'
          }
        `}
      >
        {/* Logo Section */}
        <div 
          onClick={() => onNavigate('home')}
          className="cursor-pointer relative z-50 flex items-center gap-3 group"
        >
           <div className="flex flex-col justify-center">
            {/* 
              LOGO IMPLEMENTATION:
              - Updated to use /logosib.png
              - Transition height for smooth scroll effect.
              - Use CSS filter to turn the logo white when on top of Hero image.
            */}
            <img 
              src="/logosib.png" 
              alt="StayinUBUD" 
              className={`h-auto w-auto transition-all duration-500 object-contain
                ${useDarkTheme ? 'h-10 md:h-12' : 'h-14 md:h-16 brightness-0 invert'} 
              `}
            />
          </div>
        </div>

        {/* Right Side: Menu Trigger & CTA */}
        <div className="flex items-center gap-8">
           
           {/* CTA Button (Desktop only) */}
           <button 
              onClick={() => onNavigate('villas')}
              className={`hidden md:block border px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300
                ${useDarkTheme
                  ? 'border-forest text-forest hover:bg-forest hover:text-sand' 
                  : 'border-sand text-sand hover:bg-sand hover:text-forest'
                }`}
           >
              Our Villas
           </button>

           {/* Menu Trigger Button */}
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="group flex items-center gap-3 cursor-pointer"
             aria-label="Open Menu"
           >
              <span className={`hidden md:block font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300
                 ${useDarkTheme ? 'text-forest' : 'text-sand'}
              `}>
                Menu
              </span>
              <div className="w-8 flex flex-col items-end gap-[6px]">
                {/* Hamburger Lines */}
                <span className={`block w-full h-[1.5px] group-hover:bg-accent transition-all duration-300 group-hover:w-2/3 
                  ${useDarkTheme ? 'bg-forest' : 'bg-sand'}
                `} />
                <span className={`block w-2/3 h-[1.5px] group-hover:bg-accent transition-all duration-300 group-hover:w-full 
                  ${useDarkTheme ? 'bg-forest' : 'bg-sand'}
                `} />
              </div>
           </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <FullScreenMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={onNavigate}
      />
    </>
  );
};
