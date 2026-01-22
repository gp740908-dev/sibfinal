import { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'StayinUBUD | Luxury Villas & Private Pool Rentals in Ubud, Bali',
  description: 'Experience the ultimate Bali getaway. Luxury private pool villas in the heart of Ubud jungle. Personal concierge, yoga shalas, and authentic Balinese hospitality.',
  alternates: {
    canonical: 'https://stayinubud.com',
  },
};

export default function Home() {
  return <HomePage />;
}
