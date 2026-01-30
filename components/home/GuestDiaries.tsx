'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

interface Review {
  id: string;
  guest_name: string;
  quote: string;
  source: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    guest_name: 'Elena S.',
    quote: 'The silence here is different. It’s heavy with peace. I haven’t slept this well in a decade.',
    source: 'Sydney, Australia'
  },
  {
    id: '2',
    guest_name: 'Marcus & Sarah',
    quote: 'A masterpiece of bamboo and light. The private jungle pool felt like our own secret world.',
    source: 'London, UK'
  },
  {
    id: '3',
    guest_name: 'David Chen',
    quote: 'Impeccable concierge service. They anticipated needs we didn’t even know we had.',
    source: 'Singapore'
  }
];

export const GuestDiaries: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch Data
  useEffect(() => {
    async function fetchReviews() {
      if (isMock) {
        setReviews(MOCK_REVIEWS);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, guest_name, quote, source')
          .limit(5)
          .order('is_featured', { ascending: false });

        if (data && data.length > 0) {
          const formatted = data.length < 3 ? [...data, ...MOCK_REVIEWS.slice(data.length)] : data;
          setReviews(formatted);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (e) {
        setReviews(MOCK_REVIEWS);
      }
    }
    fetchReviews();
  }, []);

  const handleSlide = (direction: 'next' | 'prev') => {
    if (isTransitioning || reviews.length === 0) return;

    setIsTransitioning(true);

    // Wait for fade out
    setTimeout(() => {
      setActiveIndex(prev => {
        const next = direction === 'next'
          ? (prev + 1) % reviews.length
          : (prev - 1 + reviews.length) % reviews.length;
        return next;
      });
      // Trigger fade in
      setTimeout(() => setIsTransitioning(false), 50);
    }, 500); // Duration matches CSS transition
  };

  if (reviews.length === 0) return null;

  const activeReview = reviews[activeIndex];

  return (
    <section className="py-24 md:py-32 bg-sand relative overflow-hidden border-t border-forest/5">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-20 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full">
            <Star className="w-3.5 h-3.5 text-forest fill-forest" />
            <span className="text-xs font-sans font-medium text-forest tracking-wide">4.96 Average Rating</span>
          </div>
          <span className="text-xs font-sans uppercase tracking-[0.3em] text-forest/40">
            Guest Diaries
          </span>
        </div>

        {/* CONTENT */}
        <div className={`relative z-10 transition-all duration-700 ease-out transform ${isTransitioning ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 blur-0'
          }`}>

          {/* Quote Icon */}
          <div className="mb-8 flex justify-center">
            <Quote className="w-12 h-12 text-forest/10" />
          </div>

          {/* Quote */}
          <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-forest mb-12">
            "{activeReview?.quote}"
          </blockquote>

          {/* Author */}
          <div className="flex flex-col gap-2 mb-16">
            <span className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-forest-dark">
              {activeReview?.guest_name}
            </span>
            <span className="font-serif text-forest/60 italic text-lg">
              {activeReview?.source}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleSlide('prev')}
              disabled={isTransitioning}
              className="w-14 h-14 rounded-full border border-forest/10 flex items-center justify-center text-forest hover:bg-forest hover:text-sand hover:border-forest transition-all duration-300 group disabled:opacity-50"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleSlide('next')}
              disabled={isTransitioning}
              className="w-14 h-14 rounded-full border border-forest/10 flex items-center justify-center text-forest hover:bg-forest hover:text-sand hover:border-forest transition-all duration-300 group disabled:opacity-50"
              aria-label="Next review"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Index Number */}
          <div className="mt-12">
            <span className="font-sans text-[10px] font-bold text-forest/30 tracking-widest">
              0{activeIndex + 1} / 0{reviews.length}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GuestDiaries;
