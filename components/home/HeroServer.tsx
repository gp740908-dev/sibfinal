import React from 'react';
import Image from 'next/image';
import { HeroClient } from './HeroClient';
import { KineticText } from '@/components/ui/KineticText'; // Assuming this can run on server or be a client component wrapper

export const HeroServer: React.FC = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-forest-dark">
            {/* 
                1. STATIC LCP LAYER (Server Rendered)
                Immediate visual feedback before hydration.
            */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/herohomapage/1.webp"
                    alt="Luxury Pool Villa in Ubud"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={true}
                    fetchPriority="high"
                />
                {/* Premium Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Grain Texture */}
                <div className="grain-overlay" />
            </div>

            {/* 2. STATIC CONTENT LAYER */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pb-32 pointer-events-none">
                <div className="max-w-5xl">
                    {/* Eyebrow Text */}
                    <div className="flex items-center gap-4 mb-8 md:mb-10 animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
                        <div className="w-12 h-[1px] bg-white/60"></div>
                        <span className="font-sans text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] text-white/90">
                            Est. 2024 — Ubud, Bali
                        </span>
                    </div>

                    {/* Main Title - Mix of Serif and Sans for Contrast */}
                    <h1 className="flex flex-col font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white leading-[0.9] -ml-1 mb-8 opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                        <span className="block overflow-hidden">
                            <KineticText text="UBUD" className="block" />
                        </span>
                        <span className="block overflow-hidden text-white/90 italic font-light tracking-tight mt-2 md:mt-4">
                            Unfiltered
                        </span>
                    </h1>

                    {/* Description - Cleaner, narrower max-width */}
                    <p className="font-sans text-white/80 text-sm md:text-base leading-loose max-w-md animate-fade-in opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
                        A raw exploration of monolithic luxury. Where concrete meets the jungle canopy in a brutalist symphony of silence.
                    </p>
                </div>
            </div>

            {/* Static Footer Elements */}
            <div className="absolute bottom-10 left-6 md:left-16 lg:left-24 z-20 flex gap-12 animate-fade-in opacity-0 [animation-delay:1000ms] pointer-events-none items-end">
                <div>
                    <span className="block font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">
                        Coordinates
                    </span>
                    <span className="block font-sans text-xs md:text-sm text-white/90 font-medium tracking-wider">
                        8.5069° S, 115.2625° E
                    </span>
                </div>

                <div className="hidden md:block">
                    <span className="block font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">
                        Temperature
                    </span>
                    <span className="block font-sans text-xs md:text-sm text-white/90 font-medium tracking-wider">
                        27°C / 80°F
                    </span>
                </div>
            </div>

            {/* 3. CLIENT INTERACTIVE LAYER */}
            <HeroClient />
        </section>
    );
};
