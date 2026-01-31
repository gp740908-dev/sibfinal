'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Home, BookOpen, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE, delay }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: LUXURY_EASE, delay }
  })
};

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Quick Links
const QUICK_LINKS = [
  { icon: Home, label: 'Home', href: '/', description: 'Start your journey' },
  { icon: MapPin, label: 'Our Villas', href: '/villas', description: 'Explore properties' },
  { icon: BookOpen, label: 'Journal', href: '/journal', description: 'Stories from Ubud' },
  { icon: MessageCircle, label: 'Contact', href: '/contact', description: 'Get in touch' },
];

interface NotFoundProps {
  onReturnHome?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/villas?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-forest overflow-hidden selection:bg-sand selection:text-forest-dark py-20">

      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent/10 blur-[150px] rounded-full pointer-events-none"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-sand/5 blur-[120px] rounded-full pointer-events-none"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 right-[15%] w-2 h-2 bg-sand/30 rounded-full"
          variants={floatAnimation}
          animate="animate"
        />
        <motion.div
          className="absolute top-[40%] left-[10%] w-3 h-3 bg-accent/20 rounded-full"
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 bg-sand/40 rounded-full"
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>

      {/* 2. Main Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl mx-auto">

        {/* Giant 404 with Animation */}
        <motion.div
          className="font-serif text-[10rem] md:text-[18rem] leading-[0.75] text-sand-light/10 tracking-tighter select-none relative"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 20px rgba(244,241,234,0.1)",
                "0 0 60px rgba(244,241,234,0.2)",
                "0 0 20px rgba(244,241,234,0.1)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            404
          </motion.span>

          {/* Floating Leaf Decoration */}
          <motion.div
            className="absolute -top-8 -right-8 md:-right-16 text-sand/20 text-6xl md:text-8xl"
            animate={{ rotate: [0, 10, -5, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            🌿
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          className="-mt-8 md:-mt-16 space-y-6 max-w-lg"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          <h1 className="text-3xl md:text-5xl font-serif text-sand-light tracking-tight">
            Lost in the Jungle
          </h1>

          <motion.div
            className="w-px h-12 bg-sand/30 mx-auto origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.5 }}
          />

          <p className="font-sans text-sand-light/70 text-sm md:text-base leading-relaxed">
            The path you seek has vanished into the mist. <br className="hidden md:block" />
            Perhaps the jungle has reclaimed it, or it never existed at all.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.form
          onSubmit={handleSearch}
          className="mt-10 w-full max-w-md"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sand/40 group-focus-within:text-sand transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for villas, experiences..."
              className="w-full bg-sand/5 border border-sand/20 rounded-full py-4 pl-12 pr-6 text-sand placeholder-sand/40 focus:outline-none focus:border-sand/50 focus:bg-sand/10 transition-all font-sans text-sm"
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-accent/50 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.form>

        {/* Quick Links */}
        <motion.div
          className="mt-12 w-full"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
        >
          <p className="text-sand/50 text-xs uppercase tracking-widest mb-6">Or explore these paths</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: LUXURY_EASE, delay: 0.8 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group flex flex-col items-center p-6 bg-sand/5 border border-sand/10 rounded-2xl hover:bg-sand/10 hover:border-sand/30 transition-all"
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-sand/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className="text-sand/70 group-hover:text-sand transition-colors" size={20} />
                  </motion.div>
                  <span className="font-sans text-sand text-sm font-medium">{link.label}</span>
                  <span className="font-sans text-sand/40 text-xs mt-1">{link.description}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          className="mt-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-10 py-4 overflow-hidden rounded-full border border-sand/30 hover:border-sand transition-all duration-300"
          >
            <span className="relative z-10 font-sans text-xs uppercase tracking-[0.25em] text-sand-light group-hover:text-forest-dark transition-colors duration-300 font-medium">
              Return to Sanctuary
            </span>
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="text-sand group-hover:text-forest-dark transition-colors" size={16} />
            </motion.div>
            {/* Fill Effect */}
            <motion.div
              className="absolute inset-0 bg-sand"
              initial={{ y: '100%' }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            />
          </Link>
        </motion.div>

      </div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-8 text-[10px] uppercase tracking-widest text-sand-light/30 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        StayinUbud © 2024
      </motion.div>

    </div>
  );
};

export default NotFound;