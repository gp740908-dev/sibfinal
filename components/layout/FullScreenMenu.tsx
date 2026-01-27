'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowUpRight } from 'lucide-react';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIMARY_LINKS = [
  { label: 'Our Villas', href: '/villas', image: 'https://images.unsplash.com/photo-1576013551627-0cc60a6f1d22?auto=format&fit=crop&q=80&w=2000' },
  { label: 'Experiences', href: '/experiences', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=2000' },
  { label: 'The Journal', href: '/journal', image: 'https://images.unsplash.com/photo-1552802058-202bc9bd791e?auto=format&fit=crop&q=80&w=2000' },
  { label: 'Bali Guide', href: '/bali-guide', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80&w=2000' },
];

const SECONDARY_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/stayinubud' },
  { label: 'TikTok', href: 'https://tiktok.com/@stayinubud' },
  { label: 'Facebook', href: 'https://facebook.com/stayinubud' },
];

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealImageRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Initialize GSAP Timeline
  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 }); // Ensure hidden initially

    timeline.current = gsap.timeline({ paused: true })
      .to(containerRef.current, {
        autoAlpha: 1,
        duration: 0
      })
      .fromTo('.menu-bg',
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.8,
          ease: "power4.inOut"
        }
      )
      .fromTo('.nav-item-text',
        { y: "110%", autoAlpha: 0 },
        {
          y: "0%",
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "expo.out"
        }, "-=0.3")
      .fromTo('.secondary-link, .menu-info-item',
        { y: 15, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.03,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.5")
      .fromTo('.close-button',
        { scale: 0.8, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: "back.out(1.5)"
        }, "-=0.4");

  }, { scope: containerRef });

  // Control Animation Playback
  useEffect(() => {
    if (isOpen) {
      timeline.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      timeline.current?.reverse();
      document.body.style.overflow = '';
      // Small delay to clear image after menu is actually closed
      setTimeout(() => setActiveImage(null), 800);
    }
  }, [isOpen]);

  // Handle Image Reveal Animation
  useEffect(() => {
    if (!revealImageRef.current) return;

    if (activeImage) {
      gsap.to(revealImageRef.current, {
        opacity: 0.4, // Subtle opacity
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out'
      });
    } else {
      gsap.to(revealImageRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [activeImage]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] invisible w-full h-[100dvh]"
    >
      {/* 1. Background Layer */}
      <div className="menu-bg absolute inset-0 bg-forest w-full h-full overflow-hidden">
        {/* Dynamic Image Layer */}
        <div
          ref={revealImageRef}
          className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity will-change-transform"
          style={{ backgroundImage: activeImage ? `url(${activeImage})` : 'none' }}
        />
        {/* Grain/Texture Overlay (Optional for 'Organic' feel) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        />
        {/* Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/80 to-forest/40" />
      </div>

      {/* 2. Content Layer */}
      <nav className="relative z-10 w-full h-full flex flex-col p-6 md:p-12 lg:p-16 text-sand-light">

        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="menu-info-item font-sans text-xs uppercase tracking-widest opacity-90">
            Menu
          </div>

          <button
            onClick={onClose}
            className="close-button group flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-sand/20 hover:bg-sand-light hover:text-forest-dark transition-all duration-300 backdrop-blur-sm"
            aria-label="Close Menu"
            aria-expanded={isOpen}
            aria-controls="main-menu"
          >
            <X size={24} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Main Navigation Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 content-center items-center">

          {/* Main Links */}
          <ul className="lg:col-span-8 flex flex-col gap-0 md:gap-2">
            {PRIMARY_LINKS.map((link, idx) => (
              <li key={idx} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={onClose}
                  onMouseEnter={() => setActiveImage(link.image)}
                  onMouseLeave={() => setActiveImage(null)}
                  className="group block relative"
                >
                  <div className="nav-item-text text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.9] font-serif font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-4 text-sand-light/80 group-hover:text-sand-light">
                    {link.label}
                  </div>
                  <span className="opacity-0 absolute top-1/2 -translate-y-1/2 -left-8 group-hover:left-0 group-hover:opacity-100 transition-all duration-300 text-sm font-sans tracking-widest hidden lg:block">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary Info / Links */}
          <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-start h-full pt-12 lg:pt-0 gap-12 lg:pl-12">

            {/* Pages */}
            <ul className="flex flex-col gap-4">
              {SECONDARY_LINKS.map((link, idx) => (
                <li key={idx} className="overflow-hidden">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="secondary-link inline-block text-lg md:text-xl font-sans font-light tracking-wide hover:text-accent-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="w-full h-px bg-sand/20 secondary-link origin-left" />

            {/* Contact & Socials */}
            <div className="flex flex-col gap-8 w-full">
              <div className="menu-info-item flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest opacity-90 mb-2">Get in touch</span>
                <a href="mailto:host@stayinubud.com" className="font-serif text-2xl hover:underline">host@stayinubud.com</a>
              </div>

              <div className="menu-info-item flex gap-6">
                {SOCIAL_LINKS.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-sans uppercase tracking-widest hover:text-accent-light flex items-center gap-1 group"
                  >
                    {social.label}
                    <ArrowUpRight size={10} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="menu-info-item w-full flex justify-between items-end text-[10px] md:text-xs uppercase tracking-widest opacity-80">
          <span>© {new Date().getFullYear()} StayinUbud</span>
          <span>Bali, Indonesia</span>
        </div>

      </nav>
    </div>
  );
};
