'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Villa } from '../../types';
import { Loader2 } from 'lucide-react';

interface VillasPageProps {
  villas: Villa[];
}

type FilterCategory = 'All' | '1-2 Bedrooms' | 'Large Groups' | 'Jungle View' | 'Rice Field';

const FILTERS: FilterCategory[] = ['All', '1-2 Bedrooms', 'Large Groups', 'Jungle View', 'Rice Field'];

export const VillasPage: React.FC<VillasPageProps> = ({ villas }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter Logic
  const filteredVillas = useMemo(() => {
    if (activeFilter === 'All') return villas;

    return villas.filter(villa => {
      if (activeFilter === '1-2 Bedrooms') return villa.bedrooms <= 2;
      if (activeFilter === 'Large Groups') return villa.bedrooms >= 3;
      if (activeFilter === 'Jungle View') return villa.features.some(f => f.toLowerCase().includes('jungle'));
      if (activeFilter === 'Rice Field') return villa.features.some(f => f.toLowerCase().includes('rice'));
      return true;
    });
  }, [villas, activeFilter]);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.catalog-header > *', {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });

    tl.from('.filter-bar', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");

  }, { scope: containerRef });

  // Stagger animation for cards whenever filter changes
  useGSAP(() => {
    gsap.fromTo('.villa-card-item',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      }
    );
  }, { scope: containerRef, dependencies: [filteredVillas] });

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div ref={containerRef} className="pt-32 pb-20 min-h-screen bg-sand text-forest">

      {/* 1. Header Section */}
      <div className="catalog-header px-6 md:px-12 mb-16 text-center max-w-4xl mx-auto">
        <span className="block font-sans text-xs uppercase tracking-[0.3em] text-forest/60 mb-6">
          The Collection
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-forest leading-none tracking-tight mb-8">
          OUR SANCTUARIES
        </h1>
        <div className="w-px h-16 bg-forest/20 mx-auto mb-8"></div>
        <p className="font-sans text-lg md:text-xl text-forest/80 leading-relaxed max-w-2xl mx-auto">
          Each residence is chosen for its profound connection to the land.
          Discover a home that breathes with the rhythm of Ubud.
        </p>
      </div>

      {/* 2. Sticky Filter Bar */}
      <div className="filter-bar sticky top-24 z-30 mb-16 px-6">
        <div className="max-w-fit mx-auto bg-sand/80 backdrop-blur-md border border-forest/10 rounded-full px-2 py-2 flex flex-wrap justify-center gap-2 shadow-xl">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300
                ${activeFilter === filter
                  ? 'bg-forest text-sand font-bold shadow-md'
                  : 'text-forest/60 hover:text-forest hover:bg-forest/5'
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Villa Grid */}
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        {filteredVillas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {filteredVillas.map((villa) => (
              <Link
                key={villa.id}
                href={`/villas/${villa.id}`}
                className="villa-card-item group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6">
                  <img
                    src={villa.imageUrl}
                    alt={villa.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-forest mb-2 group-hover:underline underline-offset-4 decoration-forest/30">
                      {villa.name}
                    </h3>
                    <p className="font-sans text-sm text-forest/60">
                      {villa.bedrooms} Bedrooms • {villa.guests} Guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-xs text-forest/50 uppercase tracking-widest">From</p>
                    <p className="font-serif text-xl text-forest">
                      {formatPrice(villa.pricePerNight)}
                    </p>
                    <p className="font-sans text-xs text-forest/50">per night</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 opacity-60">
            <Loader2 className="animate-spin mb-4" />
            <p className="font-serif italic text-lg">Adjusting the view...</p>
          </div>
        )}
      </div>

    </div>
  );
};