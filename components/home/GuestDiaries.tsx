'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

interface Review {
  id: string;
  guest_name: string;
  quote: string;
  source: string;
  image_url: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    guest_name: 'Elena S.',
    quote: 'The silence here is different. It’s heavy with peace. I haven’t slept this well in a decade.',
    source: 'Sydney, Australia',
    image_url: '/reviews/1.jpg'
  },
  {
    id: '2',
    guest_name: 'Marcus & Sarah',
    quote: 'A masterpiece of bamboo and light. The private jungle pool felt like our own secret world.',
    source: 'London, UK',
    image_url: '/reviews/2.jpg'
  },
  {
    id: '3',
    guest_name: 'David Chen',
    quote: 'Impeccable concierge service. They anticipated needs we didn’t even know we had.',
    source: 'Singapore',
    image_url: '/reviews/3.jpg'
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
          .select('*')
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
    <section className="py-24 md:py-32 bg-[#F4F1EA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-16 md:mb-24 border-b border-forest/10 pb-6">
          <span className="text-xs font-sans uppercase tracking-[0.25em] text-forest/60">
            Guest Diaries
          </span>
          <div className="flex gap-2">
            <Star className="w-4 h-4 text-forest fill-forest" />
            <span className="text-xs font-sans font-medium text-forest">4.96 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[500px]">

          {/* LEFT CONTENT */}
          <div className={`lg:col-span-5 relative z-10 transition-all duration-500 ease-in-out transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>

            {/* Index Number */}
            <div className="overflow-hidden mb-8">
              <span className="block font-sans text-xs font-bold text-accent tracking-widest">
                0{activeIndex + 1} / 0{reviews.length}
              </span>
            </div>

            {/* Quote */}
            <div className="relative">
              <Quote className="absolute -top-8 -left-8 w-16 h-16 text-forest/5 pointer-events-none" />
              <blockquote className="font-serif text-3xl md:text-5xl leading-[1.15] text-forest-dark mb-10">
                {activeReview?.quote}
              </blockquote>
            </div>

            {/* Author */}
            <div className="flex flex-col gap-1 mb-12">
              <span className="font-sans text-sm font-bold uppercase tracking-wider text-forest">
                {activeReview?.guest_name}
              </span>
              <span className="font-serif text-forest/60 italic">
                {activeReview?.source}
              </span>
            </div>

            {/* Navigation Controls - Always Visible/Interactive */}
            <div className="flex gap-4">
              <button
                onClick={() => handleSlide('prev')}
                disabled={isTransitioning}
                className="w-12 h-12 rounded-full border border-forest/20 flex items-center justify-center text-forest hover:bg-forest hover:text-sand transition-all duration-300 group disabled:opacity-50"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleSlide('next')}
                disabled={isTransitioning}
                className="w-12 h-12 rounded-full border border-forest/20 flex items-center justify-center text-forest hover:bg-forest hover:text-sand transition-all duration-300 group disabled:opacity-50"
                aria-label="Next review"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-1 lg:col-start-7 lg:col-end-13 relative h-[400px] md:h-[600px] w-full">
            <div className={`relative w-full h-full rounded-sm overflow-hidden shadow-2xl transition-all duration-700 ease-in-out transform ${isTransitioning ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100 blur-0'
              }`}>
              <Image
                src={activeReview?.image_url}
                alt={`StayinUBUD Guest - ${activeReview?.guest_name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Subtle tint */}
              <div className="absolute inset-0 bg-forest/10 mix-blend-multiply" />
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-12 -left-12 w-24 h-24 border border-forest/20 rounded-full animate-[spin_10s_linear_infinite] hidden md:block opacity-50" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default GuestDiaries;
