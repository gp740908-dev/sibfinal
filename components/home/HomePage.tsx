'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Hero } from './Hero';
import { Villa } from '../../types';

// Components
const VillaShowcase = dynamic(() => import('./VillaShowcase'), {
    loading: () => <div className="h-[600px] md:h-[800px] w-full animate-pulse bg-[#D3D49F]/20" />,
});
const RecentJournal = dynamic(() => import('./RecentJournal'), {
    loading: () => <div className="h-[500px] md:h-[600px] w-full animate-pulse bg-[#F4F1EA]" />,
});
const Newsletter = dynamic(() => import('./Newsletter'));
const TrustBar = dynamic(() => import('./TrustBar'), { ssr: false });

// Heavy components - Lazy loaded with Default Exports for stability
const LocationSection = dynamic(() => import('./LocationSection'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full animate-pulse bg-[#F4F1EA]" />
});
const VideoParallax = dynamic(() => import('./VideoParallax'), { ssr: false });
const OurServices = dynamic(() => import('./OurServices'), { ssr: false });
const GuestDiaries = dynamic(() => import('./GuestDiaries'), { ssr: false });
const SignatureDetails = dynamic(() => import('./SignatureDetails'), { ssr: false });

interface HomePageProps {
    villas: Villa[];
}

export const HomePage: React.FC<HomePageProps> = ({ villas }) => {
    return (
        <main id="main-content" role="main" className="flex flex-col w-full">
            {/* Hero Section */}
            <Hero />

            {/* Trust Bar - Immediate Reassurance */}
            <TrustBar />

            {/* Intro Text - Our Philosophy */}
            <motion.section
                id="about"
                className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.15 } }
                }}
            >
                {/* Decorative Large Number */}
                <motion.span
                    className="absolute -left-4 md:left-0 top-20 font-serif text-[15rem] md:text-[20rem] leading-none text-forest/[0.03] select-none pointer-events-none -z-10"
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                    }}
                >
                    01
                </motion.span>

                <div className="md:w-1/2">
                    <motion.span
                        className="text-xs uppercase tracking-[0.3em] text-text-muted mb-4 block font-sans"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                        }}
                    >
                        Our Philosophy
                    </motion.span>

                    {/* Line Accent */}
                    <motion.div
                        className="w-16 h-[2px] bg-accent mb-8"
                        variants={{
                            hidden: { scaleX: 0, originX: 0 },
                            visible: { scaleX: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                        }}
                    />

                    <motion.h2
                        className="text-4xl md:text-6xl font-serif text-forest-dark leading-tight mb-8"
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                        }}
                    >
                        Where luxury meets <br /> <span className="italic text-accent">serenity.</span>
                    </motion.h2>
                </div>

                <motion.div
                    className="md:w-1/2 border-l border-forest/10 pl-8"
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
                    }}
                >
                    <p className="text-text-body font-sans text-lg leading-relaxed mb-6">
                        Ubud is not just a destination; it is a feeling. At StayinUBUD, we select homes that breathe.
                        Our collection features villas that open up to the jungle, float above rice terraces, and offer
                        silence so profound you can hear your own thoughts.
                    </p>
                    <p className="text-text-body font-sans text-lg leading-relaxed">
                        Every stay includes 24/7 personal concierge service to ensure your retreat is effortless.
                    </p>
                </motion.div>
            </motion.section>

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
