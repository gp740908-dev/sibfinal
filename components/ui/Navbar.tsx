import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Globe, Menu, Instagram } from 'lucide-react';

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
    if (!navRef.current) return;

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
        // self.direction: -1 = scrolling up, 1 = scrolling down
        if (self.direction === -1) {
          // Scrolling up - show navbar
          showAnim.play();
        } else if (self.direction === 1 && self.progress > 0.05) {
          // Scrolling down - hide navbar
          showAnim.reverse();
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
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
  const iconStroke = isDarkState ? '#1a3a2e' : '#f5f0e8';

  // WhatsApp Icon Component (Vector/Outline Style)
  const WhatsAppIcon = ({ size = 24, color = iconStroke }: { size?: number; color?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

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
        <div className="px-6 md:px-12">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          
            {/* LEFT: Social Icons (Vector Style) */}
            <div className="flex items-center gap-4 md:gap-6 justify-start">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="transition-opacity duration-300 hover:opacity-60"
                aria-label="Instagram"
              >
                <Instagram size={24} strokeWidth={1.5} color={iconStroke} />
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer"
                className="transition-opacity duration-300 hover:opacity-60"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={24} color={iconStroke} />
              </a>
            </div>

            {/* CENTER: Logo Section */}
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center justify-center cursor-pointer group"
            >
              <div className={`flex items-center justify-center transition-all duration-700 ease-in-out
                ${isScrolled ? 'flex-row' : 'flex-col'}
              `}>
                
                {/* Icon Image */}
                <div className={`flex-shrink-0 transition-all duration-700 ease-in-out flex items-center justify-center
                  ${!isScrolled ? '-my-8 md:-my-12' : ''}
                `}>
                  <img 
                    src="/rumah.png" 
                    alt="StayinUBUD Icon" 
                    className={`w-auto object-contain transition-all duration-700 ease-in-out
                      ${isDarkState 
                        ? 'h-16 md:h-20' 
                        : 'h-40 md:h-52 brightness-0 invert'
                      } 
                    `}
                  />
                </div>
                
                {/* Collapsible Text Container */}
                <div 
                  className={`flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out
                    ${isScrolled 
                      ? 'max-w-0 opacity-0 ml-0 mt-0' 
                      : 'max-w-[250px] opacity-100 mt-2 md:mt-3'
                    }
                  `}
                >
                  <span className={`font-serif text-2xl md:text-3xl leading-none tracking-tight whitespace-nowrap ${textColor} transition-colors duration-700`}>
                    Stayin<span className="italic font-light">UBUD</span>
                  </span>
                  <span className={`font-sans text-[0.55rem] md:text-[0.65rem] uppercase tracking-[0.25em] leading-none mt-1 md:mt-1.5 whitespace-nowrap ${textColor} opacity-80 transition-colors duration-700`}>
                    Villa Bali Culture
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Language & Hamburger Menu */}
            <div className="flex items-center gap-4 md:gap-6 justify-end">
              
              {/* Language Selector */}
              <button 
                className="flex items-center gap-2 group transition-opacity duration-300 hover:opacity-60"
                aria-label="Language Selector"
              >
                <Globe size={24} strokeWidth={1.5} color={iconStroke} />
                <span className={`hidden md:block text-[10px] uppercase tracking-widest font-medium ${textColor} transition-colors duration-700`}>
                  EN
                </span>
              </button>

              {/* Hamburger Menu */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-3 group cursor-pointer"
                aria-label="Open Menu"
              >
                <span className={`hidden md:block font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-700 ${textColor}`}>
                  Menu
                </span>
                <div className="w-7 flex flex-col items-end gap-[5px]">
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
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-sand hover:text-white transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          
          <nav className="flex flex-col items-center gap-8">
            {['home', 'villas', 'journal', 'about', 'experiences', 'faq'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  onNavigate(item as any);
                  setIsMenuOpen(false);
                }}
                className="text-sand hover:text-white text-3xl md:text-5xl font-serif capitalize transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
