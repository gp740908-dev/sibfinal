import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { JournalPostContent } from '@/components/journal/JournalPostContent';
import { JsonLd } from '@/components/seo/JsonLd';

// ISR: Revalidate daily for blog content
export const revalidate = 86400;

// Pre-generate journal pages at build time for SEO
export async function generateStaticParams() {
    const { data: posts } = await supabase.from('journal_posts').select('slug');
    return (posts || []).map((post) => ({ slug: post.slug }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabase
        .from('journal_posts')
        .select('title, excerpt, image_url, author, published_at')
        .eq('slug', slug)
        .single();

    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt,
        authors: [{ name: post.author }],
        alternates: {
            canonical: `https://stayinubud.com/journal/${slug}`,
        },
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.excerpt,
            url: `https://stayinubud.com/journal/${slug}`,
            publishedTime: post.published_at,
            authors: [post.author],
            images: [{ url: post.image_url, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image_url],
        },
    };
}

export default async function JournalPostPage({ params }: PageProps) {
    const { slug } = await params;

    const { data: post, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound();
    }

    // Fetch related posts
    const { data: relatedPosts } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('category', post.category)
        .neq('id', post.id)
        .limit(3);

    const blogPostSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image_url,
        datePublished: post.published_at,
        dateModified: post.created_at,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'StayinUBUD',
            logo: {
                '@type': 'ImageObject',
                url: 'https://stayinubud.com/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://stayinubud.com/journal/${slug}`,
        },
    };

    return (
        <>
            <JsonLd data={blogPostSchema} />
            <JournalPostContent post={post} relatedPosts={relatedPosts || []} />
        </>
    );
}
