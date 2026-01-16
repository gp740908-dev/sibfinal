import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus, Minus } from 'lucide-react';

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

export const FAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('General');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first open
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.faq-header', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    gsap.from('.faq-tabs', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power2.out"
    });

    gsap.from('.faq-list', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-sand pt-32 pb-20 px-6 md:px-12 text-forest">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="faq-header text-center mb-16">
          <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-4">
            Support
          </span>
          <h1 className="text-4xl md:text-6xl font-serif leading-none mb-6">
            FREQUENTLY ASKED <br/> <span className="italic opacity-70">QUESTIONS</span>
          </h1>
          <p className="font-sans text-forest/70 max-w-lg mx-auto">
            Everything you need to know about your upcoming escape to Ubud. 
            If you can't find what you're looking for, our concierge is always available.
          </p>
        </div>

        {/* Tabs */}
        <div className="faq-tabs flex flex-wrap justify-center gap-6 md:gap-10 border-b border-forest/10 pb-6 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
              className={`font-sans text-xs md:text-sm uppercase tracking-widest transition-all duration-300 relative pb-2
                ${activeTab === cat ? 'text-forest font-bold' : 'text-forest/40 hover:text-forest'}
              `}
            >
              {cat}
              {activeTab === cat && (
                <span className="absolute bottom-0 left-0 w-full h-px bg-forest animate-fade-in" />
              )}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="faq-list space-y-4">
          {FAQ_DATA[activeTab].map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="border-b border-forest/10 last:border-none"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center py-6 text-left group"
                >
                  <h3 className={`font-serif text-xl md:text-2xl transition-colors duration-300 ${isOpen ? 'text-forest' : 'text-forest/80 group-hover:text-forest'}`}>
                    {item.question}
                  </h3>
                  <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                
                <div 
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans text-forest/70 leading-relaxed text-sm md:text-base pr-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};