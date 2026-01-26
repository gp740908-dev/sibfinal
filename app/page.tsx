import { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';
import { supabase, isMock } from '@/lib/supabase';
import { mapDbToVilla } from '@/lib/utils';
import { MOCK_VILLAS } from '@/lib/mockData';
import { Villa } from '@/types';

// Cache for 1 hour to improve performance
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'StayinUBUD | Luxury Villas & Private Pool Rentals in Ubud, Bali',
  description: 'Experience the ultimate Bali getaway. Luxury private pool villas in the heart of Ubud jungle. Personal concierge, yoga shalas, and authentic Balinese hospitality.',
  alternates: {
    canonical: 'https://stayinubud.com',
  },
};

export default async function Home() {
  let villas: Villa[] = [];

  // Simulate fast data retrieval strategy
  if (isMock) {
    villas = MOCK_VILLAS;
  } else {
    try {
      const { data, error } = await supabase.from('villas').select('*');
      if (!error && data && data.length > 0) {
        villas = data.map(mapDbToVilla);
      } else {
        console.warn('Using mock data due to DB error or empty result');
        villas = MOCK_VILLAS;
      }
    } catch (e) {
      console.error('Failed to fetch villas', e);
      villas = MOCK_VILLAS;
    }
  }

  return <HomePage villas={villas} />;
}
