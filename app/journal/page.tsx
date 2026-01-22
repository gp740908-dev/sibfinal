import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Journal } from '@/components/journal/Journal';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'The Journal | Stories from Ubud, Bali',
    description: 'Discover Ubud through our curated stories. Travel guides, cultural insights, wellness tips, and hidden gems from the heart of Bali.',
    alternates: {
        canonical: 'https://stayinubud.com/journal',
    },
    openGraph: {
        title: 'The Journal | StayinUBUD',
        description: 'Stories from the heart of the jungle.',
        url: 'https://stayinubud.com/journal',
    },
};

export default async function JournalPageRoute() {
    const { data: posts } = await supabase
        .from('journal_posts')
        .select('*')
        .order('created_at', { ascending: false });

    const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'The StayinUBUD Journal',
        description: 'Stories, guides, and insights from Ubud, Bali',
        url: 'https://stayinubud.com/journal',
        publisher: {
            '@type': 'Organization',
            name: 'StayinUBUD',
            logo: 'https://stayinubud.com/logo.png',
        },
        blogPost: (posts || []).slice(0, 10).map((post: any) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.image_url,
            datePublished: post.published_at,
            author: {
                '@type': 'Person',
                name: post.author,
            },
            url: `https://stayinubud.com/journal/${post.slug}`,
        })),
    };

    return (
        <>
            <JsonLd data={blogSchema} />
            <Journal initialPosts={posts || []} />
        </>
    );
}
