'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Hero } from './Hero';
import { Villa } from '../../types';
import TrustBar from './TrustBar'; // Standard Import for SSR

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
        <main id="main-content" role="main" className="flex flex-col w-full">
            {/* Hero Section */}
            {heroSection}

            {/* Trust Bar - Immediate Reassurance */}
            <TrustBar />

            {/* Intro Text - Our Philosophy */}
            <section
                ref={aboutRef}
                id="about"
                className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start relative"
            >
                {/* Decorative Large Number - with scroll-linked rotation */}
                <span
                    className={`absolute -left-4 md:left-0 top-20 font-serif text-[15rem] md:text-[20rem] leading-none text-forest/[0.03] select-none pointer-events-none -z-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isAboutVisible ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-12 -rotate-12 scale-95'}`}
                    aria-hidden="true"
                >
                    01
                </span>

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
                        className={`text-4xl md:text-6xl font-serif text-forest-dark leading-tight mb-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:300ms] ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        Where luxury meets <br /> <span className="italic text-accent">serenity.</span>
                    </h2>
                </div>

                <div
                    className={`md:w-1/2 border-l border-forest/10 pl-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:400ms] ${isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <p className="text-text-body font-sans text-lg leading-relaxed mb-6">
                        Ubud is not just a destination; it is a feeling. At StayinUBUD, we select homes that breathe.
                        Our collection features villas that open up to the jungle, float above rice terraces, and offer
                        silence so profound you can hear your own thoughts.
                    </p>
                    <p className="text-text-body font-sans text-lg leading-relaxed">
                        Every stay includes 24/7 personal concierge service to ensure your retreat is effortless.
                    </p>
                </div>
            </section>

            {/* Villa Showcase Section */}
            <div id="villas">
                <VillaShowcase villas={villas.slice(0, 4)} />

                <div className="flex justify-center mt-8 gap-4 mb-20 flex-wrap px-4">
                    {villas.slice(0, 4).map(v => (
                        <Link
                            key={v.id}
                            href={`/villas/${v.id}`}
                            className="text-xs uppercase tracking-widest border-b border-forest/20 pb-1 hover:border-forest transition-colors"
                        >
                            View {v.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sensory Video Break */}
            <VideoParallax />

            {/* Experience Section */}
            <div id="experiences">
                <OurServices />
            </div>

            {/* Guest Diaries Social Proof */}
            <GuestDiaries />

            {/* Signature Details (Sticky Scroll) */}
            <SignatureDetails />



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
