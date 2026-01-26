
'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const containerRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

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

  useGSAP(() => {
    if (services.length === 0) return;

    // Only enable ScrollTrigger animations on Desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // 1. Initial Scroll Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse"
        }
      });

      tl.from('.service-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
        .from('.service-item', {
          x: -50,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out"
        }, "-=0.4")
        .from('.service-image-container', {
          scale: 0.95,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        }, "-=1");
    });

    // Mobile Fallback: Just ensure things are visible (CSS handles this mostly, but safety check)
    mm.add("(max-width: 767px)", () => {
      gsap.set(['.service-header', '.service-item', '.service-image-container'], {
        opacity: 1, y: 0, x: 0, scale: 1
      });
    });

  }, { scope: containerRef, dependencies: [services] });

  useGSAP(() => {
    if (services.length === 0) return;

    // 2. Image Switching Animation
    const images = imagesRef.current?.children;
    if (images && images.length > 0 && images[activeIndex]) {
      // Fade out all images not matching index
      Array.from(images).forEach((img, idx) => {
        if (idx !== activeIndex) {
          gsap.to(img, {
            opacity: 0,
            scale: 1.05,
            zIndex: 0,
            duration: 0.6,
            ease: "power2.inOut"
          });
        }
      });

      // Fade in active image
      gsap.fromTo(images[activeIndex],
        { opacity: 0, scale: 1.1, zIndex: 10 },
        {
          opacity: 1,
          scale: 1,
          zIndex: 10,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  }, [activeIndex, services]);

  if (services.length === 0) return null;

  return (
    <section ref={containerRef} className="bg-sand text-forest min-h-[70vh] flex flex-col lg:flex-row overflow-hidden border-t border-forest/10">

      {/* LEFT COLUMN: Content */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-20">

        <div className="service-header mb-12 md:mb-20">
          <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-4">
            Curated For You
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-none">
            BESPOKE EXPERIENCES
          </h2>
        </div>

        <ul className="space-y-8 relative">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="service-item group relative"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)} // For mobile tap interaction
            >
              <div className="flex items-baseline gap-4 cursor-pointer">
                <span className={`font-sans text-xs font-bold transition-opacity duration-300 ${activeIndex === index ? 'opacity-100 text-accent' : 'opacity-30'}`}>
                  0{index + 1}
                </span>

                <h3
                  className={`text-4xl md:text-6xl font-serif transition-all duration-500 ease-out 
                    ${activeIndex === index
                      ? 'opacity-100 translate-x-4 md:translate-x-8 italic'
                      : 'opacity-40 group-hover:opacity-60'
                    }
                  `}
                >
                  {service.title}
                </h3>

                {activeIndex === index && (
                  <ArrowUpRight className="opacity-0 md:opacity-100 animate-fade-in text-accent ml-4" size={24} />
                )}
              </div>

              {/* Description Accordion (Visible only when active) */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out pl-8 md:pl-16
                  ${activeIndex === index ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
                `}
              >
                <p className="font-sans text-forest/70 text-sm md:text-base leading-relaxed max-w-md">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Decorative line */}
        <div className="absolute left-8 md:left-24 bottom-0 w-px h-24 bg-forest/20"></div>
      </div>

      {/* RIGHT COLUMN: Image Reveal Stage */}
      <div className="service-image-container w-full lg:w-1/2 min-h-[400px] lg:h-auto relative overflow-hidden bg-forest/5">
        <div ref={imagesRef} className="w-full h-full relative">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 bg-forest/10 z-10 mix-blend-multiply"></div>
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Mobile overlay text (optional if list is scrolled out of view, but mostly purely aesthetic here) */}
              <div className="absolute bottom-6 right-6 z-20 lg:hidden">
                <span className="bg-sand/90 text-forest px-4 py-1 text-xs uppercase tracking-widest font-bold backdrop-blur-sm">
                  {service.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default OurServices;
