
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { supabase } from '../../lib/supabase';
import { BlogPost } from '../../types';
import { JournalCard } from '../../components/journal/JournalCard';
import {
    Shield,
    MapPin,
    TrendingUp,
    ArrowRight,
    FileText,
    Building
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'The Bali Guide - Property, Culture & Investment | StayinUBUD',
    description: 'Your essential guide to navigating Bali ownership regulations, discovering key neighborhoods, and understanding the real estate market trends.',
};

// Fallback Mock Data for Guides
const MOCK_GUIDES: BlogPost[] = [
    {
        id: 'g1',
        title: 'Foreign Ownership: A Comprehensive Strategy',
        excerpt: 'Understanding the Hak Pakai (Right to Use) title and how to legally secure your leasehold property in Indonesia.',
        category: 'Guide',
        imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=1000',
        publishedAt: 'March 15, 2024',
        slug: 'foreign-ownership-strategy',
        author: 'Legal Team'
    },
    {
        id: 'g2',
        title: 'The Rise of Northern Ubud: Investment Forecast',
        excerpt: 'Why smart investors are looking beyond the chaotic center to the serene rice terraces of Tegallalang and Payangan.',
        category: 'Guide',
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000',
        publishedAt: 'March 10, 2024',
        slug: 'northern-ubud-forecast',
        author: 'Market Analyst'
    },
    {
        id: 'g3',
        title: 'Building Regulations & Green Zones Explained',
        excerpt: 'Navigating the IMB/PBG permit process and respecting Bali’s protected agricultural zones.',
        category: 'Guide',
        imageUrl: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80&w=1000',
        publishedAt: 'February 28, 2024',
        slug: 'building-regulations-green-zones',
        author: 'Consultant'
    }
];

// Helper to map DB response
const mapDbToPost = (p: any): BlogPost => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    imageUrl: p.image_url,
    publishedAt: p.published_at,
    slug: p.slug,
    author: p.author
});

async function getGuidePosts() {
    try {
        const { data, error } = await supabase
            .from('journal_posts')
            .select('*')
            .ilike('category', 'Detail%') // Or 'guide' if you have it. Using a loose match or fetch all and filter.
            // Actually let's fetch 'Guide' specifically or similar. 
            // Since I suspect the DB might be empty of 'guides', I will prioritize the MOCK for this specific page 
            // if DB returns nothing useful.
            .ilike('category', 'Guide')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error || !data || data.length === 0) {
            return MOCK_GUIDES;
        }

        return data.map(mapDbToPost);
    } catch (err) {
        return MOCK_GUIDES;
    }
}

export default async function BaliGuidePage() {
    const guidePosts = await getGuidePosts();

    return (
        <main className="min-h-screen bg-sand text-forest">

            {/* 1. HERO SECTION */}
            <section className="relative h-[50vh] min-h-[400px] flex flex-col justify-center items-center text-center px-6">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80&w=2000"
                        alt="Bali Temple Gate Guide"
                        className="w-full h-full object-cover brightness-50"
                    />
                    <div className="absolute inset-0 bg-forest/20 mix-blend-multiply" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto text-sand animate-fade-in">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest opacity-80 mb-6 font-sans">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-bold">Bali Guide</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                        The Bali Guide
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-light max-w-2xl mx-auto leading-relaxed">
                        Navigating the Island of Gods: Property, Culture, and Investment.
                    </p>
                </div>
            </section>

            {/* 2. CORE CONTENT (BENTO GRID) */}
            <section className="px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

                    {/* Card A: Legal Guide (Large) */}
                    <Link href="/bali-guide/legal-guide" className="group md:col-span-2 relative overflow-hidden rounded-3xl bg-forest text-sand p-8 md:p-12 flex flex-col justify-between shadow-xl transition-transform duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                            <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="bg-sand/10 p-3 rounded-full backdrop-blur-md">
                                <Shield size={28} className="text-sand" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-12">
                            <span className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Ownership & Regulations</span>
                            <h3 className="text-3xl md:text-4xl font-serif mb-4">The Legal Handbook</h3>
                            <p className="text-sand/80 max-w-md mb-6 font-sans text-sm md:text-base leading-relaxed">
                                A definitive guide to foreign ownership, leasehold vs. freehold structures, and navigating Indonesian property law safely.
                            </p>
                            <div className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold group-hover:gap-4 transition-all">
                                Read Guide <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>

                    {/* Card B: Location Guide (Tall) */}
                    <Link href="/bali-guide/neighborhoods" className="group md:col-span-1 relative overflow-hidden rounded-3xl bg-[#EBEBC0] text-forest p-8 flex flex-col justify-between shadow-xl transition-transform duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                            {/* Abstract Map Pattern */}
                            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0H100V100H0V0Z" fill="currentColor" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex justify-end">
                            <div className="bg-forest/10 p-3 rounded-full">
                                <MapPin size={24} className="text-forest" />
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <span className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Neighborhoods</span>
                            <h3 className="text-3xl font-serif mb-4">Area Guides</h3>
                            <p className="text-forest/70 text-sm mb-6 leading-relaxed">
                                From the spiritual heart of Ubud to the surf breaks of Uluwatu. Discover where you belong.
                            </p>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold group-hover:gap-4 transition-all">
                                Explore Areas <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    {/* Card C: Market Insights (Wide) */}
                    <Link href="/bali-guide/market-trends" className="group md:col-span-3 relative overflow-hidden rounded-3xl bg-sand border border-forest/10 text-forest p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xl transition-transform duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-[#D3D49F]/20 -skew-x-12 translate-x-1/2 group-hover:translate-x-[40%] transition-transform duration-700"></div>

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-forest/10 p-3 rounded-full">
                                    <TrendingUp size={28} className="text-forest" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Market Intelligence</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-serif mb-4">Bali Real Estate Trends 2024</h3>
                            <p className="text-forest/70 max-w-xl text-lg leading-relaxed">
                                Data-driven insights on occupancy rates, ROI projections, and emerging investment hotspots across the island.
                            </p>
                        </div>

                        <div className="relative z-10 flex-shrink-0">
                            <div className="px-8 py-4 bg-forest text-sand rounded-full text-sm uppercase tracking-widest font-bold flex items-center gap-2 group-hover:scale-105 transition-transform shadow-lg">
                                View Data <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>

                </div>
            </section>

            {/* 3. LATEST ARTICLES */}
            <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12 border-b border-forest/10 pb-6">
                    <div>
                        <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-2">Latest Updates</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-forest">Essential Reading</h2>
                    </div>
                    <Link href="/journal" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:text-accent transition-colors">
                        View All Articles <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {guidePosts.map(post => (
                        <JournalCard key={post.id} post={post} />
                    ))}
                </div>
            </section>

        </main>
    );
}
