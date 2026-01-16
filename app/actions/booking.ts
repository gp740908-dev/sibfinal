
'use server';

import { supabase, isMock } from '../../lib/supabase';
import { differenceInCalendarDays, format, addDays } from 'date-fns';

interface GuestDetails {
  fullName: string;
  email: string;
  whatsapp: string;
  specialRequest?: string;
}

/**
 * Action A: Get unavailable dates for a specific villa
 */
export async function getUnavailableDates(villaId: string) {
  // MOCK MODE
  if (isMock) {
    const today = new Date();
    return { 
      success: true, 
      data: [
        { from: addDays(today, 5), to: addDays(today, 7) },
        { from: addDays(today, 12), to: addDays(today, 15) }
      ] 
    };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('villa_id', villaId)
      .in('status', ['confirmed', 'pending']);

    if (error) throw error;

    const blockedRanges = data.map((booking: any) => ({
      from: new Date(booking.start_date),
      to: new Date(booking.end_date),
    }));

    return { success: true, data: blockedRanges };
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    return { success: false, error: 'Failed to load availability.' };
  }
}

/**
 * Action C: Submit Booking Request
 */
export async function submitBookingRequest(
  villaId: string,
  villaName: string,
  pricePerNight: number,
  startDate: Date,
  endDate: Date,
  guests: number,
  guestDetails: GuestDetails
) {
  const nights = differenceInCalendarDays(endDate, startDate);
  const totalPrice = nights * pricePerNight;
  const grandTotal = totalPrice * 1.1; // +10% service
  
  const formattedStart = format(startDate, 'dd MMM yyyy');
  const formattedEnd = format(endDate, 'dd MMM yyyy');
  const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(grandTotal);

  // MOCK MODE
  if (isMock) {
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    const message = `*NEW BOOKING REQUEST*
    
🏡 *Villa:* ${villaName}
📅 *Dates:* ${formattedStart} - ${formattedEnd} (${nights} Nights)
👥 *Guests:* ${guests}
💰 *Total:* ${formattedTotal}

👤 *Guest:* ${guestDetails.fullName}
📧 *Email:* ${guestDetails.email}
📱 *Phone:* ${guestDetails.whatsapp}
${guestDetails.specialRequest ? `📝 *Note:* ${guestDetails.specialRequest}` : ''}

_Ref: MOCK-123_`;

    return { 
      success: true, 
      whatsappUrl: `https://wa.me/6281234567890?text=${encodeURIComponent(message)}` 
    };
  }

  try {
    // 1. Validation: Atomic Availability Check
    // We use .lt (less than) and .gt (greater than) to allow for same-day check-in/out
    // Logic: Conflict if (ExistingStart < RequestEnd) AND (ExistingEnd > RequestStart)
    const { data: conflicts, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('villa_id', villaId)
      .in('status', ['confirmed', 'pending'])
      .lt('start_date', endDate.toISOString())
      .gt('end_date', startDate.toISOString());

    if (conflictError) throw conflictError;

    if (conflicts && conflicts.length > 0) {
      return { success: false, error: 'Dates overlap with an existing booking.' };
    }

    if (nights < 1) return { success: false, error: 'Invalid range' };

    // 2. Insert Booking with Guest Details
    const payload = {
      villa_id: villaId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_price: grandTotal,
      status: 'pending',
      guest_name: guestDetails.fullName || '',
      guest_email: guestDetails.email || '',
      guest_whatsapp: guestDetails.whatsapp || '',
      special_request: guestDetails.specialRequest || ''
    };

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([payload])
      .select('id')
      .single();

    if (insertError) {
      console.error('Supabase Insert Detailed Error:', JSON.stringify(insertError, null, 2));
      throw insertError;
    }

    // 3. Construct WhatsApp Message
    const message = `*NEW BOOKING REQUEST*
    
🏡 *Villa:* ${villaName}
📅 *Dates:* ${formattedStart} - ${formattedEnd} (${nights} Nights)
👥 *Guests:* ${guests}
💰 *Total:* ${formattedTotal}

👤 *Guest:* ${guestDetails.fullName}
📧 *Email:* ${guestDetails.email}
📱 *Phone:* ${guestDetails.whatsapp}
${guestDetails.specialRequest ? `📝 *Note:* ${guestDetails.specialRequest}` : ''}

_Ref: ${booking.id.slice(0, 8)}_`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;

    return { success: true, whatsappUrl };

  } catch (error: any) {
    // Detailed error logging
    console.error('Booking Submission Exception:', error);
    
    // Check for common issues
    let errorMessage = 'Failed to process booking request.';
    if (error?.code === '42703') {
      errorMessage = 'Database configuration mismatch (Missing Columns). Please update database.';
    } else if (error?.code === '22P02') {
      errorMessage = 'Invalid data format (UUID/Type mismatch).';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}
