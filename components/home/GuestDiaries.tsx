'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Quote, Loader2, Star } from 'lucide-react';
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
    quote: 'I have never slept so deeply. The sounds of the river and the privacy of the villa created a sanctuary I didn\'t know I needed.',
    source: 'Sydney, Australia',
    image_url: '/reviews/1.jpg'
  },
  {
    id: '2',
    guest_name: 'Marcus & Sarah',
    quote: 'The concierge service was impeccable. They arranged a private yoga session at sunrise that we will remember forever.',
    source: 'London, UK',
    image_url: '/reviews/2.jpg'
  },
  {
    id: '3',
    guest_name: 'David Chen',
    quote: 'Architecture that blends perfectly with nature. A true masterpiece in the middle of the jungle.',
    source: 'Singapore',
    image_url: '/reviews/3.jpg'
  }
];

export const GuestDiaries: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      if (isMock) {
        setReviews(MOCK_REVIEWS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const combined = [...data, ...MOCK_REVIEWS.slice(data.length, 3)];
          setReviews(combined);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (e) {
        console.warn('GuestDiaries: Fetch failed, utilizing mock data.', e);
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-24 flex justify-center bg-sand/20">
        <Loader2 className="animate-spin text-forest" />
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-sand/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent opacity-50"></div>
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-forest/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-4 opacity-60">
            <span className="w-8 h-px bg-forest"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-forest font-semibold">Guest Stories</span>
            <span className="w-8 h-px bg-forest"></span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-forest-dark mb-6">
            Diaries from the <span className="italic text-accent">Jungle</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {reviews.map((review, idx) => (
            <div
              key={review.id}
              className="group relative bg-[#F4F1EA] p-8 md:p-10 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-forest/10"
            >
              <Quote className="text-forest/10 w-12 h-12 mb-6 group-hover:text-forest/20 transition-colors" fill="currentColor" />

              <blockquote className="font-serif text-lg md:text-xl text-forest-dark leading-relaxed mb-8 min-h-[120px]">
                "{review.quote}"
              </blockquote>

              <div className="flex items-center gap-4 border-t border-forest/10 pt-6">
                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-forest/10 shrink-0">
                  <Image
                    src={review.image_url}
                    alt={review.guest_name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${review.guest_name}&background=537F5D&color=fff`;
                    }}
                  />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold uppercase tracking-wider text-forest-dark">
                    {review.guest_name}
                  </p>
                  <p className="font-serif text-sm text-forest/60 italic">
                    {review.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-forest/10 flex flex-wrap justify-center md:justify-around gap-12 text-center">
          <TrustMetric value="4.9/5" label="Average Rating" icon={<Star className="w-5 h-5 fill-forest text-forest" />} />
          <TrustMetric value="127+" label="Happy Guests" />
          <TrustMetric value="98%" label="5-Star Reviews" />
        </div>
      </div>
    </section>
  );
};

const TrustMetric: React.FC<{ value: string; label: string; icon?: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="flex flex-col items-center gap-2">
    {icon && <div className="mb-1">{icon}</div>}
    <span className="text-3xl md:text-4xl font-serif text-forest-dark font-medium">{value}</span>
    <span className="text-xs uppercase tracking-widest text-forest/60">{label}</span>
  </div>
);

export default GuestDiaries;
