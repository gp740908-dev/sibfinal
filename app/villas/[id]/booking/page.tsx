import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BookingPage } from '@/components/booking/BookingPage';
import { mapDbToVilla, getBlockedDates } from '@/lib/utils';
import { Metadata } from 'next';

// ISR: Revalidate every hour
export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
    params: Promise<{ id: string }>;
}

// Dynamic Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { data: villa } = await supabase
        .from('villas')
        .select('name')
        .eq('id', id)
        .single();

    if (!villa) return { title: 'Villa Not Found' };

    return {
        title: `Book ${villa.name} | StayinUBUD`,
        description: `Complete your booking for ${villa.name}. Secure reservation with instant confirmation.`,
    };
}

export default async function BookingRoute({ params }: PageProps) {
    const { id } = await params;

    // Fetch villa data
    const { data: villaData, error: villaError } = await supabase
        .from('villas')
        .select('*')
        .eq('id', id)
        .single();

    if (villaError || !villaData) {
        notFound();
    }

    const villa = mapDbToVilla(villaData);

    // Fetch blocked dates
    const { data: bookingsData } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('villa_id', villa.id)
        .in('status', ['confirmed', 'pending']);

    const blockedDates = getBlockedDates(bookingsData || []);

    return (
        <BookingPage
            villa={villa}
            blockedDates={blockedDates}
        />
    );
}
