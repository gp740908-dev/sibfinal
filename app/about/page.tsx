import { Metadata } from 'next';
import { About } from '@/components/about/About';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbsSchema } from '@/components/seo/BreadcrumbsSchema';

export const metadata: Metadata = {
    title: 'Our Story | About StayinUBUD',
    description: 'Learn about StayinUBUD - a collection of curated luxury villas in Ubud, Bali. Our mission is to provide authentic Balinese hospitality in stunning jungle settings.',
    alternates: {
        canonical: 'https://stayinubud.com/about',
    },
    openGraph: {
        title: 'Our Story | StayinUBUD',
        description: 'The story behind StayinUBUD luxury villas.',
        url: 'https://stayinubud.com/about',
    },
};

export default function AboutPage() {
    const aboutSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About StayinUBUD',
        description: 'The story and mission of StayinUBUD luxury villa rentals in Ubud, Bali.',
        url: 'https://stayinubud.com/about',
        mainEntity: {
            '@type': 'Organization',
            name: 'StayinUBUD',
            description: 'Curated luxury villa rentals in Ubud, Bali',
            foundingLocation: {
                '@type': 'Place',
                name: 'Ubud, Bali, Indonesia',
            },
        },
    };

    return (
        <>
            <JsonLd data={aboutSchema} />
            <BreadcrumbsSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about' }
                ]}
            />
            <About />
        </>
    );
}

