'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Hero } from './Hero';
import { Villa } from '../../types';
import TrustBar from './TrustBar'; // Standard Import for SSR
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ArrowRight } from 'lucide-react';

// Components
const VillaShowcase = dynamic(() => import('./VillaShowcase'), {
    loading: () => <div className="h-[600px] md:h-[800px] w-full animate-pulse bg-sand/20" />,
});
const RecentJournal = dynamic(() => import('./RecentJournal'), {
    loading: () => <div className="h-[500px] md:h-[600px] w-full animate-pulse bg-sand-light" />,
});
const Newsletter = dynamic(() => import('./Newsletter'));

// Optimization: Lazy loaded with Default Exports for stability
// These components are heavy and not needed for LCP.
const LocationSection = dynamic(() => import('./LocationSection'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full animate-pulse bg-sand-light" />
});
const VideoParallax = dynamic(() => import('./VideoParallax'), { ssr: false });
const OurServices = dynamic(() => import('./OurServices'), { ssr: false });
const GuestDiaries = dynamic(() => import('./GuestDiaries'));
const SignatureDetails = dynamic(() => import('./SignatureDetails'));

interface HomePageProps {
    villas: Villa[];
    heroSection?: React.ReactNode; // Slot for Server Component
}

export const HomePage: React.FC<HomePageProps> = ({ villas, heroSection }) => {
    const aboutRef = useRef<HTMLElement>(null);
    const [isAboutVisible, setIsAboutVisible] = useState(false);

    // Intersection Observer for scroll-triggered animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsAboutVisible(true);
                    observer.disconnect(); // Only trigger once
                }
            },
            { threshold: 0.1, rootMargin: '-100px' }
        );

        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <main id="main-content" role="main" className="flex flex-col w-full overflow-x-hidden">
            {/* Hero Section */}
            {heroSection}

            {/* Trust Bar - Immediate Reassurance */}
            <TrustBar />

            {/* Intro Text - Our Philosophy */}
            <section
                ref={aboutRef}
                id="about"
                className="py-32 md:py-48 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-20 md:gap-32 items-start relative overflow-hidden"
            >
                {/* Decorative Large Number - with scroll-linked rotation */}
                <span
                    className={`absolute left-0 md:-left-20 top-20 font-serif text-[10rem] md:text-[24rem] leading-none text-forest/[0.02] select-none pointer-events-none -z-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isAboutVisible ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-12 -rotate-12 scale-95'}`}
                    aria-hidden="true"
                >
                    01
                </span>

                {/* Floating Decorative Image - Subtle visual element */}
                <div
                    className={`absolute right-0 md:right-12 top-1/2 -translate-y-1/2 w-24 h-36 md:w-48 md:h-64 rounded-full overflow-hidden opacity-10 md:opacity-30 pointer-events-none -z-10 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isAboutVisible ? 'opacity-10 md:opacity-30 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-90'}`}
                    aria-hidden="true"
                >
                    <img
                        src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=60&w=300"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="md:w-1/2">
                    <span
                        className={`text-xs uppercase tracking-[0.3em] text-text-muted mb-4 block font-sans transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:100ms] ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    >
                        Our Philosophy
                    </span>

                    {/* Line Accent */}
                    <div
                        className={`w-16 h-[2px] bg-accent mb-8 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:200ms] ${isAboutVisible ? 'scale-x-100' : 'scale-x-0'}`}
                    />

                    <h2
                        className={`text-4xl md:text-6xl lg:text-7xl font-serif text-forest-dark leading-[1.1] mb-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:300ms] ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        Where luxury meets <br /> <span className="italic text-accent">serenity.</span>
                    </h2>
                </div>

                <div
                    className={`md:w-1/2 border-l border-forest/10 pl-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:400ms] ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <p className="text-text-body font-sans text-lg leading-loose mb-6">
                        Ubud is not just a destination; it is a feeling. At StayinUBUD, we select homes that breathe.
                        Our collection features villas that open up to the jungle, float above rice terraces, and offer
                        silence so profound you can hear your own thoughts.
                    </p>
                    <p className="text-text-body font-sans text-lg leading-loose mb-10">
                        Every stay includes 24/7 personal concierge service to ensure your retreat is effortless.
                    </p>

                    {/* CTA Button */}
                    <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:600ms] ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <Link href="/about">
                            <MagneticButton className="group inline-flex items-center gap-3 px-8 py-4 border border-forest/20 hover:border-forest/50 bg-transparent transition-all duration-500">
                                <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-forest-dark group-hover:text-forest transition-colors">
                                    Discover Our Story
                                </span>
                                <ArrowRight size={14} className="text-forest-dark group-hover:translate-x-1 transition-transform duration-300" />
                            </MagneticButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Villa Showcase Section */}
            <div id="villas" className="mb-0">
                <VillaShowcase villas={villas.slice(0, 4)} />
            </div>

            {/* Signature Details (Sticky Scroll) - Moved UP for narrative flow */}
            <SignatureDetails />

            {/* Sensory Video Break */}
            <VideoParallax />

            {/* Experience Section */}
            <div id="experiences">
                <OurServices />
            </div>

            {/* Guest Diaries Social Proof */}
            <GuestDiaries />



            {/* Location Section */}
            <div id="locations">
                <LocationSection villas={villas} />
            </div>

            {/* Recent Journal Section */}
            <div id="journal">
                <RecentJournal />
            </div>

            {/* Newsletter Section - Final CTA */}
            <Newsletter />
        </main>
    );
};
