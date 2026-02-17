'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Villa } from '../../types';
import { ArrowUpRight, Search } from 'lucide-react';

interface VillasPageProps {
  villas: Villa[];
}

const FILTERS = ['All', '1-2 Bedrooms', 'Large Groups', 'Jungle View', 'Rice Field'];

export const VillasPage: React.FC<VillasPageProps> = ({ villas }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Override global scroll-smooth for this page only
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Simple hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter Logic
  const filteredVillas = useMemo(() => {
    return villas.filter(villa => {
      const matchesSearch = villa.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === '1-2 Bedrooms') return villa.bedrooms <= 2;
      if (activeFilter === 'Large Groups') return villa.bedrooms >= 3;
      if (activeFilter === 'Jungle View') return villa.features.some(f => f.toLowerCase().includes('jungle'));
      if (activeFilter === 'Rice Field') return villa.features.some(f => f.toLowerCase().includes('rice'));

      return true;
    });
  }, [villas, activeFilter, searchQuery]);

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
    <div className="min-h-screen bg-sand text-forest-dark">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/herohomapage/1.webp"
            alt="Ubud Villas Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-forest-dark/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-sand via-transparent to-transparent" />
        </div>

        {/* Hero Content - CSS animation only */}
        <div className={`relative z-10 text-center px-6 transition-all duration-1000 ease-out ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="block font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-sand/90 mb-6 py-2 px-4 rounded-full border border-sand/20 inline-block">
            The Collection
          </span>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-sand leading-[0.85] tracking-tight">
            CURATED<br />
            <span className="italic font-light text-sand/80">SANCTUARIES</span>
          </h1>
        </div>
      </section>


      {/* --- FILTER & SEARCH BAR --- */}
      <section className="bg-sand border-b border-forest/5 py-4 md:py-6 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Categories */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative font-sans text-xs uppercase tracking-[0.15em] py-2 transition-colors duration-300 whitespace-nowrap
                  ${activeFilter === filter ? 'text-forest-dark font-bold' : 'text-forest-dark/40 hover:text-forest-dark'}
                `}
              >
                {filter}
                {activeFilter === filter && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-forest-dark" />
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-forest-dark/30 w-4 h-4 group-focus-within:text-forest-dark transition-colors" />
            <input
              type="text"
              placeholder="Search villas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-forest/20 py-2 pl-8 focus:outline-none focus:border-forest-dark font-sans text-sm text-forest-dark placeholder-forest-dark/30 transition-colors"
            />
          </div>

        </div>
      </section>


      {/* --- VILLA GRID --- */}
      <section className="px-6 md:px-12 py-16 md:py-32 max-w-[1600px] mx-auto min-h-screen">
        <div className="flex flex-col gap-16 md:gap-32 lg:gap-40">
          {filteredVillas.length > 0 ? (
            filteredVillas.map((villa, index) => (
              <div
                key={villa.id}
                className={`group relative flex flex-col md:flex-row gap-8 md:gap-16 items-center
                  ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                `}
              >

                {/* Image Block */}
                <div className="w-full md:w-7/12 lg:w-3/5 overflow-hidden">
                  <Link href={`/villas/${villa.id}`} className="block relative aspect-[4/5] md:aspect-[4/3] w-full overflow-hidden bg-forest/5">
                    <div className="w-full h-full relative md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-105">
                      <Image
                        src={villa.imageUrl}
                        alt={villa.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/5 md:group-hover:bg-black/15 transition-colors duration-500" />

                      {/* Centered Explore Button - desktop only */}
                      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-sand/10 backdrop-blur-md border border-sand/30 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100">
                        <div className="w-20 h-20 rounded-full bg-sand text-forest-dark flex items-center justify-center">
                          <ArrowUpRight size={24} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Text Block */}
                <div className="w-full md:w-5/12 lg:w-2/5 flex flex-col items-start">

                  {/* Index & Decor */}
                  <div className="flex items-center gap-4 mb-6 opacity-40">
                    <span className="font-serif text-3xl italic">{String(index + 1).padStart(2, '0')}</span>
                    <div className="h-[1px] w-12 bg-forest-dark" />
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-dark mb-6 leading-[0.9]">
                    <Link href={`/villas/${villa.id}`} className="hover:opacity-60 transition-opacity">
                      {villa.name}
                    </Link>
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {villa.features?.slice(0, 3).map(feature => (
                      <span key={feature} className="text-[10px] uppercase tracking-widest border border-forest/20 px-3 py-1 rounded-full text-text-muted">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <p className="font-sans text-text-body text-sm leading-relaxed mb-8 max-w-sm">
                    {villa.description?.split('.').slice(0, 1).join('.')}...
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-xs uppercase tracking-widest text-text-muted">Starts from</span>
                    <span className="font-serif text-2xl text-forest-dark">{formatPrice(villa.pricePerNight)}</span>
                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="py-32 text-center">
              <h3 className="font-serif text-3xl text-forest-dark/40 italic">No sanctuaries found matching your criteria.</h3>
              <button onClick={() => { setActiveFilter('All'); setSearchQuery(''); }} className="mt-4 text-xs uppercase tracking-widest border-b border-forest-dark">Clear Filters</button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};