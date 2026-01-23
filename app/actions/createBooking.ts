
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

const bookingSchema = z.object({
  villa_id: z.string().min(1, "Villa ID is required"),
  villa_name: z.string().min(1, "Villa Name is required"),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  total_price: z.number().positive("Price must be positive"),
  guest_name: z.string().min(2, "Name must be at least 2 characters"),
  guest_email: z.string().email("Invalid email address"),
  guest_whatsapp: z.string().min(8, "Phone number is too short"),
  special_request: z.string().optional().default('')
});

export type CreateBookingInput = z.infer<typeof bookingSchema>;

export async function createBooking(input: CreateBookingInput) {
  try {
    // 1. Validation
    const result = bookingSchema.safeParse(input);

    if (!result.success) {
      const errorMessage = result.error.errors.map(e => e.message).join(', ');
      console.error("Validation Error:", errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = result.data;

    // 2. Insert into Supabase
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([{
        villa_id: data.villa_id,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        total_price: data.total_price,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        guest_whatsapp: data.guest_whatsapp,
        special_request: data.special_request,
        status: 'pending'
      }])
      .select('id')
      .single();

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return { success: false, error: 'Failed to create booking record.' };
    }

    // 3. Construct WhatsApp URL
    const formattedStart = format(data.start_date, 'dd MMM yyyy');
    const formattedEnd = format(data.end_date, 'dd MMM yyyy');
    const refId = booking.id.slice(0, 8).toUpperCase();
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.total_price);

    const message = `Hello StayinUBUD, my name is ${data.guest_name}.
I would like to confirm my booking for:

🏡 *${data.villa_name}*
📅 Dates: ${formattedStart} - ${formattedEnd}
💰 Total: ${formattedPrice}
📝 Ref: ${refId}

${data.special_request ? `Special Request: ${data.special_request}` : ''}

Please confirm availability.`;

    const targetNumber = '6282269128232';
    const redirectUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

    return { success: true, redirectUrl };

  } catch (err: any) {
    console.error('Unexpected Booking Error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
