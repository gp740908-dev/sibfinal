import { Metadata } from 'next';
import { Experiences } from '@/components/experiences/Experiences';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbsSchema } from '@/components/seo/BreadcrumbsSchema';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
    title: 'Curated Experiences | Bali Activities & Tours',
    description: 'Elevate your stay with bespoke Bali experiences. Private dining, holistic healing, sacred temple tours, and vintage Land Rover adventures.',
    alternates: {
        canonical: 'https://stayinubud.com/experiences',
    },
    openGraph: {
        title: 'Curated Experiences | StayinUBUD',
        description: 'Bespoke experiences to elevate your Bali stay.',
        url: 'https://stayinubud.com/experiences',
    },
};

export default async function ExperiencesPage() {
    const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: true });

    const experiencesSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'StayinUBUD Curated Experiences',
        description: 'Bespoke activities and tours in Ubud, Bali',
        itemListElement: (experiences || []).map((exp: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Service',
                name: exp.title,
                description: exp.description,
                image: exp.image_url,
                provider: {
                    '@type': 'Organization',
                    name: 'StayinUBUD',
                },
            },
        })),
    };

    return (
        <>
            <JsonLd data={experiencesSchema} />
            <BreadcrumbsSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'Experiences', url: '/experiences' }
                ]}
            />
            <Experiences initialExperiences={experiences || []} />
        </>
    );
}
