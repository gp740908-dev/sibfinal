
'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MessageCircle, X } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa6';

// Social Media Data Configuration
const SOCIAL_LINKS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: FaWhatsapp,
    href: 'https://wa.me/6282269128232',
    colorClass: 'text-[#25D366]', // Official WhatsApp Green
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: FaTiktok,
    href: 'https://tiktok.com',
    colorClass: 'text-black', // Official TikTok Black
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    href: 'https://instagram.com',
    colorClass: 'instagram-gradient-icon', // Handled via SVG definition below
  },
];

export const SocialFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useGSAP(() => {
    const menuItems = menuRef.current?.children;
    if (!menuItems) return;

    if (isOpen) {
      // OPEN ANIMATION
      gsap.to(menuItems, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        stagger: -0.1, // Stagger from bottom to top
        duration: 0.5,
        ease: "back.out(1.7)",
        pointerEvents: "auto"
      });

      // Rotate Icon to X
      gsap.to(iconRef.current, {
        rotation: 135,
        duration: 0.3,
        ease: "power2.inOut"
      });

    } else {
      // CLOSE ANIMATION
      gsap.to(menuItems, {
        y: 20,
        autoAlpha: 0,
        scale: 0.5,
        stagger: 0.05, // Stagger quickly back down
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none"
      });

      // Rotate Icon back
      gsap.to(iconRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  }, { scope: containerRef, dependencies: [isOpen] });

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 right-6 md:right-10 z-50 flex flex-col items-end gap-4"
    >
      {/* SVG Definition for Instagram Gradient */}
      <svg width="0" height="0">
        <linearGradient id="instagram-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#f09433" offset="0%" />
          <stop stopColor="#e6683c" offset="25%" />
          <stop stopColor="#dc2743" offset="50%" />
          <stop stopColor="#cc2366" offset="75%" />
          <stop stopColor="#bc1888" offset="100%" />
        </linearGradient>
      </svg>
      <style>{`
        .instagram-gradient-icon path {
          fill: url(#instagram-gradient);
        }
      `}</style>

      {/* Social Buttons Stack */}
      <div
        ref={menuRef}
        className="flex flex-col gap-3 items-end mb-2"
      >
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 opacity-0 translate-y-5"
            aria-label={social.label}
          >
            {/* Tooltip Label */}
            <span className="absolute right-full mr-3 px-3 py-1 bg-white text-forest text-xs font-bold uppercase tracking-wider rounded-md shadow-md opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
              {social.label}
            </span>

            {/* Icon */}
            <social.icon size={28} className={social.colorClass} />
          </a>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-forest text-[#D3D49F] rounded-full shadow-xl flex items-center justify-center hover:bg-[#466a4e] transition-colors focus:outline-none focus:ring-4 focus:ring-[#D3D49F]/50"
        aria-label="Open Social Menu"
      >
        <div ref={iconRef} className="relative w-8 h-8 flex items-center justify-center">
          {/* We use the Plus icon because we rotate it 135deg to make an X, or 0 to be a Plus. 
               However, the prompt requested MessageCircle. 
               Let's use a Plus/X concept for the rotation, but if we want MessageCircle, rotation might look weird.
               Let's stick to the Plus icon concept for rotation, or overlay icons.
               
               Design Choice: Using a Plus icon for the fab is standard UX for 'Expand'. 
               But since it's a concierge, MessageCircle is better. 
               Let's use an icon swapping technique or just rotate the Plus.
               
               Let's use the MessageCircle, but on Open, we fade it to an X.
           */}
          {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
        </div>
      </button>
    </div>
  );
};
