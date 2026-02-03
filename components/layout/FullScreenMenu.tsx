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
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: {
    y: 80,
    opacity: 0,
    skewY: 2
  },
  visible: {
    y: 0,
    opacity: 1,
    skewY: 0,
    transition: {
      duration: 1.2,
      ease: LUXURY_EASE
    }
  },
  exit: {
    y: -40,
    opacity: 0,
    transition: {
      duration: 0.4,
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: LUXURY_EASE, delay: 0.6 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
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
          {/* Background Overlay */}
          <motion.div
            className="absolute inset-0 bg-forest-dark"
            variants={overlayVariants}
          />

          {/* Content */}
          <motion.nav
            className="relative z-10 h-full w-full flex flex-col justify-between px-6 md:px-16 lg:px-24 py-8 md:py-12"
            variants={containerVariants}
          >

            {/* Header */}
            <motion.div
              className="w-full flex justify-between items-center"
              variants={headerVariants}
            >
              <span className="text-sand/50 text-[10px] uppercase tracking-[0.3em] font-sans">
                Navigation
              </span>

              <button
                onClick={onClose}
                className="group flex items-center gap-3 text-sand/60 hover:text-sand transition-colors duration-300"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Close
                </span>
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.4, ease: LUXURY_EASE }}
                >
                  <X size={28} strokeWidth={1} />
                </motion.div>
              </button>
            </motion.div>

            {/* Main Links */}
            <motion.div
              className="flex-1 flex flex-col justify-center py-8 overflow-y-auto"
              variants={containerVariants}
            >
              <ul className="flex flex-col gap-0 md:gap-2">
                {NAV_LINKS.map((link, idx) => (
                  <motion.li
                    key={link.href}
                    className="overflow-hidden"
                    variants={itemVariants}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-baseline gap-4 md:gap-8 py-3 md:py-4"
                    >
                      <span className="text-sand/20 text-xs md:text-sm font-sans tabular-nums w-6 md:w-8">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <motion.span
                        className="text-sand text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[0.9]"
                        whileHover={{
                          x: 20,
                          color: 'rgba(241, 235, 225, 0.6)',
                          transition: { duration: 0.4, ease: LUXURY_EASE }
                        }}
                        whileTap={{ scale: 0.95, x: 10, opacity: 0.8 }} // Tactile feedback for mobile
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
              variants={footerVariants}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sand/30 text-[10px] uppercase tracking-widest">Enquiries</span>
                <a
                  href="mailto:book@stayinubud.com"
                  className="text-sand/80 font-serif text-lg md:text-xl hover:text-sand transition-colors duration-300"
                >
                  book@stayinubud.com
                </a>
              </div>

              <div className="flex gap-8">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="text-sand/40 text-[10px] uppercase tracking-widest hover:text-sand transition-colors duration-300"
                >
                  Instagram
                </a>
                <span className="text-sand/30 text-[10px] uppercase tracking-widest">
                  © 2024
                </span>
              </div>
            </motion.div>

          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
