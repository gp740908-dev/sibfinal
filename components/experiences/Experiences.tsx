import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  id: string;
  category: string;
  title: string;
  description: string;
  cta: string;
  image: string;
}

export const Experiences: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    async function fetchExperiences() {
      const { data } = await supabase.from('experiences').select('*').order('created_at', { ascending: true });
      if (data) {
        const formatted = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          image: item.image_url,
          cta: item.cta_label
        }));
        setExperiences(formatted);
      }
    }
    fetchExperiences();
  }, []);

  useGSAP(() => {
    if (experiences.length === 0) return;

    // 1. Hero Reveal
    const tl = gsap.timeline();
    tl.from('.exp-hero-text', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.2
    });

    // 2. Content Sections Animation
    const sections = gsap.utils.toArray('.exp-section');
    sections.forEach((section: any) => {
      // Text Fade In
      gsap.from(section.querySelector('.exp-text'), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      // Image Parallax
      gsap.fromTo(section.querySelector('.exp-image'),
        { yPercent: -10, scale: 1.1 },
        { 
          yPercent: 10,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

  }, { scope: containerRef, dependencies: [experiences] });

  const handleInquire = () => {
    window.open('https://wa.me/6281234567890?text=I%20would%20like%20to%20inquire%20about%20an%20experience', '_blank');
  };

  if (experiences.length === 0) return <div className="min-h-screen bg-sand"></div>;

  return (
    <div ref={containerRef} className="bg-sand min-h-screen pt-24 pb-20 overflow-hidden">
      
      {/* 1. HERO */}
      <section className="px-6 md:px-12 py-20 md:py-32 text-center max-w-5xl mx-auto">
        <span className="exp-hero-text block font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-forest/60 mb-6">
          Beyond Accommodation
        </span>
        <h1 className="exp-hero-text text-5xl md:text-7xl lg:text-[8rem] font-serif text-forest leading-none tracking-tight mb-8">
          CURATED <span className="italic">MOMENTS</span>
        </h1>
        <div className="exp-hero-text w-px h-20 bg-forest/20 mx-auto mb-8"></div>
        <p className="exp-hero-text font-sans text-lg md:text-xl text-forest/80 max-w-2xl mx-auto leading-relaxed">
          We believe that a true luxury escape is defined not just by where you stay, but by how you feel. Our concierge team crafts bespoke itineraries to immerse you in the magic of Ubud.
        </p>
      </section>

      {/* 2. CONTENT BLOCKS */}
      <div className="flex flex-col gap-0">
        {experiences.map((item, index) => (
          <section 
            key={item.id} 
            className={`exp-section py-24 px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24 max-w-7xl mx-auto
              ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}
            `}
          >
            {/* Text Side */}
            <div className="exp-text w-full md:w-1/2 flex flex-col items-start">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent mb-4">
                0{index + 1} • {item.category}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight">
                {item.title}
              </h2>
              <p className="font-sans text-forest/80 text-lg leading-relaxed mb-8">
                {item.description}
              </p>
              <button 
                onClick={handleInquire}
                className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-forest hover:text-accent transition-colors"
              >
                {item.cta} <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            {/* Image Side */}
            <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-[4/5] overflow-hidden relative shadow-2xl bg-forest/10">
              <div className="w-full h-full overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="exp-image w-full h-[120%] object-cover -mt-[10%]"
                />
              </div>
              {/* Decorative Border */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none"></div>
            </div>
          </section>
        ))}
      </div>

      {/* 3. FLOATING CTA */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
        <button 
          onClick={handleInquire}
          className="bg-forest text-sand pl-6 pr-8 py-4 rounded-full shadow-2xl hover:bg-forest/90 hover:scale-105 transition-all duration-300 flex items-center gap-3 group border border-sand/10"
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-sans text-xs uppercase tracking-widest font-bold">Inquire Experience</span>
          <MessageCircle size={18} className="text-sand/80 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

    </div>
  );
};