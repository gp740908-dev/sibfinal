
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { VillaDetail } from '@/components/villa/VillaDetail';
import { mapDbToVilla, getBlockedDates } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbsSchema } from '@/components/seo/BreadcrumbsSchema';
import { Metadata } from 'next';

// ISR: Revalidate every hour for fresh content while keeping speed
// Pages are rendered on first request, then cached for 1 hour
export const revalidate = 3600;

// Dynamic params: Allow any villa ID (rendered on-demand, then cached)
export const dynamicParams = true;

// 0. Static Params Generation (Pre-build popular paths)
export async function generateStaticParams() {
  const { data: villas } = await supabase
    .from('villas')
    .select('id')
    .limit(10); // Pre-build first 10 villas

  return (villas || []).map((villa) => ({
    id: villa.id,
  }));
}

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
  // Using single @type for clearer detection
  const villaSchema = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `https://stayinubud.com/villas/${villa.id}#vacation-rental`,
    name: villa.name,
    description: villa.description,
    url: `https://stayinubud.com/villas/${villa.id}`,
    image: villa.images && villa.images.length > 0 ? villa.images : [villa.imageUrl],
    priceRange: new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(villa.pricePerNight) + ' per night',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Raya Ubud',
      addressLocality: 'Ubud',
      addressRegion: 'Bali',
      postalCode: '80571',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: villa.latitude || -8.5069,
      longitude: villa.longitude || 115.2625,
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Private Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Fully Equipped Kitchen', value: true },
      ...(villa.features || []).map((feature) => ({
        '@type': 'LocationFeatureSpecification',
        name: feature,
        value: true,
      })),
    ],
    numberOfBedrooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms || 2,
    occupancy: {
      '@type': 'QuantitativeValue',
      value: villa.guests,
      unitText: 'guests',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: villa.building_area || 200,
      unitCode: 'MTK', // Square meters
    },
    checkinTime: '14:00',
    checkoutTime: '11:00',
    provider: {
      '@type': 'Organization',
      name: 'StayinUBUD',
      url: 'https://stayinubud.com',
    },
  };

  return (
    <>
      <JsonLd data={villaSchema} />
      <BreadcrumbsSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Our Villas', url: '/villas' },
          { name: villa.name, url: `/villas/${villa.id}` }
        ]}
      />
      <VillaDetail
        villa={villa}
        blockedDates={blockedDates}
        allVillas={similarVillas}
      />
    </>
  );
}
