import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowRight, Mail } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    
    setStatus('loading');
    
    try {
      const { error } = await supabase.from('subscribers').insert([{ email }]);
      
      if (error) {
        // If duplicate email, treat as success for UX
        if (error.code === '23505') { 
           setStatus('success');
        } else {
           setStatus('error');
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch (e) {
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

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-6 text-sand/60">
           <Mail size={32} strokeWidth={1} />
        </div>

        <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
          THE INNER <span className="italic text-accent-light">CIRCLE</span>
        </h2>
        
        <p className="font-sans text-lg opacity-70 mb-10 max-w-xl mx-auto leading-relaxed font-light">
          Join our private guest list for curated Ubud itineraries, secret villa openings, and stories from the jungle.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-md mx-auto">
          <div className="relative w-full group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address" 
              className="w-full bg-transparent border-b border-sand/30 py-3 px-2 text-sand placeholder-sand/30 focus:outline-none focus:border-sand transition-colors font-sans text-center md:text-left"
              disabled={status === 'loading' || status === 'success'}
            />
            <div className="absolute bottom-0 left-0 w-full h-px bg-sand scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </div>
          
          <button 
            onClick={handleSubscribe}
            disabled={status === 'loading' || status === 'success'}
            className="w-full md:w-auto min-w-[140px] flex items-center justify-center gap-2 bg-sand text-forest px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold hover:bg-white transition-all disabled:opacity-70 shadow-lg hover:shadow-xl"
          >
            {status === 'loading' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : status === 'success' ? (
              <span>Joined</span>
            ) : (
              <>
                <span>Join</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        {status === 'error' && (
          <p className="mt-4 text-xs text-red-300 animate-fade-in">
            Unable to connect. Please try again.
          </p>
        )}
        
        {status === 'success' && (
          <p className="mt-6 text-sm text-accent-light animate-fade-in font-serif italic">
            Welcome to the sanctuary.
          </p>
        )}
      </div>
    </section>
  );
};