
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Quote, Loader2 } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface Review {
  id: string;
  guest_name: string;
  quote: string;
  source: string;
  image_url: string;
}

const MOCK_REVIEW: Review = {
  id: '1',
  guest_name: 'Elena S.',
  quote: 'I have never slept so deeply. The sounds of the river and the privacy of the villa created a sanctuary I didn\'t know I needed.',
  source: 'Architecture Digest',
  image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000'
};

export const GuestDiaries: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      if (isMock) {
        setReview(MOCK_REVIEW);
        setLoading(false);
        return;
      }

      try {
        console.log('GuestDiaries: Fetching featured review...');
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_featured', true)
          .limit(1)
          .maybeSingle(); // Safer than single() for 0 rows
        
        if (error) {
          console.warn('GuestDiaries: Error fetching from Supabase, falling back to mock.', error.message);
          setReview(MOCK_REVIEW);
        } else if (data) {
          console.log('GuestDiaries: Data fetched successfully.');
          setReview(data);
        } else {
          console.log('GuestDiaries: No featured review found in DB, falling back to mock.');
          setReview(MOCK_REVIEW);
        }
      } catch (e) {
        console.error('GuestDiaries: Unexpected error, falling back to mock.', e);
        setReview(MOCK_REVIEW);
      } finally {
        setLoading(false);
      }
    }
    fetchReview();
  }, []);

  useGSAP(() => {
    if (!review) return;

    // Only set up animation if elements exist
    if (imageRef.current && cardRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      tl.to(imageRef.current, {
        yPercent: 10,
        ease: "none"
      }, 0);

      tl.to(cardRef.current, {
        yPercent: -30,
        ease: "none"
      }, 0);
    }
  }, { scope: containerRef, dependencies: [review, loading] });

  // Render loading state
  if (loading) {
    return (
      <section className="py-24 px-6 flex justify-center items-center bg-forest/5 min-h-[400px]">
        <Loader2 className="animate-spin text-forest" />
      </section>
    );
  }

  if (!review) return null;

  return (
    <section ref={containerRef} className="py-24 md:py-40 px-6 md:px-12 bg-forest/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-center">
        
        {/* LAYER 1: IMAGE (Left, 40%) */}
        <div 
          ref={imageRef} 
          className="w-full md:w-5/12 aspect-[3/4] relative z-0 shadow-2xl"
        >
          <div className="w-full h-full overflow-hidden">
             <img 
               src={review.image_url} 
               alt="Guest relaxing in villa sanctuary"
               className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
             />
             {/* Subtle Overlay to blend */}
             <div className="absolute inset-0 bg-forest/10 mix-blend-multiply"></div>
          </div>
        </div>

        {/* LAYER 2: TEXT CARD (Overlapping) */}
        <div 
          ref={cardRef}
          className="w-full md:w-1/2 bg-[#D3D49F] p-10 md:p-16 shadow-2xl relative z-10 -mt-20 md:mt-0 md:-ml-24 border-t border-l border-white/20"
        >
          {/* Decorative Quote Icon Layer */}
          <div className="absolute top-8 left-8 text-forest opacity-10 pointer-events-none">
             <Quote size={140} fill="currentColor" strokeWidth={0} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-forest/40"></span>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-forest/60">Guest Diaries</span>
            </div>

            <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl text-forest leading-[1.2] mb-10 italic">
              "{review.quote}"
            </blockquote>

            <div className="flex flex-col border-l-2 border-forest/20 pl-4">
              <span className="font-sans text-sm font-bold uppercase tracking-widest text-forest">{review.guest_name}</span>
              {review.source && (
                 <span className="font-sans text-xs text-forest/60 mt-1 italic">{review.source}</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
