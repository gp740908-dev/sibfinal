
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const MOCK_SERVICES: ServiceItem[] = [
  { id: '1', title: 'Private Dining', description: 'Our culinary team brings the restaurant to your sanctuary. From floating breakfasts in your infinity pool to 7-course degustation dinners.', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200' },
  { id: '2', title: 'Holistic Healing', description: 'Ancient Balinese healing traditions delivered to your doorstep. Experience a traditional Boreh scrub, a flower bath ritual, or sound healing.', imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1200' },
  { id: '3', title: 'Sacred Tours', description: 'Gain exclusive access to water temples for a purification ceremony (Melukat), trek through private rice terraces at sunrise.', imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&q=80&w=1200' },
  { id: '4', title: 'Vintage Land Rover', description: 'Navigate the island in timeless style. Our fleet of restored vintage Land Rovers and premium SUVs are available.', imageUrl: 'https://images.unsplash.com/photo-1562967204-c3dd30472cb3?auto=format&fit=crop&q=80&w=1200' }
];

export const OurServices: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>([]);


  useEffect(() => {
    async function fetchServices() {
      if (isMock) {
        setServices(MOCK_SERVICES);
        return;
      }

      try {
        // Re-use experiences data for the home page services section
        const { data, error } = await supabase.from('experiences').select('*').limit(4).order('created_at', { ascending: true });

        if (error || !data || data.length === 0) {
          setServices(MOCK_SERVICES);
        } else {
          const formatted: ServiceItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.image_url
          }));
          setServices(formatted);
        }
      } catch (e) {
        setServices(MOCK_SERVICES);
      }
    }
    fetchServices();
  }, []);

  // REMOVED: Scroll reveal animation that caused intermittent visibility issues
  // Elements are now always visible, only image switching uses GSAP



  if (services.length === 0) return null;

  return (

    <section className="bg-sand text-forest min-h-[70vh] flex flex-col lg:flex-row overflow-hidden border-t border-forest/10">

      {/* LEFT COLUMN: Content */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-20">

        <div className="service-header mb-12 md:mb-20">
          <span className="block font-sans text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
            Curated For You
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-none text-forest">
            BESPOKE EXPERIENCES
          </h2>
        </div>

        <ul className="space-y-8 relative" role="tablist">
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            const contentId = `service-content-${service.id}`;
            const headerId = `service-header-${service.id}`;

            return (
              <li
                key={service.id}
                className="service-item group relative focus-visible:outline-none"
              >
                <div
                  role="tab"
                  id={headerId}
                  aria-selected={isActive}
                  aria-controls={contentId}
                  tabIndex={0}
                  className="flex items-baseline gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:rounded-lg p-2 -ml-2 transition-all"
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                >
                  <span className={`font-sans text-xs font-bold transition-opacity duration-300 ${isActive ? 'opacity-100 text-accent' : 'opacity-30'}`}>
                    0{index + 1}
                  </span>

                  <h3
                    className={`text-4xl md:text-6xl font-serif transition-all duration-500 ease-out 
                      ${isActive
                        ? 'opacity-100 translate-x-4 md:translate-x-8 italic'
                        : 'opacity-40 group-hover:opacity-60'
                      }
                    `}
                  >
                    {service.title}
                  </h3>

                  {isActive && (
                    <ArrowUpRight className="opacity-0 md:opacity-100 animate-fade-in text-accent ml-4" size={24} aria-hidden="true" />
                  )}
                </div>

                {/* Description Accordion (Visible only when active) */}
                <div
                  id={contentId}
                  role="tabpanel"
                  aria-labelledby={headerId}
                  className={`overflow-hidden transition-all duration-500 ease-in-out pl-8 md:pl-16
                    ${isActive ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
                  `}
                >
                  <p className="font-sans text-text-body text-sm md:text-base leading-relaxed max-w-md">
                    {service.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Decorative line */}
        <div className="absolute left-8 md:left-24 bottom-0 w-px h-24 bg-forest/20"></div>
      </div>

      {/* RIGHT COLUMN: Image Reveal Stage */}
      <div className="service-image-container w-full lg:w-1/2 min-h-[400px] lg:h-auto relative overflow-hidden bg-forest/5">
        <div className="w-full h-full relative">
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={service.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out
                  ${isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}
                `}
              >
                <div className="absolute inset-0 bg-forest/10 z-10 mix-blend-multiply"></div>
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />

                {/* Mobile overlay text */}
                <div className={`absolute bottom-6 right-6 z-20 lg:hidden transition-transform duration-500 delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <span className="bg-sand/90 text-forest px-4 py-1 text-xs uppercase tracking-widest font-bold backdrop-blur-sm shadow-lg">
                    {service.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default OurServices;
