import React from 'react';
import Image from 'next/image';
import { HeroClient } from './HeroClient';

export const HeroServer: React.FC = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-forest-dark">

            {/* 
        1. STATIC LCP LAYER (Server Rendered) 
        This is what the user sees IMMEDIATELY before JS loads.
        It perfectly matches the first slide of `HeroClient`.
      */}
            {/* 1. STATIC LCP LAYER (Server Rendered) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/herohomapage/1.webp"
                    alt="Luxury Pool Villa in Ubud"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={true} // High Priority LCP
                    fetchPriority="high"
                />
                {/* Clean Dark Overlay for White Text Contrast */}
                <div className="absolute inset-0 bg-black/30 md:bg-black/20" /> {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* 2. STATIC CONTENT LAYER (Server Rendered Text) */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pb-32 pointer-events-none">
                <div className="max-w-4xl">
                    {/* Accent Line */}
                    <div className="w-16 h-[2px] bg-white mb-8 animate-fade-in"></div>

                    {/* Title */}
                    <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] mb-6 md:mb-8 tracking-tight drop-shadow-lg">
                        <span className="block animate-slide-up [animation-delay:100ms]">UBUD</span>
                        <span className="block animate-slide-up [animation-delay:200ms] text-white">
                            UNFILTERED
                            <span className="text-white inline-block ml-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white mb-1 sm:mb-2 md:mb-4 rounded-sm"></span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="font-sans text-white/90 text-xs sm:text-sm md:text-lg leading-relaxed max-w-md md:max-w-lg mb-8 md:mb-12 animate-fade-in opacity-0 [animation-delay:400ms] border-l border-white/30 pl-4 md:pl-6 drop-shadow-md">
                        A raw exploration of monolithic luxury. Where concrete meets the jungle canopy in a brutalist symphony of silence.
                    </p>
                </div>
            </div>

            {/* Static Footer Elements */}
            <div className="absolute bottom-12 left-6 md:left-16 lg:left-24 z-20 animate-fade-in opacity-0 [animation-delay:800ms] pointer-events-none">
                <span className="block font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/80 mb-1 drop-shadow-sm">
                    8.5069° S, 115.2625° E
                </span>
                <span className="block font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60">
                    Gianyar Regency, Bali
                </span>
            </div>


            {/* 
        3. CLIENT INTERACTIVE LAYER
        Hydrates on top. It will take over the background logic for the carousel.
        It sits at Z-20/Z-0 (absolute) matching the structure.
      */}
            <HeroClient />

        </section>
    );
};
