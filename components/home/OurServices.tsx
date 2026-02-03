'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

// Luxury Easing
const LUXURY_EASE: any = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: { duration: 0.4, ease: LUXURY_EASE }
  }
};

const descriptionReveal = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 16,
    transition: { duration: 0.5, ease: LUXURY_EASE }
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.3, ease: LUXURY_EASE }
  }
};

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const MOCK_SERVICES: ServiceItem[] = [
  { id: '1', title: 'Private Dining', description: 'Our culinary team brings the restaurant to your sanctuary. From floating breakfasts in your infinity pool to 7-course degustation dinners.', imageUrl: '/ourservices/eskelapa.webp' },
  { id: '2', title: 'Holistic Healing', description: 'Ancient Balinese healing traditions delivered to your doorstep. Experience a traditional Boreh scrub, a flower bath ritual, or sound healing.', imageUrl: '/ourservices/flowerbath.webp' },
  { id: '3', title: 'Sacred Tours', description: 'Gain exclusive access to water temples for a purification ceremony (Melukat), trek through private rice terraces at sunrise.', imageUrl: '/ourservices/tmple.webp' },
  { id: '4', title: 'Island Exploration', description: 'Navigate the island in timeless style. Discover hidden gems, pristine beaches, and the raw beauty of Bali beyond the villa.', imageUrl: '/ourservices/baliisland.webp' }
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

  if (services.length === 0) return null;

  return (
    <section className="bg-sand text-forest min-h-[70vh] flex flex-col lg:flex-row overflow-hidden border-t border-forest/10">

      {/* LEFT COLUMN: Content */}
      <motion.div
        className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div className="mb-12 md:mb-20" variants={fadeInUp}>
          <span className="block font-sans text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
            Curated For You
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-none text-forest">
            BESPOKE EXPERIENCES
          </h2>
        </motion.div>

        <ul className="space-y-8 relative" role="tablist">
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            const contentId = `service-content-${service.id}`;
            const headerId = `service-header-${service.id}`;

            return (
              <motion.li
                key={service.id}
                className="group relative focus-visible:outline-none"
                variants={fadeInUp}
              >
                <motion.div
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
                  whileHover={{ x: isActive ? 0 : 8 }}
                  transition={{ duration: 0.3, ease: LUXURY_EASE }}
                >
                  <motion.span
                    className="font-sans text-xs font-bold"
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      color: isActive ? '#9BB784' : '#243326'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    0{index + 1}
                  </motion.span>

                  <motion.h3
                    className="text-4xl md:text-6xl font-serif"
                    animate={{
                      opacity: isActive ? 1 : 0.4,
                      x: isActive ? 16 : 0,
                      fontStyle: isActive ? 'italic' : 'normal'
                    }}
                    transition={{ duration: 0.5, ease: LUXURY_EASE }}
                  >
                    {service.title}
                  </motion.h3>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpRight className="text-accent ml-4" size={24} aria-hidden="true" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Description Accordion */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      id={contentId}
                      role="tabpanel"
                      aria-labelledby={headerId}
                      className="overflow-hidden pl-8 md:pl-16"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={descriptionReveal}
                    >
                      <p className="font-sans text-text-body text-sm md:text-base leading-relaxed max-w-md">
                        {service.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>

        {/* Decorative line */}
        <div className="absolute left-8 md:left-24 bottom-0 w-px h-24 bg-forest/20"></div>
      </motion.div>

      {/* RIGHT COLUMN: Image Reveal Stage */}
      <div className="w-full lg:w-1/2 min-h-[400px] lg:h-auto relative overflow-hidden bg-forest/5">
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={services[activeIndex]?.id}
              className="absolute inset-0 w-full h-full"
              variants={imageReveal}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="absolute inset-0 bg-forest/10 z-10 mix-blend-multiply"></div>
              <Image
                src={services[activeIndex]?.imageUrl || ''}
                alt={services[activeIndex]?.title || ''}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />

              {/* Mobile overlay text */}
              <motion.div
                className="absolute bottom-6 right-6 z-20 lg:hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="bg-sand/90 text-forest px-4 py-1 text-xs uppercase tracking-widest font-bold backdrop-blur-sm shadow-lg">
                  {services[activeIndex]?.title}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
};

export default OurServices;
