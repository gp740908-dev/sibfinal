'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-0 bg-forest text-sand flex flex-col justify-between py-12 px-6 md:px-12 h-[450px] md:h-[500px]"
    >
      {/* Top Section: CTA */}
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase opacity-70 mb-4">
          Your Sanctuary Awaits
        </p>
        <h2 className="font-serif text-5xl md:text-8xl lg:text-9xl mb-8 leading-none opacity-90">
          Ready to <br />
          <span className="italic font-light text-accent-light">Escape?</span>
        </h2>
        <Link
          href="/availability"
          className="group relative px-8 py-3 overflow-hidden rounded-full border border-sand/30 hover:border-sand transition-colors duration-300"
        >
          <span className="relative z-10 font-sans text-xs md:text-sm tracking-widest uppercase group-hover:text-forest transition-colors duration-300">
            Check Availability
          </span>
          <div className="absolute inset-0 bg-sand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
        </Link>
      </div>

      {/* Bottom Section: Links & Copyright */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end border-t border-sand/10 pt-8 mt-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-0 items-center md:items-start w-full md:w-auto">
          <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
            <Link href="/villas" className="font-sans text-xs uppercase tracking-widest hover:text-accent-light transition-colors">Villas</Link>
            <Link href="/experiences" className="font-sans text-xs uppercase tracking-widest hover:text-accent-light transition-colors">Experience</Link>
            <Link href="/bali-guide" className="font-sans text-xs uppercase tracking-widest hover:text-accent-light transition-colors">Guide</Link>
            <Link href="/journal" className="font-sans text-xs uppercase tracking-widest hover:text-accent-light transition-colors">Journal</Link>
            <Link href="/faq" className="font-sans text-xs uppercase tracking-widest hover:text-accent-light transition-colors">FAQ</Link>
          </div>
          <div className="flex gap-4 md:gap-8 md:border-l md:border-sand/20 md:pl-8 flex-wrap justify-center">
            <Link href="/privacy" className="font-sans text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent-light transition-colors">Privacy</Link>
            <Link href="/terms" className="font-sans text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent-light transition-colors">Terms</Link>
          </div>
        </div>

        <div className="text-center md:text-right w-full md:w-auto">
          <Link href="/" className="font-serif text-2xl mb-2 md:mb-1 block">Stayin<span className="italic">UBUD</span></Link>
          <div className="flex gap-4 justify-center md:justify-end opacity-50">
            <a href="https://instagram.com/stayinubud" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <span className="sr-only">Instagram</span>
              IG
            </a>
            <a href="https://twitter.com/stayinubud" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <span className="sr-only">Twitter</span>
              TW
            </a>
          </div>
          <p className="font-sans text-[10px] uppercase tracking-widest opacity-40 mt-2">© 2024 Luxury Rentals</p>
        </div>
      </div>
    </footer>
  );
};