
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Globe } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
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

  // Handle Scroll State
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    // Navbar hide/show on scroll direction
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
  }, { scope: navRef });

  // Determine Theme
  const isInnerPage = ['villas', 'journal', 'about', 'experiences', 'faq', 'thank-you', 'privacy', 'terms', 'villa-detail'].includes(currentView);
  // Scrolled OR Inner Page -> Dark Text (Forest/Olive) / White Background
  // Top of Home -> Light Text (White/Sand) / Transparent Background
  const isDarkState = isScrolled || isInnerPage;

  // Colors
  const textColor = isDarkState ? 'text-forest' : 'text-sand';
  const borderColor = isDarkState ? 'border-forest/10' : 'border-sand/10';
  const iconColorClass = isDarkState ? 'text-forest' : 'text-sand';

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ease-in-out border-b
          ${isDarkState 
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-8 border-transparent'
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
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className={`transition-colors duration-300 hover:opacity-70 ${iconColorClass}`}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>

          {/* CENTER: Brand / Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center cursor-pointer group"
          >
            {/* 
              LOGO IMPLEMENTATION:
              - Icon: Uses /logosib.png. Resizes dynamically.
              - Text: Visible only at top (Hero). Collapses to width 0 on scroll.
            */}
            <div className="flex items-center gap-4 transition-all duration-500">
              <img 
                src="/file.svg" 
                alt="StayinUBUD Icon" 
                className={`h-auto w-auto transition-all duration-500 object-contain
                  ${isDarkState ? 'h-12 md:h-14' : 'h-24 md:h-28 brightness-0 invert'} 
                `}
              />
              
              {/* Text Container - Collapses to zero width/opacity on scroll */}
              <div 
                className={`flex flex-col justify-center overflow-hidden transition-all duration-500 ease-in-out origin-left
                  ${isScrolled ? 'w-0 m-0 opacity-0 scale-95' : 'w-auto opacity-100 scale-100'}
                `}
              >
                <span className={`font-serif text-3xl md:text-4xl leading-none tracking-tight whitespace-nowrap ${textColor}`}>
                  Stayin<span className="italic font-light">UBUD</span>
                </span>
                <span className={`font-sans text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.3em] leading-none mt-2 whitespace-nowrap ${textColor} opacity-90`}>
                  Villa Bali Culture
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Utilities (Globe + Menu) */}
          <div className="flex items-center gap-6 justify-end">
            
            {/* Language / Globe */}
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
                   ${isDarkState ? 'bg-forest' : 'bg-sand'}
                 `} />
                 <span className={`block w-2/3 h-[1.5px] transition-all duration-300 group-hover:w-full 
                   ${isDarkState ? 'bg-forest' : 'bg-sand'}
                 `} />
                 <span className={`block w-full h-[1.5px] transition-all duration-300 group-hover:w-2/3 
                   ${isDarkState ? 'bg-forest' : 'bg-sand'}
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
        onNavigate={onNavigate}
      />
    </>
  );
};
