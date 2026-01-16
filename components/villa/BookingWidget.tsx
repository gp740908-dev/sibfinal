import React, { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { differenceInCalendarDays, addDays, isSameDay } from 'date-fns';
import { Villa } from '../../types';
import { Calendar as CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import { getUnavailableDates, submitBookingRequest } from '../../app/actions/booking';

interface BookingWidgetProps {
  villa: Villa;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ villa }) => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [disabledDays, setDisabledDays] = useState<any[]>([]); // To store disabled ranges
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Availability on Mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAvailability() {
      setIsLoadingAvailability(true);
      const result = await getUnavailableDates(villa.id);
      
      if (isMounted && result.success && result.data) {
        // Disable past dates AND fetched booked dates
        setDisabledDays([
          { from: new Date(2000, 0, 1), to: addDays(new Date(), -1) }, // Block past
          ...result.data
        ]);
      }
      if (isMounted) setIsLoadingAvailability(false);
    }

    fetchAvailability();

    return () => { isMounted = false; };
  }, [villa.id]);

  // 2. Calculations
  const nightCount = range?.from && range?.to 
    ? differenceInCalendarDays(range.to, range.from) 
    : 0;
  
  const totalPrice = nightCount * villa.pricePerNight;
  const serviceFee = totalPrice * 0.10; // 10% Service Fee
  const grandTotal = totalPrice + serviceFee;

  // 3. Handle Booking Submission
  const handleBooking = async () => {
    if (!range?.from || !range?.to) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitBookingRequest(
        villa.id,
        villa.name,
        villa.pricePerNight,
        range.from,
        range.to,
        2, // Default guests (since this simplified widget has no guest picker)
        { 
          fullName: "Guest", 
          email: "", 
          whatsapp: "", 
          specialRequest: "" 
        }
      );

      if (!result.success) {
        setError(result.error || "An unexpected error occurred.");
        setIsSubmitting(false);
        return;
      }

      // Success UX
      // We don't turn off isSubmitting to keep the button state while redirecting
      setTimeout(() => {
        if (result.whatsappUrl) {
           window.open(result.whatsappUrl, '_blank');
        }
        // Optional: Redirect to Thank You page
        window.location.hash = '#thank-you'; // Or use onNavigate from props if available
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Failed to connect to booking server.");
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="sticky top-24 bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-xl z-30">
      <style>{`
        .rdp { --rdp-cell-size: 32px; --rdp-accent-color: #537F5D; --rdp-background-color: #D3D49F; margin: 0; }
        .rdp-day_selected:not([disabled]) { background-color: var(--rdp-accent-color); color: #D3D49F; font-weight: bold; }
        .rdp-day_selected:hover:not([disabled]) { background-color: var(--rdp-accent-color); opacity: 0.8; }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #D3D49F; color: #537F5D; }
        .rdp-caption_label { font-family: 'Playfair Display', serif; color: #537F5D; font-size: 1.1rem; }
        .rdp-head_cell { color: #537F5D; font-family: 'Manrope', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .rdp-day { color: #537F5D; font-family: 'Manrope', sans-serif; }
        .rdp-day_disabled { opacity: 0.25; pointer-events: none; }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b border-forest/10 pb-4">
        <div>
          <span className="block text-sm text-forest/60 font-sans uppercase tracking-widest mb-1">Price per night</span>
          <span className="text-2xl md:text-3xl font-serif text-forest">{formatPrice(villa.pricePerNight)}</span>
        </div>
        <div className="text-right">
             <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-forest bg-sand/50 px-2 py-1 rounded">
               <CalendarIcon size={12} />
               <span>Available</span>
             </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-6 flex justify-center bg-white/30 p-4 rounded-xl border border-white/40 min-h-[300px] items-center">
        {isLoadingAvailability ? (
          <div className="flex flex-col items-center gap-2 text-forest/60 animate-pulse">
            <Loader2 className="animate-spin" />
            <span className="text-xs uppercase tracking-widest">Checking Dates...</span>
          </div>
        ) : (
          <DayPicker
            mode="range"
            defaultMonth={new Date()}
            selected={range}
            onSelect={setRange}
            disabled={disabledDays}
            min={2}
          />
        )}
      </div>

      {/* Breakdown */}
      {nightCount > 0 && (
        <div className="space-y-3 mb-6 font-sans text-sm text-forest animate-fade-in">
          <div className="flex justify-between">
            <span className="opacity-70">{formatPrice(villa.pricePerNight)} x {nightCount} nights</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Service Fee (10%)</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <div className="border-t border-forest/10 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleBooking}
        disabled={!nightCount || isSubmitting || isLoadingAvailability}
        className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
          ${!nightCount || isSubmitting
            ? 'bg-forest/20 text-forest/50 cursor-not-allowed' 
            : 'bg-forest text-sand hover:bg-forest/90 shadow-lg hover:shadow-2xl hover:-translate-y-1'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>Processing...</span>
          </>
        ) : (
          'Request to Book'
        )}
      </button>

      <p className="text-center text-[10px] text-forest/50 mt-4 uppercase tracking-wider">
        You will be redirected to WhatsApp to finalize.
      </p>
    </div>
  );
};