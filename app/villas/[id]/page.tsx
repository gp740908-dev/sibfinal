
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { VillaDetail } from '@/components/villa/VillaDetail';
import { mapDbToVilla, getBlockedDates } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: villa } = await supabase.from('villas').select('name, description, image_url').eq('id', id).single();

  if (!villa) return { title: 'Villa Not Found' };

  return {
    title: villa.name,
    description: villa.description.substring(0, 160), // SEO optimal length
    openGraph: {
      title: `${villa.name} | Luxury Ubud Villa`,
      description: villa.description,
      images: [{ url: villa.image_url, width: 1200, height: 630, alt: villa.name }],
    },
  };
}

export default async function VillaPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch Data
  const { data: villaData, error: villaError } = await supabase
    .from('villas')
    .select('*')
    .eq('id', id)
    .single();

  if (villaError || !villaData) {
    notFound();
  }

  const villa = mapDbToVilla(villaData);

  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('villa_id', villa.id)
    .in('status', ['confirmed', 'pending']);

  const blockedDates = getBlockedDates(bookingsData || []);

  const { data: similarData } = await supabase
    .from('villas')
    .select('*')
    .neq('id', villa.id)
    .limit(3);

  const similarVillas = (similarData || []).map(mapDbToVilla);

  // 2. Construct VacationRental Schema (Google Rich Results)
  const villaSchema = {
    '@context': 'https://schema.org',
    '@type': ['VacationRental', 'Product'],
    name: villa.name,
    description: villa.description,
    image: villa.images && villa.images.length > 0 ? villa.images : [villa.imageUrl],
    brand: {
      '@type': 'Brand',
      name: 'StayinUBUD',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Raya Ubud No. 88',
      addressLocality: 'Ubud',
      addressRegion: 'Bali',
      postalCode: '80571',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: villa.latitude,
      longitude: villa.longitude,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: villa.pricePerNight,
      availability: 'https://schema.org/InStock',
      url: `https://stayinubud.com/villas/${villa.id}`,
    },
    amenityFeature: villa.features.map((feature) => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
      value: true,
    })),
    numberOfRooms: villa.bedrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      value: villa.guests,
      unitText: 'guests',
    },
  };

  return (
    <>
      <JsonLd data={villaSchema} />
      <VillaDetail
        villa={villa}
        blockedDates={blockedDates}
        allVillas={similarVillas}
      />
    </>
  );
}
