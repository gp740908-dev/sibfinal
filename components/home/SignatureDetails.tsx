import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Coffee, Sparkles, Sun } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MOMENTS = [
  {
    id: 0,
    title: "Floating Breakfast",
    description: "Begin your day effortlessly. A curated selection of tropical fruits, artisanal pastries, and local coffee served on a floating tray in your private infinity pool.",
    icon: <Coffee size={24} />,
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1000" // Floating breakfast pool shot
  },
  {
    id: 1,
    title: "Floral Bath Ritual",
    description: "A sensory journey using thousands of fresh marigold and frangipani petals. Prepared by our wellness therapists to soothe the body and calm the spirit.",
    icon: <Sparkles size={24} />,
    image: "https://images.unsplash.com/photo-1555819206-79c0990390f7?auto=format&fit=crop&q=80&w=1000" // Flower bath shot
  },
  {
    id: 2,
    title: "Sunrise Yoga Deck",
    description: "Greet the sun as it rises over the Ayung River valley. Our private wooden decks offer the perfect stillness for meditation and morning flow.",
    icon: <Sun size={24} />,
    image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=1000" // Yoga deck shot
  }
];

export const SignatureDetails: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    // 1. PINNING LOGIC
    // We pin the Left Column for the duration of the Right Column's scroll height
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: leftColRef.current,
      scrub: true,
    });

    // 2. STATE CHANGE LOGIC
    // As each image section enters the center of the viewport, update the active index
    const imageSections = gsap.utils.toArray('.moment-image-section');
    
    imageSections.forEach((section: any, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });

  }, { scope: containerRef });

  // Text Transition Effect
  const textRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 20, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
      );
    }
  }, [activeIndex]); // Re-run when index changes

  return (
    <section ref={containerRef} className="relative flex flex-col md:flex-row w-full bg-forest">
      
      {/* LEFT COLUMN (Sticky) */}
      <div 
        ref={leftColRef} 
        className="hidden md:flex w-1/2 h-screen flex-col justify-center px-16 lg:px-24 text-sand z-10"
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] opacity-60 mb-8 border-l border-sand/30 pl-4 h-12 flex items-center">
          Curated Moments
        </span>
        
        {/* Dynamic Text Content */}
        <div ref={textRef} className="flex flex-col gap-6">
          <div className="w-12 h-12 rounded-full border border-sand/30 flex items-center justify-center mb-2">
             {MOMENTS[activeIndex].icon}
          </div>
          
          <div className="flex items-baseline gap-4 opacity-50 font-serif text-lg">
            <span>0{activeIndex + 1}</span>
            <span className="h-px w-12 bg-sand"></span>
            <span>0{MOMENTS.length}</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-serif leading-none">
            {MOMENTS[activeIndex].title}
          </h2>
          
          <p className="font-sans text-lg opacity-80 leading-relaxed max-w-md">
            {MOMENTS[activeIndex].description}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN (Scrolling Images) */}
      <div ref={rightColRef} className="w-full md:w-1/2 flex flex-col">
        {MOMENTS.map((moment, idx) => (
          <div 
            key={moment.id} 
            className="moment-image-section h-screen w-full relative overflow-hidden border-b md:border-b-0 md:border-l border-sand/10"
          >
            <img 
              src={moment.image} 
              alt={moment.title} 
              className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out hover:scale-105"
            />
            
            {/* Mobile Overlay (Since Sticky Layout is hidden on Mobile) */}
            <div className="md:hidden absolute inset-0 bg-forest/60 flex flex-col justify-end p-8 text-sand">
               <div className="mb-4 text-accent">{moment.icon}</div>
               <h3 className="text-3xl font-serif mb-2">{moment.title}</h3>
               <p className="font-sans text-sm opacity-90">{moment.description}</p>
            </div>
            
            {/* Overlay Gradient for Desktop visual separation */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-forest/50 to-transparent mix-blend-multiply pointer-events-none"></div>
          </div>
        ))}
      </div>

    </section>
  );
};