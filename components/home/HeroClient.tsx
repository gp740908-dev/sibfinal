'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
// KineticText is handled by the server component for LCP, but can be added here for client-side navigation if needed

const HERO_SLIDES = [
    {
        id: 1,
        src: '/herohomapage/1.webp',
        alt: 'Luxury Pool Villa in Ubud',
    },
    {
        id: 2,
        src: '/herohomapage/2.webp',
        alt: 'Jungle Canopy House',
    },
    {
        id: 3,
        src: '/herohomapage/3.webp',
        alt: 'Balinese Architecture Detail',
    },
];

export const HeroClient: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* --- BACKGROUND CAROUSEL --- */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    {HERO_SLIDES.map((slide, index) => (
                        index === activeSlide && (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                    priority={index === 0} // Only priority for first image
                                />
                                {/* Clean Overlay matching Server */}
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>

            {/* --- CONTENT LAYER (Interactive parts) --- */}
            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pb-32 pointer-events-none">
                <div className="max-w-4xl pointer-events-auto">
                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="flex items-center gap-4 md:gap-6 mt-12 md:mt-16"
                    >
                        <Link href="/villas">
                            <MagneticButton className="group flex items-center gap-3 md:gap-4 px-6 py-4 md:px-8 md:py-5 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-500 rounded-full">
                                <Compass size={18} className="text-white group-hover:rotate-45 transition-transform duration-500" />
                                <span className="font-sans text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] text-white">
                                    Explore The Space
                                </span>
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
};
