import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { mapDbToVilla } from '@/lib/utils'; // Assuming standard util exists or just direct data
// If mapDbToVilla is not available, we map manually.

export const metadata: Metadata = {
    title: 'Availability Calendar | StayinUBUD',
    description: 'Check availability for our luxury villas in Ubud. Plan your perfect escape.',
};

export const revalidate = 0; // Ensure fresh data on every request

export default async function AvailabilityPage() {
    // 1. Fetch Villas
    const { data: villasData } = await supabase
        .from('villas')
        .select('id, name'); // We only need id and name for the selector

    // 2. Fetch Bookings (Active only)
    const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .neq('status', 'cancelled'); // Don't show cancelled bookings

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-sand">
            {/* Header */}
            <div className="text-center mb-16">
                <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase opacity-60 text-forest mb-4">
                    Plan Your Stay
                </p>
                <h1 className="font-serif text-5xl md:text-7xl text-forest">
                    Availability
                </h1>
            </div>

            {/* Calendar Component */}
            <AvailabilityCalendar
                villas={villasData || []}
                bookings={bookingsData || []}
            />
        </main>
    );
}
