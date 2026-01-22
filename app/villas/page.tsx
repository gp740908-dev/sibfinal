import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { mapDbToVilla } from '@/lib/utils';
import { VillasPage } from '@/components/villas/VillasPage';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'Our Villas | Luxury Private Pool Villas in Ubud',
    description: 'Browse our collection of handpicked luxury villas in Ubud, Bali. Each villa features private pools, jungle views, and 24/7 concierge service.',
    alternates: {
        canonical: 'https://stayinubud.com/villas',
    },
    openGraph: {
        title: 'Our Villas | StayinUBUD',
        description: 'Discover our curated collection of luxury villas in Ubud, Bali.',
        url: 'https://stayinubud.com/villas',
    },
};

export default async function VillasPageRoute() {
    const { data } = await supabase.from('villas').select('*');
    const villas = (data || []).map(mapDbToVilla);

    const villasListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'StayinUBUD Luxury Villas',
        description: 'Collection of luxury private pool villas in Ubud, Bali',
        numberOfItems: villas.length,
        itemListElement: villas.map((villa, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'VacationRental',
                name: villa.name,
                description: villa.description,
                image: villa.imageUrl,
                url: `https://stayinubud.com/villas/${villa.id}`,
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'IDR',
                    price: villa.pricePerNight,
                },
            },
        })),
    };

    return (
        <>
            <JsonLd data={villasListSchema} />
            <VillasPage villas={villas} />
        </>
    );
}
