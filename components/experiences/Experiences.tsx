'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: LUXURY_EASE }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { scale: 1.1, opacity: 0.8 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: LUXURY_EASE }
  }
};

interface Experience {
  id: string;
  category: string;
  title: string;
  description: string;
  cta: string;
  image: string;
}

interface ExperiencesProps {
  initialExperiences?: any[];
}

const mapExperience = (item: any): Experience => ({
  id: item.id,
  title: item.title,
  description: item.description,
  category: item.category,
  image: item.image_url,
  cta: item.cta_label || 'Learn More'
});

// Mock data fallback
const MOCK_EXPERIENCES: Experience[] = [
  {
    id: '1',
    category: 'Wellness',
    title: 'Holistic Healing Rituals',
    description: 'Immerse yourself in ancient Balinese healing traditions. Our curated wellness experiences include sound healing sessions, traditional Melukat purification ceremonies, and private yoga sessions overlooking the valley.',
    cta: 'Book Session',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '2',
    category: 'Culinary',
    title: 'Private Dining Experiences',
    description: 'From sunrise breakfasts floating in your infinity pool to candlelit dinners in the rice fields, our private chefs craft bespoke menus using the freshest local ingredients.',
    cta: 'View Menus',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e814?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    category: 'Adventure',
    title: 'Sacred Temple Tours',
    description: 'Venture beyond the tourist trails with our local guides to discover hidden temples, participate in authentic offerings ceremonies, and learn the spiritual significance of these sacred sites.',
    cta: 'Explore Tours',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a91?auto=format&fit=crop&q=80&w=1000'
  }
];

export const Experiences: React.FC<ExperiencesProps> = ({ initialExperiences }) => {

  // Use initial data or mock data
  const experiences: Experience[] = initialExperiences && initialExperiences.length > 0
    ? initialExperiences.map(mapExperience)
    : MOCK_EXPERIENCES;

  const handleInquire = () => {
    window.open('https://wa.me/6282269128232?text=I%20would%20like%20to%20inquire%20about%20an%20experience', '_blank');
  };

  if (experiences.length === 0) return <div className="min-h-screen bg-sand"></div>;

  return (
    <div className="bg-sand min-h-screen pt-24 pb-20 overflow-hidden">

      {/* 1. HERO */}
      <motion.section
        className="px-6 md:px-12 py-20 md:py-32 text-center max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className="block font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-forest-dark/60 mb-6"
          variants={fadeInUp}
        >
          Beyond Accommodation
        </motion.span>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-[8rem] font-serif text-forest-dark leading-none tracking-tight mb-8"
          variants={fadeInUp}
        >
          CURATED <span className="italic">MOMENTS</span>
        </motion.h1>

        <motion.div
          className="w-px h-20 bg-forest-dark/20 mx-auto mb-8"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.5 }}
        />

        <motion.p
          className="font-sans text-lg md:text-xl text-forest-dark/80 max-w-2xl mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          We believe that a true luxury escape is defined not just by where you stay, but by how you feel. Our concierge team crafts bespoke itineraries to immerse you in the magic of Ubud.
        </motion.p>
      </motion.section>

      {/* 2. CONTENT BLOCKS */}
      <div className="flex flex-col gap-0">
        {experiences.map((item, index) => (
          <motion.section
            key={item.id}
            className={`py-24 px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24 max-w-7xl mx-auto
              ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}
            `}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Text Side */}
            <motion.div
              className="w-full md:w-1/2 flex flex-col items-start"
              variants={fadeInUp}
            >
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent mb-4">
                0{index + 1} • {item.category}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-dark mb-8 leading-tight">
                {item.title}
              </h2>
              <p className="font-sans text-forest-dark/80 text-lg leading-relaxed mb-8">
                {item.description}
              </p>
              <motion.button
                onClick={handleInquire}
                className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-forest-dark hover:text-accent transition-colors"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                {item.cta} <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Image Side */}
            <motion.div
              className="w-full md:w-1/2 aspect-[3/4] md:aspect-[4/5] overflow-hidden relative shadow-2xl bg-forest-dark/10"
              variants={scaleIn}
            >
              <div className="w-full h-full overflow-hidden">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[120%] object-cover -mt-[10%]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: LUXURY_EASE }}
                />
              </div>
              {/* Decorative Border */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none"></div>
            </motion.div>
          </motion.section>
        ))}
      </div>

    </div>
  );
};