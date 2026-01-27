'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Villa } from '../../types';
import { Loader2, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    // Header Reveal
    const tl = gsap.timeline();
    tl.from('.catalog-header > *', {
      y: 100,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2
    });

    tl.from('.filter-bar', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8");

  }, { scope: containerRef });

  // Scroll Animations for Villa Items
  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>('.villa-item');

    items.forEach((item, i) => {
      const image = item.querySelector('.villa-image');
      const text = item.querySelector('.villa-text');
      const index = item.querySelector('.villa-index');

      // Parallax Image
      gsap.fromTo(image,
        { y: -50, scale: 1.1 },
        {
          y: 50,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 // Smooth scrub
          }
        }
      );

      // Text Reveal
      gsap.fromTo(text?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 75%", // Triggers when top of item hits 75% of viewport height
          }
        }
      );

      // Index Number Reveal
      gsap.fromTo(index,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 0.2, // Keep subtle
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          }
        }
      );

    });

    // Refresh ScrollTrigger after filter change likely changes DOM height
    ScrollTrigger.refresh();

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
    <div ref={containerRef} className="pt-40 pb-32 min-h-screen bg-sand text-forest-dark overflow-hidden">

      {/* 1. Header Section - Editorial Style */}
      <div className="catalog-header px-6 md:px-12 mb-24 md:mb-32 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="block font-sans text-xs uppercase tracking-[0.4em] text-forest-dark/60 mb-8 ml-1">
              Curated Collection
            </span>
            <h1 className="text-[12vw] lg:text-[10vw] font-serif text-forest-dark leading-[0.85] tracking-tight">
              PRIVATE <br />
              <span className="italic font-light ml-[10vw] lg:ml-[5vw] block">SANCTUARIES</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-6">
            <p className="font-sans text-lg md:text-xl text-forest-dark/80 leading-relaxed max-w-md ml-auto">
              Selected for their silence, their spirit, and their profound connection to the Ubud jungle.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar - Minimalist Line */}
      <div className="filter-bar mb-32 px-6 sticky top-20 z-40 mix-blend-multiply pointer-events-none">
        {/* Note: pointer-events-none on wrapper, auto on children to allow click through fixed/sticky layers if needed, 
             but here we just want it to scroll away or stay? User said remove sticky before, but for 'Awwwards' usually it's sticky but subtle.
             Let's keep it static per previous request but styled nicely.
         */}
      </div>

      {/* Re-inserting the static filter bar from previous step but better positioned */}
      <div className="filter-bar mb-32 px-6 md:px-12">
        <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-forest/20 pb-6 max-w-[1600px] mx-auto">
          {/* Label */}
          <span className="font-sans text-xs uppercase tracking-widest text-forest-dark/40 py-2 mr-4">Filter By</span>

          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`font-sans text-xs uppercase tracking-[0.2em] transition-all duration-500 relative py-2 group
                ${activeFilter === filter
                  ? 'text-forest-dark'
                  : 'text-forest-dark/40 hover:text-forest-dark'
                }
              `}
            >
              {filter}
              <span className={`absolute bottom-0 left-0 h-[1px] bg-forest-dark transition-all duration-500 ease-out
                  ${activeFilter === filter ? 'w-full' : 'w-0 group-hover:w-full'}
              `} />
            </button>
          ))}
        </div>
      </div>


      {/* 3. The List - Staggered/Editorial */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
        {filteredVillas.length > 0 ? (
          <div className="flex flex-col gap-32 md:gap-48">
            {filteredVillas.map((villa, index) => (
              <Link
                key={villa.id}
                href={`/villas/${villa.id}`}
                className={`villa-item group relative block w-full
                   ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'} 
                   md:w-[85%] lg:w-[75%]
                `}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">

                  {/* Index Number (Decorative) */}
                  <div className="hidden md:block absolute -left-12 top-0 -translate-x-full villa-index opacity-0 pointer-events-none z-0">
                    <span className="font-serif text-[12rem] leading-none text-forest-dark opacity-5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Image Section */}
                  <div className={`
                        relative overflow-hidden aspect-[3/4] md:aspect-[4/3] w-full
                        md:col-span-7 lg:col-span-8
                        ${index % 2 === 1 ? 'md:order-last' : ''}
                    `}>
                    <div className="villa-image w-full h-[120%] relative -top-[10%] bg-forest/10">
                      <img
                        src={villa.imageUrl}
                        alt={villa.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Floating 'View' Button visible on hover */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sand rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-10 shadow-2xl">
                      <span className="font-sans text-xs uppercase tracking-widest text-forest-dark font-bold group-hover:tracking-[0.3em] transition-all">Explore</span>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="villa-text md:col-span-5 lg:col-span-4 relative z-10 px-4 md:px-0">
                    {/* Mobile Index */}
                    <span className="md:hidden block font-sans text-xs font-bold text-forest-dark/40 mb-4 tracking-widest">
                      NO. {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {(villa.features || []).slice(0, 2).map(f => ( // Only show 2 tags
                        <span key={f} className="font-sans text-[10px] uppercase tracking-widest border border-forest/20 rounded-full px-3 py-1 text-forest-dark/60">
                          {f}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-dark mb-6 leading-none">
                      {villa.name}
                    </h2>

                    <p className="font-sans text-sm md:text-base text-forest-dark/70 leading-relaxed mb-8 border-l border-forest/20 pl-6">
                      "{villa.description.split('.')[0]}."
                      <br />
                      <span className="text-xs uppercase tracking-widest mt-2 block active:text-forest-dark opacity-60">
                        {villa.bedrooms} BD  •  {villa.guests} Guests
                      </span>
                    </p>

                    <div className="flex items-center gap-4 group/btn">
                      <span className="font-sans text-xs uppercase tracking-widest text-forest-dark font-bold">
                        From {formatPrice(villa.pricePerNight)}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-forest/20 flex items-center justify-center group-hover/btn:bg-forest group-hover/btn:text-sand-light transition-all">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 opacity-60">
            <Loader2 className="animate-spin mb-4" />
            <p className="font-serif italic text-lg">Curating the collection...</p>
          </div>
        )}
      </div>

    </div>
  );
};