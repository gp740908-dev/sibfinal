
import React from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disabledDates?: Date[];
  numberOfMonths?: number;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  selected, 
  onSelect, 
  disabledDates = [],
  numberOfMonths = 1
}) => {
  // Wrapper to safely handle the selection event
  const handleSelect = (range: DateRange | undefined) => {
    if (onSelect) {
      onSelect(range);
    }
  };

  return (
    <div className="p-2 md:p-4 bg-white flex justify-center w-full">
      <style>{`
        .rdp { 
          --rdp-cell-size: 44px; /* Larger touch targets */
          --rdp-accent-color: #537F5D; 
          --rdp-background-color: #D3D49F;
          margin: 0;
        }
        /* Mobile adjustment */
        @media (max-width: 768px) {
          .rdp { --rdp-cell-size: 40px; }
        }
        
        .rdp-day_selected:not([disabled]) { 
          background-color: #537F5D; 
          color: white;
          font-weight: bold;
        }
        .rdp-day_selected:hover:not([disabled]) { 
          background-color: #537F5D; 
          opacity: 0.9;
        }
        
        /* Booked / Disabled State - Strikethrough */
        .rdp-day_disabled { 
          text-decoration: line-through;
          color: #d1d5db; /* gray-300 */
          background-color: #f9fafb; /* gray-50 */
          cursor: not-allowed;
          opacity: 0.7;
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
          color: #537F5D;
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
        components={{
          IconLeft: () => <ChevronLeft className="w-5 h-5" />,
          IconRight: () => <ChevronRight className="w-5 h-5" />
        }}
        classNames={{
          caption_label: "font-serif text-xl text-forest font-medium",
          head_cell: "text-forest/80 font-bold text-xs uppercase tracking-widest pb-4 pt-2",
          day: "text-lg font-sans text-forest/90 data-[disabled]:text-gray-300 rounded-full hover:bg-sand/30 transition-colors",
          table: "w-full border-collapse",
        }}
      />
    </div>
  );
};
