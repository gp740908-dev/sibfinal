'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  }
};

const contentReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: LUXURY_EASE }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: LUXURY_EASE }
  }
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: LUXURY_EASE }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: { duration: 0.6, ease: LUXURY_EASE }
  }
};

export const SignatureDetails: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative bg-forest">
      {/* Desktop Layout: Side by Side with CSS Sticky */}
      <div className="hidden md:flex">
        {/* LEFT COLUMN (CSS Sticky) */}
        <div className="w-1/2 relative">
          <div className="sticky top-0 h-screen flex flex-col justify-center px-8 lg:px-24 text-sand">
            <div className="max-w-xl">
              <motion.span
                className="font-sans text-xs uppercase tracking-[0.3em] text-sand/60 mb-8 border-l border-sand/30 pl-4 h-12 flex items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                Curated Moments
              </motion.span>

              {/* Dynamic Text Content with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="flex flex-col gap-6"
                  variants={contentReveal}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="w-12 h-12 rounded-full border border-sand/30 flex items-center justify-center mb-2">
                    {MOMENTS[activeIndex].icon}
                  </div>

                  <div className="flex items-baseline gap-4 opacity-50 font-serif text-lg">
                    <span>0{activeIndex + 1}</span>
                    <span className="h-px w-12 bg-sand"></span>
                    <span>0{MOMENTS.length}</span>
                  </div>

                  <h2 className="text-4xl lg:text-6xl xl:text-7xl font-serif leading-none text-sand">
                    {MOMENTS[activeIndex].title}
                  </h2>

                  <p className="font-sans text-base lg:text-lg text-sand/80 leading-relaxed max-w-md">
                    {MOMENTS[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="flex gap-3 mt-12">
                {MOMENTS.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${activeIndex === idx ? 'bg-sand w-8' : 'bg-sand/30 hover:bg-sand/60'
                      }`}
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
            <motion.div
              key={moment.id}
              className="h-screen w-full relative overflow-hidden border-l border-sand/10"
              onViewportEnter={() => setActiveIndex(idx)}
              viewport={{ amount: 0.5 }}
            >
              <motion.img
                src={moment.image}
                alt={moment.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, ease: LUXURY_EASE }}
                whileHover={{ scale: 1.05 }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-forest/50 to-transparent mix-blend-multiply pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Layout: Stacked Cards */}
      <div className="md:hidden flex flex-col">
        {MOMENTS.map((moment, idx) => (
          <motion.div
            key={moment.id}
            className="h-[80vh] w-full relative overflow-hidden border-b border-sand/10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageReveal}
          >
            <img
              src={moment.image}
              alt={moment.title}
              className="w-full h-full object-cover"
            />

            {/* Mobile Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/60 to-transparent flex flex-col justify-end p-6 sm:p-8 text-sand"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
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
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SignatureDetails;
