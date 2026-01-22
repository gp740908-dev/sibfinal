'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from './Hero';
import { VillaShowcase } from './VillaShowcase';
import { LocationSection } from './LocationSection';
import { OurServices } from './OurServices';
import { RecentJournal } from './RecentJournal';
import { VideoParallax } from './VideoParallax';
import { GuestDiaries } from './GuestDiaries';
import { SignatureDetails } from './SignatureDetails';
import { Newsletter } from './Newsletter';
import { Villa } from '../../types';
import { supabase, isMock } from '../../lib/supabase';
import { Loader2, Leaf } from 'lucide-react';

// Fallback Data
const MOCK_VILLAS: Villa[] = [
    {
        id: '1',
        name: 'Royal Jungle Suite',
        description: 'A sanctuary of peace nestled in the rice terraces, offering refined luxury with a touch of Balinese heritage.',
        pricePerNight: 3500000,
        bedrooms: 2,
        guests: 4,
        imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200',
        images: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200'],
        features: ['Infinity Pool', 'Rice Field View', 'Private Chef'],
        land_area: 250, building_area: 180, levels: 1, bathrooms: 2, pantry: 1, pool_area: 1,
        latitude: -8.5069, longitude: 115.2625
    },
    {
        id: '2',
        name: 'Forest Canopy House',
        description: 'Suspended in the jungle canopy for ultimate privacy, featuring an open-air bath and morning yoga shala.',
        pricePerNight: 5200000,
        bedrooms: 3,
        guests: 6,
        imageUrl: 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1200',
        images: ['https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1200'],
        features: ['Jungle View', 'Yoga Shala', 'Open Air Bath'],
        land_area: 400, building_area: 320, levels: 2, bathrooms: 3, pantry: 1, pool_area: 1,
        latitude: -8.4900, longitude: 115.2500
    },
    {
        id: '3',
        name: 'Estate of Zen',
        description: 'Traditional Balinese architecture meets modern luxury. Includes a private cinema and direct river access.',
        pricePerNight: 8500000,
        bedrooms: 5,
        guests: 10,
        imageUrl: 'https://images.unsplash.com/photo-1601369363069-425b09579de0?auto=format&fit=crop&q=80&w=1200',
        images: ['https://images.unsplash.com/photo-1601369363069-425b09579de0?auto=format&fit=crop&q=80&w=1200'],
        features: ['River Access', 'Spa Center', 'Cinema Room'],
        land_area: 900, building_area: 650, levels: 2, bathrooms: 6, pantry: 2, pool_area: 1,
        latitude: -8.5200, longitude: 115.2700
    },
    {
        id: '4',
        name: 'Valley Horizon',
        description: 'Perched on the edge of the Ayung river valley, offering breathtaking sunset views and infinity living.',
        pricePerNight: 4100000,
        bedrooms: 2,
        guests: 4,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200'],
        features: ['Sunset View', 'Infinity Pool', 'Butler Service'],
        land_area: 300, building_area: 210, levels: 1, bathrooms: 2, pantry: 1, pool_area: 1,
        latitude: -8.4850, longitude: 115.2400
    }
];

const safeFloat = (val: any): number => {
    if (val === null || val === undefined) return NaN;
    const num = Number(val);
    return isFinite(num) ? num : NaN;
};

const mapDbToVilla = (v: any): Villa => ({
    id: v.id,
    name: v.name,
    description: v.description,
    pricePerNight: v.price_per_night,
    bedrooms: v.bedrooms,
    guests: v.guests,
    imageUrl: v.image_url,
    images: v.images || [],
    features: v.features || [],
    land_area: v.land_area,
    building_area: v.building_area,
    levels: v.levels,
    bathrooms: v.bathrooms,
    pantry: v.pantry,
    pool_area: v.pool_area,
    latitude: safeFloat(v.latitude),
    longitude: safeFloat(v.longitude),
    amenities_detail: v.amenities_detail,
    house_rules: v.house_rules,
    proximity_list: v.proximity_list,
    sleeping_arrangements: v.sleeping_arrangements
});

export const HomePage: React.FC = () => {
    const [villas, setVillas] = useState<Villa[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchVillas() {
            if (isMock) {
                setVillas(MOCK_VILLAS);
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase.from('villas').select('*');

                if (error) {
                    console.error('Supabase Error:', error);
                    setVillas(MOCK_VILLAS);
                    return;
                }

                if (data && data.length > 0) {
                    setVillas(data.map(mapDbToVilla));
                } else {
                    setVillas(MOCK_VILLAS);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setVillas(MOCK_VILLAS);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVillas();
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-sand text-forest relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(83,127,93,0.05)_0%,transparent_70%)]" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative mb-10">
                        <div className="w-20 h-20 border-[1px] border-forest/10 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-2 border-[1px] border-forest/30 rounded-full border-t-transparent animate-[spin_3s_linear_infinite_reverse]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Leaf size={20} className="text-forest opacity-80 animate-pulse" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-forest tracking-wide mb-3 italic">
                        Summoning the Jungle
                    </h3>
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-forest/50">
                        Curating Luxury
                    </p>
                </div>
            </div>
        );
    }

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
                    <p className="text-forest/80 font-sans text-lg leading-relaxed mb-6">
                        Ubud is not just a destination; it is a feeling. At StayinUBUD, we select homes that breathe.
                        Our collection features villas that open up to the jungle, float above rice terraces, and offer
                        silence so profound you can hear your own thoughts.
                    </p>
                    <p className="text-forest/80 font-sans text-lg leading-relaxed">
                        Every stay includes 24/7 personal concierge service to ensure your retreat is effortless.
                    </p>
                </div>
            </section>

            {/* Villa Showcase Section */}
            <div id="villas">
                <VillaShowcase villas={villas} />

                <div className="flex justify-center mt-8 gap-4 mb-20 flex-wrap px-4">
                    {villas.map(v => (
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
        </div>
    );
};
