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
    // Navbar hide/show on scroll direction (Smart Hide)
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
        if (self.direction === -1) {
          // Scroll up - show navbar
          showAnim.play();
        } else if (self.direction === 1 && self.progress > 0.05) {
          // Scroll down - hide navbar
          showAnim.reverse();
        }
      }
    });
  }, { scope: navRef });

  // Determine Theme
  const isInnerPage = ['villas', 'journal', 'about', 'experiences', 'faq', 'thank-you', 'privacy', 'terms', 'villa-detail'].includes(currentView);
  
  // Logic: 
  // - Scrolled OR Inner Page = Dark Mode (White BG, Dark Text)
  // - Top of Home = Light Mode (Transparent BG, Light Text)
  const isDarkState = isScrolled || isInnerPage;

  // Colors & Classes
  const textColor = isDarkState ? 'text-forest' : 'text-sand';
  const borderColor = isDarkState ? 'border-forest/10' : 'border-sand/10';
  const iconColorClass = isDarkState ? 'text-forest' : 'text-sand';

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-700 ease-in-out border-b
          ${isDarkState 
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
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
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className={`transition-colors duration-300 hover:opacity-70 ${iconColorClass}`}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>

          {/* CENTER: Brand / Logo Stack */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center justify-start cursor-pointer group -my-2"
          >
            {/* Icon Image */}
            <img 
              src="/rumah.png" 
              alt="StayinUBUD Icon" 
              className={`w-auto object-contain transition-all duration-700 ease-in-out
                ${isDarkState 
                  ? 'h-16' // Scrolled Size
                  : 'h-20' // Top Size (Larger)
                } 
              `}
            />
            
            {/* Text Container - Collapses Vertically on Scroll */}
            <div 
              className={`flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out
                ${isScrolled 
                  ? 'max-h-0 opacity-0 mt-0' // Hidden state
                  : 'max-h-[60px] opacity-100 mt-1' // Visible state - closer spacing
                }
              `}
            >
              <span className={`font-serif text-xl md:text-2xl leading-none tracking-tight whitespace-nowrap ${textColor}`}>
                Stayin<span className="italic font-light">UBUD</span>
              </span>
              <span className={`font-sans text-[0.55rem] md:text-[0.65rem] uppercase tracking-[0.35em] leading-none mt-1.5 whitespace-nowrap ${textColor} opacity-90`}>
                Villa Bali Culture
              </span>
            </div>
          </div>

          {/* RIGHT: Utilities */}
          <div className="flex items-center gap-6 justify-end">
            
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
