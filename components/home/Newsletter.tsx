'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowRight, Mail, Check, AlertCircle } from 'lucide-react';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      const { error } = await supabase.from('subscribers').insert([{ email }]);

      if (error && error.code !== '23505') {
        throw error;
      }

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error('API Failed');

      setStatus('success');
      setEmail('');

    } catch (e) {
      console.error(e);
      setStatus('error');
    } finally {
      if (status !== 'success') {
        setTimeout(() => setStatus('idle'), 3000);
      }
    }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 bg-forest text-sand overflow-hidden border-t border-sand/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <motion.div
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6 text-sand/60"
          variants={fadeInUp}
        >
          <Mail size={32} strokeWidth={1} />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-sand"
          variants={fadeInUp}
        >
          THE INNER <span className="italic text-accent-light">CIRCLE</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="font-sans text-lg text-sand/80 mb-10 max-w-xl mx-auto leading-relaxed font-light"
          variants={fadeInUp}
        >
          Join our private guest list for curated Ubud itineraries, secret villa openings, and stories from the jungle.
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-md mx-auto"
          variants={fadeInUp}
        >
          {/* Input Container with Premium Focus Effect */}
          <div className="relative w-full">
            <motion.div
              className="absolute inset-0 rounded-lg bg-sand/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Your email address"
              aria-label="Email address"
              className="w-full bg-transparent border-b-2 py-4 px-2 text-sand placeholder-sand/40 focus:outline-none transition-colors font-sans text-center md:text-left relative z-10"
              style={{
                borderColor: isFocused ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'
              }}
              disabled={status === 'loading' || status === 'success'}
            />

            {/* Animated Underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-accent-light"
              initial={{ width: 0 }}
              animate={{ width: isFocused ? '100%' : 0 }}
              transition={{ duration: 0.5, ease: LUXURY_EASE }}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full md:w-auto min-w-[160px] flex items-center justify-center gap-2 bg-sand text-forest px-8 py-4 uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-70 overflow-hidden relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Hover Fill Effect */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
            />

            <span className="relative z-10 flex items-center gap-2">
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                  </motion.span>
                ) : status === 'success' ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} /> Joined
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Join <ArrowRight size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        </motion.form>

        {/* Status Messages */}
        <div aria-live="polite" className="min-h-[3rem] mt-6">
          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.p
                key="error"
                role="alert"
                className="flex items-center justify-center gap-2 text-xs text-red-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={14} />
                Unable to connect. Please try again.
              </motion.p>
            )}

            {status === 'success' && (
              <motion.p
                key="success"
                className="text-sm text-accent-light font-serif italic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                Welcome to the sanctuary. Check your inbox.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;