'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sparkles, Sun, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: LUXURY_EASE }
  }
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: LUXURY_EASE }
  }
};

const MOMENTS = [
  {
    id: 1,
    number: "01",
    title: "Floating Breakfast",
    subtitle: "A Morning Ritual",
    description: "Begin your day effortlessly. A curated selection of tropical fruits, artisanal pastries, and locally-sourced coffee served on a floating tray in your private infinity pool.",
    icon: <Coffee size={20} />,
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1200",
    layout: "left" // Image on left
  },
  {
    id: 2,
    number: "02",
    title: "Floral Bath Ritual",
    subtitle: "Ancient Healing",
    description: "A sensory journey using thousands of fresh marigold and frangipani petals. Prepared by our wellness therapists to soothe the body and calm the spirit.",
    icon: <Sparkles size={20} />,
    image: "https://images.unsplash.com/photo-1676141570940-7f79ca4f070b?auto=format&fit=crop&q=80&w=1200",
    layout: "right" // Image on right
  },
  {
    id: 3,
    number: "03",
    title: "Sunrise Yoga Deck",
    subtitle: "Movement & Stillness",
    description: "Greet the sun as it rises over the Ayung River valley. Our private wooden decks offer the perfect stillness for meditation and morning flow.",
    icon: <Sun size={20} />,
    image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=1200",
    layout: "left"
  }
];

export const SignatureDetails: React.FC = () => {
  return (
    <section className="bg-forest text-sand overflow-hidden">

      {/* Section Header */}
      <motion.div
        className="py-24 md:py-32 px-6 md:px-12 lg:px-24 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.span
          className="block font-sans text-xs uppercase tracking-[0.3em] text-sand/50 mb-6"
          variants={fadeInUp}
        >
          Curated Moments
        </motion.span>

        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.95] mb-8"
          variants={fadeInUp}
        >
          THE <span className="italic text-accent-light">SIGNATURE</span>
          <br />
          EXPERIENCE
        </motion.h2>

        <motion.div
          className="w-24 h-px bg-sand/30 mx-auto"
          variants={lineReveal}
          style={{ originX: 0.5 }}
        />
      </motion.div>

      {/* Editorial Moments Grid */}
      <div className="space-y-0">
        {MOMENTS.map((moment, index) => (
          <motion.article
            key={moment.id}
            className={`grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] ${moment.layout === 'right' ? '' : 'lg:grid-flow-col-dense'
              }`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Image Block */}
            <motion.div
              className={`relative overflow-hidden aspect-[4/5] lg:aspect-auto ${moment.layout === 'right' ? 'lg:order-2' : 'lg:order-1'
                }`}
              variants={scaleIn}
            >
              <motion.img
                src={moment.image}
                alt={moment.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: LUXURY_EASE }}
              />

              {/* Large Number Overlay */}
              <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
                <span className="font-serif text-7xl lg:text-9xl text-sand/10 select-none">
                  {moment.number}
                </span>
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 pointer-events-none ${moment.layout === 'right'
                  ? 'bg-gradient-to-l from-forest/60 to-transparent'
                  : 'bg-gradient-to-r from-forest/60 to-transparent'
                }`} />
            </motion.div>

            {/* Content Block */}
            <motion.div
              className={`flex flex-col justify-center p-8 md:p-12 lg:p-20 xl:p-28 ${moment.layout === 'right' ? 'lg:order-1' : 'lg:order-2'
                }`}
              variants={staggerContainer}
            >
              {/* Icon + Label */}
              <motion.div
                className="flex items-center gap-4 mb-8"
                variants={fadeInUp}
              >
                <div className="w-10 h-10 rounded-full border border-sand/30 flex items-center justify-center">
                  {moment.icon}
                </div>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-sand/60">
                  {moment.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05] mb-6"
                variants={fadeInUp}
              >
                {moment.title}
              </motion.h3>

              {/* Decorative Line */}
              <motion.div
                className="w-16 h-px bg-accent-light mb-8"
                variants={lineReveal}
                style={{ originX: 0 }}
              />

              {/* Description */}
              <motion.p
                className="font-sans text-lg lg:text-xl text-sand/70 leading-relaxed max-w-lg mb-10"
                variants={fadeInUp}
              >
                {moment.description}
              </motion.p>

              {/* Number Badge */}
              <motion.div
                className="flex items-center gap-6"
                variants={fadeInUp}
              >
                <span className="font-serif text-3xl text-sand/20">{moment.number}</span>
                <span className="w-12 h-px bg-sand/20"></span>
                <span className="font-serif text-sm text-sand/40">0{MOMENTS.length}</span>
              </motion.div>
            </motion.div>
          </motion.article>
        ))}
      </div>

      {/* Section Footer CTA */}
      <motion.div
        className="py-24 md:py-32 px-6 text-center border-t border-sand/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.p
          className="font-sans text-sm text-sand/50 mb-8 uppercase tracking-widest"
          variants={fadeInUp}
        >
          Ready to experience it all?
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link
            href="/experiences"
            className="group inline-flex items-center gap-4 px-10 py-5 border border-sand/30 rounded-full hover:bg-sand hover:text-forest transition-all duration-500"
          >
            <span className="font-sans text-xs uppercase tracking-[0.2em] font-medium">
              Explore All Experiences
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default SignatureDetails;
