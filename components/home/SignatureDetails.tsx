'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sparkles, Sun } from 'lucide-react';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

const MOMENTS = [
  {
    id: 0,
    title: "Floating Breakfast",
    description: "Begin your day effortlessly. A curated selection of tropical fruits, artisanal pastries, and local coffee served on a floating tray in your private infinity pool.",
    icon: <Coffee size={24} />,
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 1,
    title: "Floral Bath Ritual",
    description: "A sensory journey using thousands of fresh marigold and frangipani petals. Prepared by our wellness therapists to soothe the body and calm the spirit.",
    icon: <Sparkles size={24} />,
    image: "https://images.unsplash.com/photo-1676141570940-7f79ca4f070b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 2,
    title: "Sunrise Yoga Deck",
    description: "Greet the sun as it rises over the Ayung River valley. Our private wooden decks offer the perfect stillness for meditation and morning flow.",
    icon: <Sun size={24} />,
    image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=1000"
  }
];

export const SignatureDetails: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll-based detection using scroll position calculation
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const screenHeight = window.innerHeight;

    // Calculate how far we've scrolled through the section
    // Container starts: rect.top = screenHeight (just entered)
    // Container ends: rect.bottom = 0 (just left)
    const totalScrollDistance = container.offsetHeight - screenHeight;
    const scrolledDistance = -rect.top;
    const scrollProgress = Math.max(0, Math.min(1, scrolledDistance / totalScrollDistance));

    // Map scroll progress to index (3 sections = divide by 3)
    const sectionProgress = scrollProgress * MOMENTS.length;
    const newIndex = Math.min(Math.floor(sectionProgress), MOMENTS.length - 1);

    // Only update if actually changed and not rapidly scrolling
    if (newIndex !== activeIndex && newIndex >= 0) {
      // Clear any pending timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce the state update
      scrollTimeoutRef.current = setTimeout(() => {
        setActiveIndex(newIndex);
      }, 50); // Small delay for smoothness
    }
  }, [activeIndex]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <section ref={containerRef} className="relative bg-forest">
      {/* Desktop Layout: Side by Side with CSS Sticky */}
      <div className="hidden md:flex">
        {/* LEFT COLUMN (CSS Sticky) */}
        <div className="w-1/2 relative">
          <div className="sticky top-0 h-screen flex flex-col justify-center px-8 lg:px-24 text-sand">
            <div className="max-w-xl">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-sand/60 mb-8 border-l border-sand/30 pl-4 h-12 flex items-center">
                Curated Moments
              </span>

              {/* All content items - crossfade with opacity (NO UNMOUNTING) */}
              <div className="relative min-h-[400px]">
                {MOMENTS.map((moment, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <motion.div
                      key={moment.id}
                      className="absolute top-0 left-0 w-full flex flex-col gap-6"
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 15,
                        scale: isActive ? 1 : 0.98,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: LUXURY_EASE,
                      }}
                      style={{
                        pointerEvents: isActive ? 'auto' : 'none',
                        zIndex: isActive ? 1 : 0,
                      }}
                    >
                      <div className="w-12 h-12 rounded-full border border-sand/30 flex items-center justify-center mb-2">
                        {moment.icon}
                      </div>

                      <div className="flex items-baseline gap-4 opacity-50 font-serif text-lg">
                        <span>0{idx + 1}</span>
                        <span className="h-px w-12 bg-sand"></span>
                        <span>0{MOMENTS.length}</span>
                      </div>

                      <h2 className="text-4xl lg:text-6xl xl:text-7xl font-serif leading-none text-sand">
                        {moment.title}
                      </h2>

                      <p className="font-sans text-base lg:text-lg text-sand/80 leading-relaxed max-w-md">
                        {moment.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation Dots */}
              <div className="flex gap-3 mt-12">
                {MOMENTS.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className="h-2 rounded-full"
                    animate={{
                      width: activeIndex === idx ? 32 : 8,
                      backgroundColor: activeIndex === idx ? '#F4F1EA' : 'rgba(244,241,234,0.3)'
                    }}
                    transition={{ duration: 0.4, ease: LUXURY_EASE }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`View ${MOMENTS[idx].title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Scrolling Images) */}
        <div className="w-1/2 flex flex-col">
          {MOMENTS.map((moment, idx) => (
            <div
              key={moment.id}
              className="h-screen w-full relative overflow-hidden border-l border-sand/10"
            >
              <motion.img
                src={moment.image}
                alt={moment.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.5, ease: LUXURY_EASE }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-forest/50 to-transparent mix-blend-multiply pointer-events-none"></div>

              {/* Section Number Badge */}
              <div className="absolute bottom-8 right-8 font-serif text-8xl text-sand/10 select-none">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout: Stacked Cards */}
      <div className="md:hidden flex flex-col">
        {MOMENTS.map((moment, idx) => (
          <motion.div
            key={moment.id}
            className="h-[80vh] w-full relative overflow-hidden border-b border-sand/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={moment.image}
              alt={moment.title}
              className="w-full h-full object-cover"
            />

            {/* Mobile Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/60 to-transparent flex flex-col justify-end p-6 sm:p-8 text-sand">
              <div className="max-w-md mx-auto w-full mb-4">
                <div className="mb-4 text-accent drop-shadow-md">{moment.icon}</div>

                <div className="flex items-center gap-3 mb-3 opacity-90 text-[10px] uppercase tracking-[0.25em] font-medium">
                  <span>0{idx + 1}</span>
                  <span className="w-8 h-px bg-sand/60"></span>
                  <span>Curated Moment</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-serif mb-3 leading-none drop-shadow-sm">
                  {moment.title}
                </h3>

                <p className="font-sans text-sm sm:text-base opacity-90 leading-relaxed text-sand/90 line-clamp-4">
                  {moment.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SignatureDetails;
