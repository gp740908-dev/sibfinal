import React, { useState, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Villa } from '../../types';
import { MapPin } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Use React.lazy instead of next/dynamic to ensure compatibility with the single React instance in this ESM environment
const MapComponent = lazy(() => import('./MapComponent'));

interface LocationSectionProps {
  villas: Villa[];
}

export const LocationSection: React.FC<LocationSectionProps> = ({ villas }) => {
  const [activeVillaId, setActiveVillaId] = useState<string>(villas[0]?.id || '');
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom bottom",
        toggleActions: "play none none reverse"
      }
    });

    tl.from('.loc-content', {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
      .from('.loc-map', {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="flex flex-col lg:flex-row h-auto lg:h-[80vh] min-h-[600px] overflow-hidden">

      {/* LEFT: Content */}
      <div className="loc-content w-full lg:w-1/3 bg-sand px-6 md:px-12 py-12 md:py-24 flex flex-col justify-center relative z-20 shadow-2xl">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-forest/60 mb-4">
            <MapPin size={16} />
            <span className="font-sans text-xs uppercase tracking-[0.2em]">The Locations</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-forest leading-none mb-6">
            ROOTED IN <br /> <span className="italic">UBUD</span>
          </h2>
          <p className="text-forest/80 font-sans leading-relaxed">
            Our sanctuaries are hidden within the rice terraces and ancient forests, far enough to hear the silence, close enough to touch the culture.
          </p>
        </div>

        {/* Interactive Villa List */}
        <div className="flex flex-col gap-4">
          {villas.map((villa) => (
            <div
              key={villa.id}
              className={`group cursor-pointer flex items-center justify-between border-b border-forest/10 pb-4 transition-all duration-300
                ${activeVillaId === villa.id ? 'pl-4 border-forest/40' : 'hover:pl-2'}
              `}
              onMouseEnter={() => setActiveVillaId(villa.id)}
              onClick={() => setActiveVillaId(villa.id)}
            >
              <div>
                <span className={`block font-serif text-xl transition-colors ${activeVillaId === villa.id ? 'text-forest' : 'text-forest/60'}`}>
                  {villa.name}
                </span>
                {activeVillaId === villa.id && (
                  <span className="text-[10px] uppercase tracking-widest text-accent animate-fade-in">
                    Viewing Location
                  </span>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full transition-all ${activeVillaId === villa.id ? 'bg-forest scale-150' : 'bg-forest/20'}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Map */}
      <div className="loc-map w-full lg:w-2/3 h-[500px] lg:h-full relative z-10 bg-[#e3e4b6]">
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-sand/50 text-forest animate-pulse">Loading Map...</div>}>
          <MapComponent villas={villas} activeVillaId={activeVillaId} />
        </Suspense>
      </div>

    </section>
  );
};