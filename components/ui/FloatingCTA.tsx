'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export const FloatingCTA: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past hero (100vh)
            setIsVisible(window.scrollY > window.innerHeight * 0.8);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <Link
            href="/availability"
            className={`
        fixed bottom-24 right-6 md:right-10 z-40
        flex items-center gap-3
        bg-forest text-sand
        px-6 py-3.5 rounded-full
        shadow-2xl shadow-forest/30
        transition-all duration-500 ease-out
        hover:bg-forest-dark hover:scale-105
        hover:shadow-forest/50
        active:scale-95
        animate-slide-up
        group
      `}
            aria-label="Check villa availability"
        >
            <Calendar size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-sans text-sm font-semibold tracking-wide">
                Book Now
            </span>

            {/* Pulse ring effect */}
            <span className="absolute inset-0 rounded-full bg-forest/20 animate-ping opacity-30" />
        </Link>
    );
};
