'use client';

import React from 'react';
import Link from 'next/link';
import { Villa } from '../../types';
import { BookingWizard } from './BookingWizard';
import { Breadcrumb } from '../ui/Breadcrumb';
import { ArrowLeft, MapPin, Users, Bed, Bath, Star } from 'lucide-react';

interface BookingPageProps {
    villa: Villa;
    blockedDates?: Date[];
}

export const BookingPage: React.FC<BookingPageProps> = ({
    villa,
    blockedDates = []
}) => {
    // Format price consistently (no locale issues)
    const formatPrice = (price: number) => {
        return `Rp ${Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    return (
        <div className="min-h-screen bg-sand pt-32">
            {/* Header */}
            <header className="bg-white border-b border-forest/10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/villas/${villa.id}`}
                            className="flex items-center gap-2 text-forest-dark hover:text-forest transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Villa</span>
                        </Link>
                        <Breadcrumb
                            items={[
                                { label: 'Home', href: '/' },
                                { label: 'Villas', href: '/villas' },
                                { label: villa.name, href: `/villas/${villa.id}` },
                                { label: 'Booking' }
                            ]}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* LEFT: Villa Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-forest/10 overflow-hidden sticky top-24">
                            {/* Villa Image */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={villa.images?.[0] || villa.imageUrl}
                                    alt={villa.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h1 className="text-xl font-serif text-white drop-shadow-lg">{villa.name}</h1>
                                    <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                                        <MapPin size={12} />
                                        <span>Ubud, Bali</span>
                                    </div>
                                </div>
                            </div>

                            {/* Villa Quick Info */}
                            <div className="p-5">
                                {/* Price */}
                                <div className="mb-4 pb-4 border-b border-forest/10">
                                    <span className="text-2xl font-serif text-forest-dark">{formatPrice(villa.pricePerNight)}</span>
                                    <span className="text-sm text-text-muted ml-1">/ night</span>
                                </div>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <Users size={18} className="text-forest" />
                                        <span className="text-xs text-text-muted">{villa.guests} Guests</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Bed size={18} className="text-forest" />
                                        <span className="text-xs text-text-muted">{villa.bedrooms} Beds</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Bath size={18} className="text-forest" />
                                        <span className="text-xs text-text-muted">{villa.bathrooms || 2} Baths</span>
                                    </div>
                                </div>

                                {/* Features Preview */}
                                <div className="flex flex-wrap gap-2">
                                    {(villa.features || []).slice(0, 4).map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className="text-[10px] uppercase tracking-wider bg-sand/50 text-forest-dark px-2 py-1 rounded"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Booking Wizard */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-forest/10">
                            {/* Wizard Header */}
                            <div className="p-6 border-b border-forest/10 bg-sand/20">
                                <h2 className="text-2xl font-serif text-forest-dark">Complete Your Booking</h2>
                                <p className="text-sm text-text-muted mt-1">
                                    Secure your stay at {villa.name}. Free cancellation within 48 hours.
                                </p>
                            </div>

                            {/* Booking Wizard (Full Page Mode) */}
                            <BookingWizard
                                pricePerNight={villa.pricePerNight}
                                villaName={villa.name}
                                villaId={villa.id}
                                blockedDates={blockedDates}
                                maxGuests={villa.house_rules?.max_guests || villa.guests || 8}
                                fullPage
                            />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
