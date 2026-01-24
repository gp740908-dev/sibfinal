
import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { differenceInCalendarDays, format, addDays } from 'date-fns';
import { Calendar } from './Calendar';
import { MobileBookingDrawer } from './MobileBookingDrawer';
import { GuestFormModal, GuestFormData } from './GuestFormModal';
import { BookingSuccessModal } from './BookingSuccessModal';
import { ChevronDown, Loader2, Info } from 'lucide-react';
import { submitBookingRequest } from '../../app/actions/booking';

interface BookingWidgetProps {
  pricePerNight: number;
  villaName: string;
  villaId: string;
  blockedDates?: Date[];
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  pricePerNight,
  villaName,
  villaId,
  blockedDates = []
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guests, setGuests] = useState(2);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastBookingDetails, setLastBookingDetails] = useState<{
    villaName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: string;
  } | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nightCount = dateRange?.from && dateRange?.to
    ? differenceInCalendarDays(dateRange.to, dateRange.from)
    : 0;

  const subTotal = nightCount * pricePerNight;
  const serviceFee = subTotal * 0.10;
  const total = subTotal + serviceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleRequestClick = () => {
    if (!dateRange?.from || !dateRange?.to) {
      if (window.innerWidth < 768) {
        setIsMobileDrawerOpen(true);
      } else {
        setIsCalendarOpen(true);
      }
      return;
    }
    // Instead of booking immediately, open guest details form
    setIsGuestFormOpen(true);
    setIsMobileDrawerOpen(false); // Close mobile drawer if open
  };

  const handleFinalSubmit = async (guestData: GuestFormData) => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsSubmitting(true);

    try {
      const result = await submitBookingRequest(
        villaId,
        villaName,
        pricePerNight,
        dateRange.from,
        dateRange.to,
        guests,
        guestData // Pass the captured guest data
      );

      if (result.success && result.whatsappUrl) {
        // Store booking details for success modal
        setLastBookingDetails({
          villaName: villaName,
          guestName: guestData.fullName,
          checkIn: format(dateRange.from, 'dd MMM yyyy'),
          checkOut: format(dateRange.to, 'dd MMM yyyy'),
          totalPrice: formatPrice(total)
        });

        // Open WhatsApp in new tab
        window.open(result.whatsappUrl, '_blank');

        // Close form and show success modal
        setIsGuestFormOpen(false);
        setIsSuccessModalOpen(true);

        // Reset date selection for new booking
        setDateRange(undefined);
      } else {
        console.error("Booking Failed:", result.error);
        alert(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Connection failed. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* --- DESKTOP STICKY WIDGET --- */}
      <div id="booking-widget" className="hidden md:block sticky top-40 z-30" ref={calendarRef}>
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-forest/10 p-6 overflow-visible relative">

          {/* Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="font-serif text-2xl text-forest">{formatPrice(pricePerNight)}</span>
              <span className="text-sm text-gray-500 ml-1">/ night</span>
            </div>
          </div>

          {/* Input Interface */}
          <div className="border border-gray-300 rounded-xl mb-4 relative">
            {/* Dates Trigger */}
            <div
              className="grid grid-cols-2 border-b border-gray-300 cursor-pointer"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <div className="p-3 border-r border-gray-300 hover:bg-gray-50 rounded-tl-xl transition-colors">
                <div className="text-[10px] font-bold uppercase tracking-widest text-forest">Check-in</div>
                <div className="text-sm text-gray-700 truncate">
                  {dateRange?.from ? format(dateRange.from, 'dd/MM/yyyy') : 'Add date'}
                </div>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-tr-xl transition-colors">
                <div className="text-[10px] font-bold uppercase tracking-widest text-forest">Check-out</div>
                <div className="text-sm text-gray-700 truncate">
                  {dateRange?.to ? format(dateRange.to, 'dd/MM/yyyy') : 'Add date'}
                </div>
              </div>
            </div>

            {/* Guests Trigger */}
            <div className="p-3 hover:bg-gray-50 rounded-b-xl cursor-pointer transition-colors relative group">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-forest">Guests</div>
                  <div className="text-sm text-gray-700">{guests} guests</div>
                </div>
                <ChevronDown size={16} className="text-gray-400 group-hover:text-forest transition-colors" />
              </div>

              {/* Simple Guest Counter Popover */}
              <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} Guests</option>
                ))}
              </select>
            </div>

            {/* Calendar Popup */}
            {isCalendarOpen && (
              <div className="absolute top-[58px] right-0 z-50 bg-white rounded-xl shadow-2xl border border-forest/10 p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right min-w-[320px]">
                <Calendar
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabledDates={blockedDates}
                  numberOfMonths={1}
                />

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-forest"></div> Selected
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
                    <span className="line-through decoration-gray-400">12</span> Occupied
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="text-xs font-bold uppercase text-forest hover:bg-forest/10 px-4 py-2 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleRequestClick}
            className="w-full bg-forest text-white py-3.5 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-forest/90 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            Request to Book
          </button>

          {/* Price Breakdown */}
          {nightCount > 0 && (
            <div className="mt-6 space-y-3 pt-6 border-t border-dashed border-gray-200 text-sm animate-in slide-in-from-top-2">
              <div className="flex justify-between text-gray-600">
                <span className="underline decoration-gray-300">{formatPrice(pricePerNight)} x {nightCount} nights</span>
                <span>{formatPrice(subTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="underline decoration-gray-300">Service Fee</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-forest pt-3 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Info size={14} />
          <span>Prices in IDR. Free cancel within 48h.</span>
        </div>
      </div>

      {/* --- MOBILE FIXED BOTTOM BAR --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col">
            {nightCount > 0 ? (
              <span className="font-serif text-lg text-forest">{formatPrice(total)} <span className="text-xs font-sans text-gray-500">total</span></span>
            ) : (
              <span className="font-serif text-lg text-forest">{formatPrice(pricePerNight)} <span className="text-xs font-sans text-gray-500">/ night</span></span>
            )}
            <span className="text-xs text-gray-500 underline">
              {dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'dd MMM')} - ${format(dateRange.to, 'dd MMM')}` : 'Select dates'}
            </span>
          </div>

          <button
            onClick={handleRequestClick}
            className="bg-forest text-white px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest shadow-lg shadow-forest/20"
          >
            {nightCount > 0 ? 'Continue' : 'Check Dates'}
          </button>
        </div>
      </div>

      {/* --- MOBILE DRAWER COMPONENT --- */}
      <MobileBookingDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        pricePerNight={pricePerNight}
        blockedDates={blockedDates}
        dateRange={dateRange}
        setDateRange={setDateRange}
        guests={guests}
        setGuests={setGuests}
        onBook={handleRequestClick}
      />

      {/* --- GUEST FORM MODAL --- */}
      {dateRange?.from && dateRange?.to && (
        <GuestFormModal
          isOpen={isGuestFormOpen}
          onClose={() => setIsGuestFormOpen(false)}
          onSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          bookingSummary={{
            villaName: villaName,
            checkIn: dateRange.from,
            checkOut: dateRange.to,
            totalPrice: formatPrice(total),
            nights: nightCount,
            guests: guests
          }}
        />
      )}

      {/* --- SUCCESS MODAL --- */}
      {lastBookingDetails && (
        <BookingSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          bookingDetails={lastBookingDetails}
        />
      )}
    </>
  );
};
