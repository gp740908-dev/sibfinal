
import React from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disabledDates?: Date[];
  numberOfMonths?: number;
  showLegend?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  disabledDates = [],
  numberOfMonths = 1,
  showLegend = true
}) => {
  // Wrapper to safely handle the selection event
  const handleSelect = (range: DateRange | undefined) => {
    if (onSelect) {
      onSelect(range);
    }
  };

  const bookedCount = disabledDates.length;

  return (
    <div className="p-2 md:p-4 bg-white flex flex-col items-center w-full">
      <style>{`
        .rdp { 
          --rdp-cell-size: 44px;
          --rdp-accent-color: #243326; 
          --rdp-background-color: #D3D49F;
          margin: 0;
        }
        @media (max-width: 768px) {
          .rdp { --rdp-cell-size: 40px; }
        }
        
        /* Selected Range */
        .rdp-day_selected:not([disabled]) { 
          background-color: #243326;  
          color: white;
          font-weight: bold;
        }
        .rdp-day_selected:hover:not([disabled]) { 
          background-color: #243326;  
          opacity: 0.9;
        }
        
        /* Range Middle Days */
        .rdp-day_range_middle:not([disabled]) {
          background-color: rgba(36, 51, 38, 0.15);
          color: #243326;
        }
        
        /* Booked / Disabled State */
        .rdp-day_disabled { 
          position: relative;
          color: #ef4444 !important;
          background-color: #fef2f2 !important;
          cursor: not-allowed;
          opacity: 1;
        }
        .rdp-day_disabled::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 15%;
          right: 15%;
          height: 2px;
          background-color: #ef4444;
          transform: rotate(-45deg);
        }

        /* Today */
        .rdp-day_today:not(.rdp-day_selected):not(.rdp-day_disabled) {
          background-color: #fef3c7;
          color: #92400e;
          font-weight: bold;
        }

        /* Nav Buttons */
        .rdp-nav_button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          color: #243326;
        }
        .rdp-nav_button:hover {
          background-color: #e5e7eb;
        }
      `}</style>

      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={disabledDates}
        numberOfMonths={numberOfMonths}
        showOutsideDays={false}
        labels={{
          labelMonthDropdown: () => 'Select month',
          labelYearDropdown: () => 'Select year',
          labelNext: () => 'Go to next month',
          labelPrevious: () => 'Go to previous month',
        }}
        aria-label="Choose your check-in and check-out dates"
        components={{
          IconLeft: () => <ChevronLeft className="w-5 h-5" aria-hidden="true" />,
          IconRight: () => <ChevronRight className="w-5 h-5" aria-hidden="true" />
        }}
        classNames={{
          caption_label: "font-serif text-xl text-forest-dark font-medium",
          head_cell: "text-forest-dark/80 font-bold text-xs uppercase tracking-widest pb-4 pt-2",
          day: "text-lg font-sans text-forest-dark/90 data-[disabled]:text-text-subtle rounded-full hover:bg-sand/30 transition-colors",
          table: "w-full border-collapse",
        }}
      />

      {/* Legend */}
      {showLegend && (
        <div className="w-full mt-4 pt-4 border-t border-text-subtle/30">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs">
            {/* Available */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-forest-dark/30 bg-white flex items-center justify-center text-[10px] text-forest-dark/60">
                12
              </div>
              <span className="text-text-muted uppercase tracking-wider">Available</span>
            </div>

            {/* Selected */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-forest-dark flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </div>
              <span className="text-text-muted uppercase tracking-wider">Selected</span>
            </div>

            {/* Booked */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center relative overflow-hidden">
                <span className="text-[10px] text-red-400">12</span>
                <div className="absolute w-full h-0.5 bg-red-400 rotate-[-45deg]"></div>
              </div>
              <span className="text-text-muted uppercase tracking-wider">Booked</span>
            </div>

            {/* Today */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px] text-amber-700 font-bold">
                T
              </div>
              <span className="text-text-muted uppercase tracking-wider">Today</span>
            </div>
          </div>

          {/* Booking Status Info */}
          {bookedCount > 0 && (
            <p className="text-center text-xs text-text-subtle mt-3">
              <span className="text-red-500 font-semibold">{bookedCount}</span> dates unavailable this month
            </p>
          )}
        </div>
      )}
    </div>
  );
};
