'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowRight, Mail, Check, AlertCircle } from 'lucide-react';

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
    <section className="relative py-32 md:py-40 px-6 md:px-12 bg-forest text-sand overflow-hidden border-t border-sand/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6 text-sand/60 animate-fade-in [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
          <Mail size={32} strokeWidth={1} />
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-sand animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          THE INNER <span className="italic text-accent-light">CIRCLE</span>
        </h2>

        {/* Description */}
        <p className="font-sans text-lg text-sand/80 mb-10 max-w-xl mx-auto leading-relaxed font-light animate-fade-in [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
          Join our private guest list for curated Ubud itineraries, secret villa openings, and stories from the jungle.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-md mx-auto animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]"
        >
          {/* Input Container with Premium Focus Effect */}
          <div className="relative w-full">
            {/* Focus Background - CSS Transition */}
            <div
              className={`absolute inset-0 rounded-lg bg-sand/5 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Your email address"
              aria-label="Email address"
              className={`w-full bg-transparent border-b-2 py-4 px-2 text-sand placeholder-sand/40 focus:outline-none transition-all duration-300 font-sans text-center md:text-left relative z-10 ${isFocused ? 'border-white/80' : 'border-white/20'}`}
              disabled={status === 'loading' || status === 'success'}
            />

            {/* Animated Underline - CSS Transition */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-accent-light transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isFocused ? 'w-full' : 'w-0'}`}
            />
          </div>

          {/* Submit Button - CSS Only */}
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full md:w-auto min-w-[160px] flex items-center justify-center gap-2 bg-sand text-forest px-8 py-4 uppercase tracking-widest text-xs font-bold transition-all duration-300 disabled:opacity-70 overflow-hidden relative group hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Hover Fill Effect - CSS Only */}
            <div className="absolute inset-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full group-hover:translate-x-0" />

            <span className="relative z-10 flex items-center gap-2">
              {status === 'loading' ? (
                <span className="flex items-center gap-2 animate-fade-in">
                  <Loader2 size={16} className="animate-spin" />
                </span>
              ) : status === 'success' ? (
                <span className="flex items-center gap-2 animate-fade-in">
                  <Check size={16} /> Joined
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Join <ArrowRight size={14} />
                </span>
              )}
            </span>
          </button>
        </form>

        {/* Status Messages - CSS Animations */}
        <div aria-live="polite" className="min-h-[3rem] mt-6">
          {status === 'error' && (
            <p
              role="alert"
              className="flex items-center justify-center gap-2 text-xs text-red-300 animate-slide-up"
            >
              <AlertCircle size={14} />
              Unable to connect. Please try again.
            </p>
          )}

          {status === 'success' && (
            <p className="text-sm text-accent-light font-serif italic animate-slide-up">
              Welcome to the sanctuary. Check your inbox.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;