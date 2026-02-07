'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass } from 'lucide-react';

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
            {/* --- BACKGROUND CAROUSEL (Slides 2 & 3 only, Slide 1 is Server Rendered) --- */}
            <div className="absolute inset-0 z-0">
                {HERO_SLIDES.map((slide, index) => {
                    // Optimization: Logic to handle transitions matching the server slide
                    // We render ALL slides here to manage the crossfade state correctly client-side
                    // but relying on the Server Component for the INITIAL paint of Index 0.

                    const isActive = index === activeSlide;

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {/* 
                  STRATEGY: 
                  The First Slide (Index 0) is ALREADY rendered by the Server Component underneath this Client wrapper.
                  However, to maintain the loop, we render it here too.
                  Key: The "priority" and "sizes" are critical here.
               */}
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                loading="lazy" // Defer to Server LCP
                            />
                            {/* Clean Overlay match Server */}
                            <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                        </div>
                    )
                })}
            </div>

            {/* --- CONTENT LAYER (Interactive parts) --- */}
            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pb-32 pointer-events-none">
                <div className="max-w-4xl pointer-events-auto">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 md:gap-6 animate-fade-in opacity-0 [animation-delay:600ms] mt-12 md:mt-16">
                        <Link
                            href="/villas"
                            className="group flex items-center gap-3 md:gap-4 px-5 py-3 md:px-8 md:py-4 border border-white/30 hover:border-white hover:bg-white/10 transition-all duration-500 rounded-sm"
                        >
                            <Compass size={16} className="text-white group-hover:rotate-45 transition-transform duration-500 md:w-[18px] md:h-[18px]" />
                            <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white">Explore The Space</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
