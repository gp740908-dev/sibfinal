'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

type Category = 'General' | 'Villa Amenities' | 'Booking & Payment';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: Record<Category, FAQItem[]> = {
  'General': [
    {
      question: "Where is StayinUBUD located?",
      answer: "Our collection of villas is scattered across the most serene parts of Ubud. Some are nestled in the rice terraces of Tegallalang, while others are hidden in the jungle canopy of Sayan. Precise location details are provided upon booking to ensure the privacy of our guests."
    },
    {
      question: "What are the check-in and check-out times?",
      answer: "Check-in begins at 14:00 (2 PM) and check-out is at 11:00 (11 AM). We are happy to accommodate early check-ins or late check-outs subject to availability."
    },
    {
      question: "Is StayinUBUD suitable for families?",
      answer: "While many of our villas are designed as romantic sanctuaries for couples, we do have specific estates (like the Estate of Zen) that are perfect for families. Please check the guest capacity on the villa details page."
    }
  ],
  'Villa Amenities': [
    {
      question: "Is breakfast included in the rate?",
      answer: "Yes. Every morning, a curated breakfast is prepared by your private villa staff. You may choose between Western, Balinese, or Healthy options, served in the privacy of your dining area or as a floating breakfast in the pool."
    },
    {
      question: "Is the internet connection reliable?",
      answer: "Absolutely. We understand the needs of modern travelers. All villas are equipped with high-speed fiber optic Wi-Fi (up to 100Mbps), ensuring you can stay connected even in the heart of the jungle."
    },
    {
      question: "Do the villas have air conditioning?",
      answer: "Yes, all bedrooms are fully air-conditioned to ensure a comfortable night's sleep. Living areas are often designed as open-air spaces to embrace the natural breeze, but are equipped with ceiling fans."
    }
  ],
  'Booking & Payment': [
    {
      question: "Do you offer airport transfers?",
      answer: "Yes. We provide complimentary round-trip airport transfers for stays of 3 nights or more. For shorter stays, we can arrange a private luxury car transfer for an additional fee."
    },
    {
      question: "What is your cancellation policy?",
      answer: "To offer flexibility, we allow free cancellation up to 14 days before arrival. Cancellations made within 14 days of arrival will be charged 50% of the total booking. No-shows are charged 100%."
    },
    {
      question: "How do I make a reservation?",
      answer: "You can request a booking directly through our website using the 'Check Availability' widget. Alternatively, you can contact our concierge via WhatsApp for a personalized booking experience."
    }
  ]
};

const CATEGORIES: Category[] = ['General', 'Villa Amenities', 'Booking & Payment'];

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

const accordionContent = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.4, ease: LUXURY_EASE }
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.5, ease: LUXURY_EASE }
  }
};

export const FAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('General');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-sand pt-32 pb-20 px-6 md:px-12 text-forest-dark">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            className="block font-sans text-xs uppercase tracking-[0.2em] text-forest-dark/60 mb-4"
            variants={fadeInUp}
          >
            Support
          </motion.span>
          <motion.h1
            className="text-4xl md:text-6xl font-serif leading-none mb-6"
            variants={fadeInUp}
          >
            FREQUENTLY ASKED <br /> <span className="italic text-forest-dark/70">QUESTIONS</span>
          </motion.h1>
          <motion.p
            className="font-sans text-forest-dark/70 max-w-lg mx-auto"
            variants={fadeInUp}
          >
            Everything you need to know about your upcoming escape to Ubud.
            If you can't find what you're looking for, our concierge is always available.
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 md:gap-10 border-b border-forest-dark/10 pb-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: LUXURY_EASE, delay: 0.4 }}
        >
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
              className={`font-sans text-xs md:text-sm uppercase tracking-widest transition-all duration-300 relative pb-2
                ${activeTab === cat ? 'text-forest-dark font-bold' : 'text-forest-dark/40 hover:text-forest-dark'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {cat}
              {/* Animated Underline */}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-px bg-forest-dark"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeTab === cat ? 1 : 0 }}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Accordion List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
          >
            {FAQ_DATA[activeTab].map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  className="border-b border-forest-dark/10 last:border-none overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Question Button */}
                  <motion.button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center py-6 text-left group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className={`font-serif text-xl md:text-2xl transition-colors duration-300 ${isOpen ? 'text-forest-dark' : 'text-forest-dark/80 group-hover:text-forest-dark'}`}>
                      {item.question}
                    </h3>
                    <motion.div
                      className="flex-shrink-0 ml-4"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: LUXURY_EASE }}
                    >
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </motion.div>
                  </motion.button>

                  {/* Answer Content with AnimatePresence */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={accordionContent}
                        className="overflow-hidden"
                      >
                        <motion.p
                          className="font-sans text-forest-dark/70 leading-relaxed text-sm md:text-base pr-8 pb-8"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {item.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};