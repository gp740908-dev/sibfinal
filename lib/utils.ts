
import { Villa } from '@/types';
import { eachDayOfInterval, parseISO } from 'date-fns';

export const scrollToBooking = () => {
  const element = document.getElementById('booking-widget');
  if (element) {
    const headerOffset = 120; // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
};

export const safeFloat = (val: any): number => {
  if (val === null || val === undefined) return NaN;
  const num = Number(val);
  return isFinite(num) ? num : NaN;
};

export const mapDbToVilla = (v: any): Villa => ({
  id: v.id,
  name: v.name,
  description: v.description,
  pricePerNight: v.price_per_night,
  bedrooms: v.bedrooms,
  guests: v.guests,
  imageUrl: v.image_url,
  images: v.images || [],
  features: v.features || [],
  land_area: v.land_area,
  building_area: v.building_area,
  levels: v.levels,
  bathrooms: v.bathrooms,
  pantry: v.pantry,
  pool_area: v.pool_area,
  latitude: safeFloat(v.latitude),
  longitude: safeFloat(v.longitude),
  amenities_detail: v.amenities_detail,
  house_rules: v.house_rules,
  proximity_list: v.proximity_list,
  sleeping_arrangements: v.sleeping_arrangements
});

export const getBlockedDates = (bookings: { start_date: string; end_date: string }[]): Date[] => {
  if (!bookings) return [];
  
  const allDates: Date[] = [];
  
  bookings.forEach(booking => {
    try {
      const interval = {
        start: parseISO(booking.start_date),
        end: parseISO(booking.end_date)
      };
      const days = eachDayOfInterval(interval);
      allDates.push(...days);
    } catch (e) {
      console.error("Error parsing dates", e);
    }
  });
  
  return allDates;
};
