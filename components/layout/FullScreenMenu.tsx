'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'Our Villas', href: '/villas' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'The Journal', href: '/journal' },
  { label: 'Bali Guide', href: '/bali-guide' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Luxury Easing - slow deceleration for premium feel
const LUXURY_EASE = [0.16, 1, 0.3, 1];

// Animation Variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: LUXURY_EASE, delay: 0.4 }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: {
    y: 100,
    opacity: 0,
    skewY: 5
  },
  visible: {
    y: 0,
    opacity: 1,
    skewY: 0,
    transition: {
      duration: 1,
      ease: LUXURY_EASE
    }
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 1, 1]
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE, delay: 0.2 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3 }
  }
};

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE, delay: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="fullscreen-menu"
          className="fixed inset-0 z-[100] flex flex-col"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background Overlay - Dark Luxury */}
          <motion.div
            className="absolute inset-0 bg-forest-dark" // Pure dark background
            variants={overlayVariants}
          />

          {/* Content Container */}
          <motion.nav
            className="relative z-10 h-full w-full flex flex-col justify-between px-6 md:px-12 lg:px-24 py-8 md:py-12"
            variants={containerVariants}
          >

            {/* Header: Close Button */}
            <motion.div
              className="w-full flex justify-end items-center"
              variants={headerVariants}
            >
              <button
                onClick={onClose}
                className="group flex items-center gap-4 text-sand/60 hover:text-sand transition-colors duration-500"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-sans opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block">
                  Close
                </span>
                <div className="relative w-12 h-12 flex items-center justify-center rounded-full border border-sand/10 group-hover:border-sand/40 transition-colors duration-500">
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.5, ease: LUXURY_EASE }}
                  >
                    <X size={20} strokeWidth={1} />
                  </motion.div>
                </div>
              </button>
            </motion.div>

            {/* Main Links - Centered Typographic List */}
            <motion.div
              className="flex-1 flex flex-col justify-center items-center"
              variants={containerVariants}
            >
              <ul className="flex flex-col items-center gap-2 md:gap-4">
                {NAV_LINKS.map((link, idx) => (
                  <motion.li
                    key={link.href}
                    className="overflow-hidden relative group"
                    variants={itemVariants}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block py-2 md:py-4 px-8 text-center"
                    >
                      {/* Number - Very subtle */}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full text-[10px] font-sans text-sand/20 tabular-nums tracking-widest opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all duration-500 hidden md:block">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Main Text */}
                      <span className="text-4xl md:text-6xl lg:text-8xl font-serif text-sand/50 group-hover:text-sand transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-tight leading-[0.9] block relative">
                        <span className="block group-hover:-translate-y-[10%] transition-transform duration-700">{link.label}</span>
                        {/* Underline Effect */}
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-sand/50 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100" />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Footer - Minimal Info */}
            <motion.div
              className="w-full flex justify-between items-end border-t border-sand/5 pt-8"
              variants={footerVariants}
            >
              <div className="flex flex-col gap-2">
                <span className="text-sand/30 text-[10px] uppercase tracking-[0.2em] font-sans">Contact</span>
                <a
                  href="mailto:hello@stayinubud.com"
                  className="font-serif text-lg text-sand/80 hover:text-sand transition-colors"
                >
                  hello@stayinubud.com
                </a>
              </div>

              <div className="flex gap-8">
                <a href="#" className="text-[10px] uppercase tracking-[0.2em] text-sand/40 hover:text-sand transition-colors">Instagram</a>
                <a href="#" className="text-[10px] uppercase tracking-[0.2em] text-sand/40 hover:text-sand transition-colors">WhatsApp</a>
              </div>
            </motion.div>

          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
