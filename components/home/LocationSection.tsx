'use client';

import React, { useState } from 'react';
import { Villa } from '../../types';
import { MapPin } from 'lucide-react';
import MapComponent from './MapComponent';

interface LocationSectionProps {
  villas: Villa[];
}

export const LocationSection: React.FC<LocationSectionProps> = ({ villas }) => {
  const [activeVillaId, setActiveVillaId] = useState<string>(villas[0]?.id || '');

  return (
    <section
      className="relative z-40 bg-sand flex flex-col lg:flex-row h-auto lg:h-[80vh] min-h-[600px] overflow-hidden"
      aria-labelledby="location-heading"
      role="region"
    >
      <h2 id="location-heading" className="sr-only">
        Villa Locations in Ubud
      </h2>

      {/* LEFT: Content */}
      <div className="loc-content w-full lg:w-1/3 bg-sand px-6 md:px-12 pt-16 md:pt-40 pb-12 md:pb-24 flex flex-col justify-center relative z-20 shadow-2xl">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-text-muted mb-4">
            <MapPin size={16} />
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-text-muted">The Locations</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-forest-dark leading-none mb-6">
            ROOTED IN <br /> <span className="italic">UBUD</span>
          </h2>
          <p className="text-text-body font-sans leading-relaxed">
            Our sanctuaries are hidden within the rice terraces and ancient forests, far enough to hear the silence, close enough to touch the culture.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {villas.map((villa) => (
            <button
              key={villa.id}
              className={`group cursor-pointer flex items-center justify-between border-b border-forest-dark/10 pb-4 transition-all duration-300 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:rounded-sm
                  ${activeVillaId === villa.id ? 'pl-4 border-forest-dark/40' : 'hover:pl-2'}
                `}
              onClick={() => setActiveVillaId(villa.id)}
              onMouseEnter={() => setActiveVillaId(villa.id)}
              aria-pressed={activeVillaId === villa.id}
            >
              <div className="flex-1 pr-6">
                <span className={`block font-serif text-xl md:text-2xl transition-all duration-500 ${activeVillaId === villa.id ? 'text-forest-dark translate-x-2' : 'text-forest-dark/40 group-hover:text-forest-dark/70'}`}>
                  {villa.name}
                </span>
                {activeVillaId === villa.id && (
                  <div className="flex items-center gap-4 mt-2 animate-fade-in pl-2">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-accent">
                      8.5069° S, 115.2625° E
                    </span>
                  </div>
                )}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeVillaId === villa.id ? 'bg-accent scale-100 opacity-100' : 'bg-forest-dark scale-0 opacity-0'}`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Map */}
      <div className="loc-map w-full lg:w-2/3 h-[500px] lg:h-full relative z-10 bg-[#e3e4b6]">
        <MapComponent villas={villas} activeVillaId={activeVillaId} />
      </div>

    </section>
  );
};

export default LocationSection;