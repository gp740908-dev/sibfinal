'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowUpRight, Mail, Phone } from 'lucide-react';

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

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealImageRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true });

    tl.current
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
      .from('.menu-header', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")
      .from('.primary-link', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      .from('.secondary-link, .menu-info', {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.8");

  }, { scope: containerRef });

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current?.reverse();
      document.body.style.overflow = '';
      setActiveImage(null); // Reset image on close
    }
  }, [isOpen]);

  // Handle Hover Reveal Animation
  useEffect(() => {
    if (!revealImageRef.current) return;

    if (activeImage) {
      gsap.to(revealImageRef.current, {
        opacity: 0.4,
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.out'
      });
    } else {
      gsap.to(revealImageRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [activeImage]);

  const handleLinkClick = (href: string) => {
    onClose();
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] invisible w-full h-[100dvh]"
    >
      {/* 1. Backgrounds */}
      <div className="menu-bg absolute inset-0 bg-forest w-full h-full overflow-hidden">
        {/* Reveal Image Layer */}
        <div
          ref={revealImageRef}
          className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-in-out"
          style={{ backgroundImage: activeImage ? `url(${activeImage})` : 'none' }}
        />
        {/* Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/80 to-forest/60" />
      </div>

      {/* 2. Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 text-sand">

        {/* Header */}
        <div className="menu-header flex justify-between items-center">
          <div className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
            Stayin<span className="italic font-light">UBUD</span>
          </div>
          <button
            onClick={onClose}
            className="group flex items-center gap-3 hover:opacity-70 transition-opacity"
          >
            <span className="hidden md:block font-sans text-xs uppercase tracking-widest">Close</span>
            <div className="w-10 h-10 md:w-12 md:h-12 border border-sand/20 rounded-full flex items-center justify-center group-hover:bg-sand group-hover:text-forest transition-all duration-300">
              <X size={20} />
            </div>
          </button>
        </div>

        {/* Main Grid */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch overflow-hidden mt-8 md:mt-0">

          {/* LEFT: Nav Links */}
          <div className="w-full md:w-2/3 flex flex-col justify-center gap-8 md:gap-16">

            {/* Primary Links (Big) */}
            <div className="flex flex-col items-start gap-2">
              {PRIMARY_LINKS.map((item, idx) => (
                <div key={idx} className="primary-link overflow-hidden">
                  <button
                    onClick={() => handleLinkClick(item.href)}
                    onMouseEnter={() => setActiveImage(item.image)}
                    onMouseLeave={() => setActiveImage(null)}
                    className="group block text-[42px] md:text-[5rem] lg:text-[6rem] font-serif text-sand leading-[0.9] text-left transition-all duration-300 opacity-70 hover:opacity-100 hover:translate-x-4 mix-blend-overlay hover:mix-blend-normal"
                  >
                    {item.label}
                    <span className="opacity-0 -ml-4 group-hover:ml-4 group-hover:opacity-100 text-base md:text-2xl font-sans font-light tracking-wide align-middle transition-all duration-300">
                      Explore
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Secondary Links (Small) */}
            <div className="flex flex-wrap gap-6 md:gap-12 pl-1">
              {SECONDARY_LINKS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLinkClick(item.href)}
                  className="secondary-link text-sm md:text-base font-sans uppercase tracking-widest hover:text-accent-light transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all group-hover:w-full" />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT: Info (Cleaned) */}
          <div className="w-full md:w-1/3 flex flex-col justify-end items-start md:items-end text-left md:text-right pb-4 md:pb-12 space-y-8 md:space-y-12">

            <div className="menu-info flex flex-col gap-4">
              <span className="font-serif text-xl italic opacity-50">Say Hello</span>
              <a href="mailto:host@stayinubud.com" className="font-sans text-lg hover:underline decoration-1 underline-offset-4">host@stayinubud.com</a>
              <a href="tel:+6282269128232" className="font-sans text-lg hover:underline decoration-1 underline-offset-4">+62 822 6912 8232</a>
            </div>

            <div className="menu-info flex flex-col gap-4">
              <span className="font-serif text-xl italic opacity-50">Follow Us</span>
              <div className="flex gap-6 md:gap-4 md:flex-col items-start md:items-end">
                {['Instagram', 'TikTok', 'Facebook'].map((social) => (
                  <a
                    key={social}
                    href={`https://${social.toLowerCase()}.com/stayinubud`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs uppercase tracking-widest hover:text-accent-light flex items-center gap-2 group"
                  >
                    {social} <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
