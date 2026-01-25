'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/booking/Calendar';
import { Villa, Booking } from '@/lib/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AvailabilityCalendarProps {
    villas: Villa[];
    bookings: Booking[];
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ villas, bookings }) => {
    const [selectedVillaId, setSelectedVillaId] = useState<string>(villas[0]?.id || '');

    // Filter bookings for the selected villa
    const villaBookings = bookings.filter(b =>
        b.villa_id === selectedVillaId &&
        (b.status === 'confirmed' || b.status === 'pending')
    );

    // Convert booking ranges to array of disabled dates
    const disabledDates: Date[] = [];
    villaBookings.forEach(booking => {
        let current = new Date(booking.start_date);
        const end = new Date(booking.end_date);

        while (current <= end) {
            disabledDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    });

    useGSAP(() => {
        gsap.fromTo('.calendar-container',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
    }, [selectedVillaId]);

    return (
        <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-white/50 rounded-3xl p-6 md:p-12 shadow-xl border border-white/60">

            {/* Villa Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {villas.map(villa => (
                    <button
                        key={villa.id}
                        onClick={() => setSelectedVillaId(villa.id)}
                        className={`px-6 py-2 rounded-full text-sm font-sans uppercase tracking-widest transition-all duration-300
                            ${selectedVillaId === villa.id
                                ? 'bg-forest text-sand shadow-lg scale-105'
                                : 'bg-white text-forest hover:bg-forest/10 border border-forest/10'
                            }
                        `}
                    >
                        {villa.name}
                    </button>
                ))}
            </div>

            {/* Calendar View */}
            <div className="calendar-container bg-white rounded-2xl shadow-sm border border-forest/5 overflow-hidden p-4 md:p-8">
                <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl text-forest">
                        {villas.find(v => v.id === selectedVillaId)?.name}
                    </h3>
                    <p className="text-forest/60 text-sm mt-2">
                        Select dates to start your booking or check availability below.
                    </p>
                </div>

                <Calendar
                    disabledDates={disabledDates}
                    numberOfMonths={1} // Keep it simple for mobile, maybe 2 for desktop via CSS media Query if Calendar supported it, but simpler is better
                    showLegend={true}
                />

                <div className="mt-8 flex justify-center">
                    <a
                        href={`/villas/${selectedVillaId}`}
                        className="btn-primary-lg px-8 py-3 bg-forest text-sand rounded-full uppercase tracking-widest text-xs hover:bg-forest/90 transition-colors"
                    >
                        Book {villas.find(v => v.id === selectedVillaId)?.name}
                    </a>
                </div>
            </div>

        </div>
    );
};
