
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp, FaGlobe } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state if user scrolls down more than 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Define color classes based on scroll state
  const navColor = isScrolled ? 'text-[#557C3E]' : 'text-white';
  const navBackground = isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${navBackground}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3 sm:px-6">
        {/* Left Section: Social Icons */}
        <div className="flex items-center justify-start gap-4">
          <a href="#" aria-label="Instagram" className={`${navColor} transition-colors hover:opacity-70`}>
            <FaInstagram size={22} />
          </a>
          <a href="#" aria-label="WhatsApp" className={`${navColor} transition-colors hover:opacity-70`}>
            <FaWhatsapp size={22} />
          </a>
        </div>

        {/* Center Section: Brand Identity */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            {/* Icon */}
            <div className={`transition-all duration-500 ease-in-out ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <Image src="/rumah.png" alt="StayinUBUD Logo" width={48} height={48} className="h-full w-full" />
            </div>

            {/* Text Container: Animates opacity and height */}
            <div
              className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
                isScrolled ? 'h-0 opacity-0 invisible' : 'h-auto opacity-100 visible pt-1'
              }`}
            >
              <h1 className={`font-serif text-2xl leading-none ${navColor}`}>StayinUBUD</h1>
              <p className={`text-[10px] uppercase tracking-widest ${navColor} opacity-90`}>
                VILLA BALI CULTURE
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Utilities */}
        <div className="flex items-center justify-end gap-4">
          <button aria-label="Language" className={`${navColor} transition-colors hover:opacity-70`}>
            <FaGlobe size={22} />
          </button>
          <button aria-label="Menu" className={`${navColor} transition-colors hover:opacity-70`}>
            <RxHamburgerMenu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
