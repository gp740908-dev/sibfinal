
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from './Calendar';
import { X, Minus, Plus, Users } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';

interface MobileBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pricePerNight: number;
  blockedDates?: Date[];
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  guests: number;
  setGuests: (n: number) => void;
  onBook: () => void;
}

export const MobileBookingDrawer: React.FC<MobileBookingDrawerProps> = ({
  isOpen,
  onClose,
  pricePerNight,
  blockedDates,
  dateRange,
  setDateRange,
  guests,
  setGuests,
  onBook
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const nightCount = dateRange?.from && dateRange?.to 
    ? differenceInCalendarDays(dateRange.to, dateRange.from) 
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`relative w-full bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-serif text-xl text-forest">Your Stay</h3>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-forest">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 w-full">
          
          {/* Calendar Section */}
          <div className="mb-6 w-full">
            <h4 className="text-xs font-bold uppercase tracking-widest text-forest mb-3 ml-2">Select Dates</h4>
            <div className="flex justify-center border border-gray-100 rounded-xl p-1 shadow-sm overflow-hidden bg-white">
              <Calendar 
                selected={dateRange} 
                onSelect={setDateRange} 
                disabledDates={blockedDates}
                numberOfMonths={1}
              />
            </div>
          </div>

          {/* Guests Section */}
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-forest mb-3 ml-2">Guests</h4>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest">
                  <Users size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-forest">Adults</span>
                  <span className="text-xs text-gray-500">Age 13+</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-forest hover:bg-gray-50 disabled:opacity-50"
                  disabled={guests <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="font-serif text-lg w-4 text-center">{guests}</span>
                <button 
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-forest hover:bg-gray-50"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4">
             <div className="text-sm text-forest/70">
                {nightCount > 0 ? (
                  <>
                    <span className="font-bold">{nightCount} nights</span> · {formatPrice(pricePerNight * nightCount)}
                  </>
                ) : (
                  "Add dates for prices"
                )}
             </div>
             {dateRange?.from && (
               <button 
                 onClick={() => setDateRange(undefined)}
                 className="text-xs text-forest underline"
               >
                 Clear Dates
               </button>
             )}
          </div>
          
          <button 
            onClick={onBook}
            disabled={!nightCount}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
              nightCount 
                ? 'bg-forest text-white shadow-lg shadow-forest/20' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {nightCount ? 'Request to Book' : 'Check Availability'}
          </button>
        </div>
      </div>
    </div>
  );
};
