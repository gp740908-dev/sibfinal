'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Palette, Heart, ShieldCheck } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Philosophy Text Reveal
    const tl = gsap.timeline();
    tl.from('.philosophy-word', {
      y: 50,
      opacity: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    })
      .from('.philosophy-sub', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");

    // 2. Rotating Seal
    gsap.to(sealRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear"
    });

    // 3. Scroll Reveal Sections
    const sections = gsap.utils.toArray('.reveal-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 4. Parallax Image Effect
    gsap.utils.toArray('.parallax-img').forEach((img: any) => {
      gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

  }, { scope: containerRef });

  // Helper to split text for animation
  const splitText = (text: string) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="philosophy-word inline-block mr-2 md:mr-4 will-change-transform">
        {word}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="pt-24 pb-0 min-h-screen bg-sand text-forest-dark overflow-hidden">

      {/* SECTION 1: THE PHILOSOPHY (Hero) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 md:px-12 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-serif leading-none tracking-tight mb-12">
          {splitText("A RETURN TO NATURE")}
        </h1>
        <div className="w-px h-20 bg-forest-dark/30 mb-12 animate-fade-in"></div>
        <p className="philosophy-sub text-lg md:text-2xl font-sans font-light max-w-2xl leading-relaxed opacity-100 text-forest-dark/90">
          We believe luxury isn't about golden taps. It's about silence, space, and the sound of the wind in the trees.
        </p>
      </section>

      {/* SECTION 2: THE ORIGINS (Asymmetrical Grid) */}
      <section className="reveal-section py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative">

          {/* Rotating Seal Graphic */}
          <div ref={sealRef} className="absolute -top-10 -left-10 md:-left-20 md:top-0 w-32 h-32 md:w-48 md:h-48 z-10 opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full text-forest-dark fill-current">
              <path id="curve" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="transparent" />
              <text className="text-[12px] uppercase tracking-[0.2em] font-bold">
                <textPath href="#curve">
                  StayinUBUD • Est. 2024 • Luxury Sanctuary • Bali •
                </textPath>
              </text>
            </svg>
          </div>

          {/* Left Image */}
          <div className="md:col-span-5 h-[600px] overflow-hidden rounded-t-[10rem] relative z-0">
            <img
              src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=800"
              alt="Ubud Temple Texture"
              className="parallax-img w-full h-[120%] object-cover -mt-[10%]"
            />
          </div>

          {/* Right Text */}
          <div className="md:col-span-1 md:col-start-7"></div> {/* Spacer */}
          <div className="md:col-span-5">
            <span className="block font-sans text-xs uppercase tracking-[0.2em] text-forest-dark/60 mb-6">Origins</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Born in the <br /> <span className="italic text-forest-dark/80">Sacred Valley</span></h2>
            <p className="font-sans text-lg leading-relaxed mb-6 text-forest-dark/80">
              StayinUBUD started as a whisper. A desire to share the side of Bali that often goes unseen—the misty mornings in the highlands, the intricate devotion of daily offerings, and the profound stillness of the jungle.
            </p>
            <p className="font-sans text-lg leading-relaxed text-forest-dark/80">
              We moved away from the crowded centers to curate homes that honor the land they stand on. Each villa tells a story of craftsmanship, heritage, and harmony with nature.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR VALUES */}
      <section className="reveal-section py-32 px-6 md:px-12 border-t border-forest-dark/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif">OUR PILLARS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Value 1 */}
            <div className="group p-8 border border-forest-dark/10 hover:border-forest-dark/50 transition-all duration-500 hover:-translate-y-2 bg-sand">
              <div className="mb-6 text-forest-dark/70 group-hover:text-forest-dark transition-colors">
                <Palette size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Curated Design</h3>
              <p className="font-sans text-forest-dark/70 leading-relaxed">
                Every corner is intentional. We select homes where architecture doesn't just house you, but moves you. Minimalist, textural, and authentically Balinese.
              </p>
            </div>

            {/* Value 2 */}
            <div className="group p-8 border border-forest-dark/10 hover:border-forest-dark/50 transition-all duration-500 hover:-translate-y-2 bg-sand">
              <div className="mb-6 text-forest-dark/70 group-hover:text-forest-dark transition-colors">
                <Heart size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Local Soul</h3>
              <p className="font-sans text-forest-dark/70 leading-relaxed">
                Deeply rooted in <span className="italic">Tri Hita Karana</span>. We work with local artisans, chefs, and guides to ensure your stay supports the community that hosts you.
              </p>
            </div>

            {/* Value 3 */}
            <div className="group p-8 border border-forest-dark/10 hover:border-forest-dark/50 transition-all duration-500 hover:-translate-y-2 bg-sand">
              <div className="mb-6 text-forest-dark/70 group-hover:text-forest-dark transition-colors">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Privacy First</h3>
              <p className="font-sans text-forest-dark/70 leading-relaxed">
                Your sanctuary, undisturbed. We prioritize secluded locations and discreet service, giving you the rarest luxury of all: true privacy.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: THE HOST'S NOTE */}
      <section className="reveal-section py-24 px-6 md:px-12 bg-forest-dark/5">
        <div className="max-w-4xl mx-auto border border-forest-dark/20 p-8 md:p-16 relative bg-sand/50">
          <div className="flex flex-col md:flex-row gap-10 items-center">

            {/* Host Photo */}
            <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-full border border-forest-dark/20">
              <img
                src="https://cdn.discordapp.com/attachments/899895963685109810/1382100420209672383/image.png?"
                alt="Founder"
                className="w-full h-full object-cover grayscale opacity-90"
              />
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-serif text-xl md:text-2xl text-forest-dark/80 italic leading-relaxed mb-6">
                "We invite you to experience the Bali we love—the one that smells of incense and rain, feels like rough stone and soft silk, and sounds like a distant gamelan carried by the wind."
              </p>
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
                <div>
                  <span className="block font-sans text-xs uppercase tracking-widest font-bold">Cipeng</span>
                  <span className="block font-sans text-xs text-forest-dark/60 mt-1">Founders, StayinUBUD</span>
                </div>

                {/* Signature SVG */}
                <svg width="150" height="40" viewBox="0 0 150 40" className="text-forest-dark opacity-80">
                  <path d="M10,20 Q30,5 50,20 T90,20 T130,20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M60,20 Q70,35 80,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M100,20 Q110,30 120,15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
