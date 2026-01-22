
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Bali Property Ownership Guide: Legal & Regulations | StayinUBUD',
    description: 'A comprehensive guide to Indonesian property laws, leasehold vs freehold, and how foreigners can safely invest in Bali real estate.',
};

export default function LegalGuidePage() {
    return (
        <main className="min-h-screen bg-sand text-forest pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-3xl mx-auto">

                {/* Breadcrumb */}
                <Link href="/bali-guide" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8">
                    <ArrowLeft size={16} /> Back to Guide
                </Link>

                {/* Header */}
                <div className="mb-12 border-b border-forest/10 pb-12">
                    <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-4">Ownership & Regulations</span>
                    <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                        Navigating Indonesian <br /><span className="italic opacity-70">Property Law</span>
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-light leading-relaxed opacity-80">
                        Investing in paradise requires due diligence. Understand the structures that protect your investment.
                    </p>
                </div>

                {/* Content */}
                <article className="prose prose-forest text-forest/80 font-sans leading-relaxed">

                    <h2 className="text-2xl font-serif mt-12 mb-6">Can Foreigners Own Land in Bali?</h2>
                    <p className="mb-6">
                        The short answer is: <strong>Yes, but with specific titles.</strong> Indonesia has strict agrarian laws (Agrarian Law of 1960) that reserve <em>Hak Milik</em> (Freehold) exclusively for Indonesian citizens. However, foreigners have robust legal avenues to control and profit from land.
                    </p>

                    <div className="bg-forest/5 p-8 rounded-2xl my-8 border border-forest/10">
                        <h3 className="text-xl font-serif mb-4 flex items-center gap-3">
                            <FileText size={24} /> Key Titles for Foreigners
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <CheckCircle className="text-forest mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <strong className="block text-forest">Hak Sewa (Leasehold)</strong>
                                    <span className="text-sm opacity-80">
                                        The most common title for villas. You lease the land for a set period (usually 25-30 years) with a pre-agreed option to extend. It is fully legal, transferrable, and allows you to build.
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="text-forest mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <strong className="block text-forest">Hak Pakai (Right to Use)</strong>
                                    <span className="text-sm opacity-80">
                                        Specifically for residential use by foreign individuals domiciled in Indonesia (KITAS holders). Valid for an initial 30 years, extendable up to 80 years total.
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="text-forest mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <strong className="block text-forest">HGB (Right to Build)</strong>
                                    <span className="text-sm opacity-80">
                                        For foreign companies (PT PMA). The company holds the title, and you own the company. Ideal for commercial operations and larger developments.
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-serif mt-12 mb-6">The Nominee Structure Risk</h2>
                    <div className="border-l-4 border-red-800/50 pl-6 py-2 my-6 bg-red-50/50">
                        <h4 className="flex items-center gap-2 font-bold text-red-900 mb-2">
                            <AlertTriangle size={18} /> Warning
                        </h4>
                        <p className="text-sm mb-0">
                            Historically, foreigners used local "nominees" to hold Freehold titles on their behalf. This is <strong>illegal</strong> and void by law. The government actively investigates these arrangements. We strictly advise against nominee structures.
                        </p>
                    </div>

                    <h2 className="text-2xl font-serif mt-12 mb-6">Taxation & Compliance</h2>
                    <p className="mb-4">
                        When acquiring a leasehold, taxes are typically applied as follows:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-8">
                        <li><strong>Lease Tax (PPh Final):</strong> 10% on the lease value (usually paid by the Lessor, but market practice often shifts this to the Lessee or it's shared).</li>
                        <li><strong>Notary Fees:</strong> Typically 1% of the transaction value.</li>
                        <li><strong>Due Diligence:</strong> Always hire an independent legal counsel to verify land certificates, zoning (ITR), and access rights.</li>
                    </ul>

                    <p className="italic opacity-60 text-sm border-t border-forest/10 pt-6 mt-12">
                        Disclaimer: This guide is for informational purposes only and does not constitute legal advice. StayinUBUD recommends working with reputable notaries and legal firms.
                    </p>

                </article>

            </div>
        </main>
    );
}
