
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, TrendingUp, BarChart, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Bali Real Estate Market Trends 2024 | StayinUBUD',
    description: 'Data-driven insights into Bali’s property market. ROI analysis, occupancy rates, and future growth projections for investors.',
};

export default function MarketTrendsPage() {
    return (
        <main className="min-h-screen bg-sand text-forest pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">

                {/* Breadcrumb */}
                <Link href="/bali-guide" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8">
                    <ArrowLeft size={16} /> Back to Guide
                </Link>

                {/* Header */}
                <div className="mb-12 border-b border-forest/10 pb-12">
                    <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Market Intelligence</span>
                    <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                        Bali Market <br /> <span className="italic opacity-70">Outlook 2024</span>
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-light leading-relaxed opacity-80 max-w-2xl">
                        Beyond the hype: analyzing the numbers behind the island's property boom.
                    </p>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="p-8 bg-forest text-sand rounded-3xl">
                        <div className="mb-4 opacity-50"><TrendingUp size={24} /></div>
                        <div className="text-4xl font-serif mb-2">12-15%</div>
                        <div className="text-xs uppercase tracking-widest opacity-70">Avg. Villa ROI</div>
                    </div>
                    <div className="p-8 bg-sand border border-forest/10 rounded-3xl">
                        <div className="mb-4 opacity-50 text-forest"><BarChart size={24} /></div>
                        <div className="text-4xl font-serif mb-2 text-forest">78%</div>
                        <div className="text-xs uppercase tracking-widest text-forest/70">Avg. Occupancy (Ubud)</div>
                    </div>
                    <div className="p-8 bg-sand border border-forest/10 rounded-3xl">
                        <div className="mb-4 opacity-50 text-forest"><DollarSign size={24} /></div>
                        <div className="text-4xl font-serif mb-2 text-forest">+22%</div>
                        <div className="text-xs uppercase tracking-widest text-forest/70">Land Value Increase (YoY)</div>
                    </div>
                </div>

                {/* Analysis Content */}
                <article className="prose prose-forest text-forest/80 font-sans leading-relaxed">

                    <h2 className="text-2xl font-serif mt-12 mb-6">The Shift North</h2>
                    <p className="mb-6">
                        As Canggu and Seminyak reach saturation, investment capital is moving north and west. <strong>Ubud, Payangan, and Kedungu</strong> are seeing the highest growth rates in land value. Investors are seeking "Old Bali" experiences—views of rice terraces and jungle—which are becoming scarce in the south.
                    </p>

                    <h2 className="text-2xl font-serif mt-12 mb-6">Short-Term Rental Performance</h2>
                    <p className="mb-6">
                        Post-pandemic tourism has roared back. Daily rates (ADR) for luxury villas have increased by roughly 30% compared to 2019 levels. The demand is driven not just by holiday-makers but by "digital nomads" and "expats" staying for 1-3 months.
                    </p>
                    <div className="bg-[#EBEBC0] p-6 rounded-xl border border-forest/10">
                        <h4 className="font-bold text-forest mb-2">Investor Tip:</h4>
                        <p className="text-sm text-forest/80 mb-0">
                            Villas designed with dedicated workspaces and high-speed fiber optic internet command a 15-20% premium in daily rates.
                        </p>
                    </div>

                    <h2 className="text-2xl font-serif mt-12 mb-6">Construction Costs & Quality</h2>
                    <p className="mb-6">
                        Construction costs have risen globally, and Bali is no exception. Expect to pay between <strong>$800 - $1,200 USD per m²</strong> for high-quality, Western-standard finishing. We are seeing a trend towards sustainable materials—bamboo, recycled teak, and earth-conscious designs are not just ethical choices but marketing assets.
                    </p>

                </article>

            </div>
        </main>
    );
}
