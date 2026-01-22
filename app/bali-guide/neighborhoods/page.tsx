
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, MapPin, Coffee, Waves, Mountain } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Bali Neighborhood Guide: Ubud, Canggu, Uluwatu | StayinUBUD',
    description: 'Discover the unique vibes of Bali’s most popular regions. From the spiritual jungle of Ubud to the surf breaks of Uluwatu.',
};

export default function NeighborhoodsPage() {
    return (
        <main className="min-h-screen bg-sand text-forest pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">

                {/* Breadcrumb */}
                <Link href="/bali-guide" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8">
                    <ArrowLeft size={16} /> Back to Guide
                </Link>

                {/* Header */}
                <div className="mb-16 border-b border-forest/10 pb-12 text-center">
                    <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Area Guide</span>
                    <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                        Find Your <span className="italic opacity-70">Compass</span>
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-light leading-relaxed opacity-80 max-w-2xl mx-auto">
                        Bali is an island of many faces. Each village hums with its own frequency.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="space-y-24">

                    {/* UBUD */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="flex items-center gap-3 mb-4 text-forest/60">
                                <Mountain size={24} />
                                <span className="uppercase tracking-widest text-xs font-bold">The Cultural Heart</span>
                            </div>
                            <h2 className="text-4xl font-serif mb-6">Ubud</h2>
                            <p className="text-forest/80 leading-relaxed mb-6 font-sans">
                                Misty jungles, ancient temples, and the artistic soul of the island. Ubud is for those seeking stillness, culture, and connection to nature. It is cooler, greener, and quieter than the south.
                            </p>
                            <ul className="space-y-2 text-sm opacity-70 font-sans mb-8">
                                <li>• <strong>Vibe:</strong> Spiritual, Artistic, Serene</li>
                                <li>• <strong>Best For:</strong> Yoga, Wellness, Privacy, Culture</li>
                                <li>• <strong>Key Areas:</strong> Sayan, Tegallalang, Penestanan</li>
                            </ul>
                            <Link href="/villas" className="text-xs uppercase tracking-widest font-bold border-b border-forest pb-1 hover:text-accent transition-colors">
                                See Ubud Villas
                            </Link>
                        </div>
                        <div className="order-1 md:order-2 h-[400px] rounded-full overflow-hidden border border-forest/10 relative group">
                            <img src="https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Ubud" />
                        </div>
                    </section>

                    {/* CANGGU */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="h-[400px] rounded-t-full rounded-b-3xl overflow-hidden border border-forest/10 relative group">
                            <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Canggu" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-forest/60">
                                <Coffee size={24} />
                                <span className="uppercase tracking-widest text-xs font-bold">The Social Hub</span>
                            </div>
                            <h2 className="text-4xl font-serif mb-6">Canggu</h2>
                            <p className="text-forest/80 leading-relaxed mb-6 font-sans">
                                The epicenter of modern Bali. Cafes, beach clubs, and surf breaks collide in a vibrant, fast-paced atmosphere. It's where digital nomads and trendsetters gather.
                            </p>
                            <ul className="space-y-2 text-sm opacity-70 font-sans mb-8">
                                <li>• <strong>Vibe:</strong> Trendy, Energetic, Social</li>
                                <li>• <strong>Best For:</strong> Nightlife, Surfing, remote Work</li>
                                <li>• <strong>Key Areas:</strong> Berawa, Batu Bolong, Pererenan</li>
                            </ul>
                        </div>
                    </section>

                    {/* ULUWATU */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="flex items-center gap-3 mb-4 text-forest/60">
                                <Waves size={24} />
                                <span className="uppercase tracking-widest text-xs font-bold">The Cliffside</span>
                            </div>
                            <h2 className="text-4xl font-serif mb-6">Uluwatu</h2>
                            <p className="text-forest/80 leading-relaxed mb-6 font-sans">
                                Dramatic limestone cliffs dropping into the Indian Ocean. Uluwatu offers the best sunsets, white sand beaches, and world-class surf. It feels vast, dry, and exclusive.
                            </p>
                            <ul className="space-y-2 text-sm opacity-70 font-sans mb-8">
                                <li>• <strong>Vibe:</strong> Dramatic, Laid-back, Exclusive</li>
                                <li>• <strong>Best For:</strong> Surfing, Sunsets, Luxury Resorts</li>
                                <li>• <strong>Key Areas:</strong> Bingin, Padang Padang, Ungasan</li>
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 h-[400px] rounded-3xl overflow-hidden border border-forest/10 relative group">
                            <img src="https://images.unsplash.com/photo-1515238501890-58db337996dc?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Uluwatu" />
                        </div>
                    </section>

                </div>

            </div>
        </main>
    );
}
