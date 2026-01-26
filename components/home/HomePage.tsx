import dynamic from 'next/dynamic';
import { Hero } from './Hero';
import { Villa } from '../../types';
import { Loader2, Leaf } from 'lucide-react';

const VillaShowcase = dynamic(() => import('./VillaShowcase').then(mod => mod.VillaShowcase));
const LocationSection = dynamic(() => import('./LocationSection').then(mod => mod.LocationSection), { ssr: false });
const OurServices = dynamic(() => import('./OurServices').then(mod => mod.OurServices));
const RecentJournal = dynamic(() => import('./RecentJournal').then(mod => mod.RecentJournal));
const VideoParallax = dynamic(() => import('./VideoParallax').then(mod => mod.VideoParallax), { ssr: false });
const GuestDiaries = dynamic(() => import('./GuestDiaries').then(mod => mod.GuestDiaries));
const SignatureDetails = dynamic(() => import('./SignatureDetails').then(mod => mod.SignatureDetails));
const HomeScrollExperience = dynamic(() => import('./HomeScrollExperience').then(mod => mod.HomeScrollExperience), { ssr: false });
const Newsletter = dynamic(() => import('./Newsletter').then(mod => mod.Newsletter));

interface HomePageProps {
    villas: Villa[];
}

export const HomePage: React.FC<HomePageProps> = ({ villas }) => {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <Hero />

            {/* Intro Text */}
            <section id="about" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                <div className="md:w-1/2">
                    <h2 className="text-4xl md:text-6xl font-serif text-forest leading-tight mb-8">
                        Where luxury meets <br /> <span className="italic text-accent">serenity.</span>
                    </h2>
                </div>
                <div className="md:w-1/2">
                    <p className="text-neutral-800 font-sans text-lg leading-relaxed mb-6">
                        Ubud is not just a destination; it is a feeling. At StayinUBUD, we select homes that breathe.
                        Our collection features villas that open up to the jungle, float above rice terraces, and offer
                        silence so profound you can hear your own thoughts.
                    </p>
                    <p className="text-neutral-800 font-sans text-lg leading-relaxed">
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

            {/* Scroll Experience (Image Sequence) */}
            <HomeScrollExperience />

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
        </div>
    );
};
