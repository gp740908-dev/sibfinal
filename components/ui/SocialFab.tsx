'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="flex flex-col gap-3 items-end mb-2 min-h-[56px]">
        <AnimatePresence>
          {isOpen && (
            SOCIAL_LINKS.map((social, index) => (
              <motion.a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg"
                aria-label={`Visit StayinUBUD on ${social.label}`}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                transition={{
                  duration: 0.3,
                  delay: (SOCIAL_LINKS.length - 1 - index) * 0.1, // Stagger bottom to top
                  ease: [0.16, 1, 0.3, 1] // Luxury ease
                }}
                whileHover={{ scale: 1.1 }}
              >
                {/* Tooltip Label */}
                <span className="absolute right-full mr-3 px-3 py-1 bg-white text-forest-dark text-xs font-bold uppercase tracking-wider rounded-md shadow-md opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap" aria-hidden="true">
                  {social.label}
                </span>

                {/* Icon */}
                <social.icon size={28} className={social.colorClass} aria-hidden="true" />
              </motion.a>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Main Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-forest-dark text-[#D3D49F] rounded-full shadow-xl flex items-center justify-center hover:bg-[#466a4e] transition-colors focus:outline-none focus:ring-4 focus:ring-[#D3D49F]/50"
        aria-label={isOpen ? "Close social menu" : "Open social menu"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Simpler icon swap logic for cleaner animation */}
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <X size={32} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MessageCircle size={32} />
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
};
