import React, { useState, useEffect } from 'react';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12 py-6 flex justify-between items-center
      ${scrolled ? 'bg-sand/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent'}`}
    >
      <div className="text-forest font-serif text-2xl md:text-3xl font-bold tracking-tight cursor-pointer">
        Stayin<span className="italic font-light">UBUD</span>
      </div>

      <div className="hidden md:flex space-x-8 items-center text-forest font-sans text-sm tracking-widest uppercase font-medium">
        <a href="#villas" className="hover:text-accent-dark transition-colors duration-300">Villas</a>
        <a href="#experiences" className="hover:text-accent-dark transition-colors duration-300">Experiences</a>
        <a href="#about" className="hover:text-accent-dark transition-colors duration-300">Our Story</a>
        <button className="border border-forest px-6 py-2 hover:bg-forest hover:text-sand transition-all duration-300 rounded-sm">
          Book Your Stay
        </button>
      </div>

      <button className="md:hidden text-forest">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </button>
    </nav>
  );
};