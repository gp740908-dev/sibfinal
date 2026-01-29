'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { BlockRenderer } from './BlockRenderer';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    category: string;
    image_url: string;
    published_at: string;
    slug: string;
    author: string;
}

interface JournalPostContentProps {
    post: BlogPost;
    relatedPosts: BlogPost[];
}

const ParallaxHero = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center will-change-transform animate-slow-zoom"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-sand-light leading-none max-w-5xl drop-shadow-xl animate-reveal-up">
                    {title}
                </h1>
            </div>
        </div>
    );
};

export const JournalPostContent: React.FC<JournalPostContentProps> = ({ post, relatedPosts }) => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setProgress(Number(scroll));
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-sand min-h-screen pb-20 text-forest-dark relative">

            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-forest/10">
                <div
                    className="h-full bg-forest transition-all duration-100 ease-out"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Immersive Hero */}
            <ParallaxHero imageUrl={post.image_url} title={post.title} />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative flex flex-col md:flex-row gap-12 -mt-20 z-20">

                {/* Sticky Sidebar (Share/Nav) */}
                <aside className="hidden md:block w-48 shrink-0 relative">
                    <div className="sticky top-32 flex flex-col gap-6">
                        <Link href="/journal" className="w-12 h-12 rounded-full bg-sand-light shadow-lg flex items-center justify-center text-forest hover:bg-forest hover:text-sand-light transition-all border border-forest/10 group" aria-label="Back to Journal">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>

                        <div className="h-px w-8 bg-forest/20 my-2"></div>

                        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-forest-dark hover:text-accent hover:scale-110 transition-all border border-forest/5" aria-label="Share on Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-forest-dark hover:text-accent hover:scale-110 transition-all border border-forest/5" aria-label="Share on Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5S.2 5.3 4.1 2c-.3 2 .3 3.3.3 3.3 2.1-3.3 5.4-4.4 5.4-4.4 2.5.5 3.8 2 3.8 2 2.2-.2 3.2-1.2 3.2-1.2 1.2 1.3 1.1 2.5 1.1 2.5 1.3 0 2.5-.5 2.5-.5-1 .9-1.5 1.9-1.5 1.9z"></path></svg>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-forest-dark hover:text-accent hover:scale-110 transition-all border border-forest/5" aria-label="Copy Link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <article className="flex-1 bg-sand-light p-8 md:p-16 rounded-t-3xl shadow-xl min-h-[50vh]">

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-forest-dark/60 mb-12 border-b border-forest/10 pb-8">
                        <span className="bg-forest text-sand-light px-4 py-1.5 rounded-full font-bold">{post.category}</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{post.published_at}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{post.author}</span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-2xl md:text-3xl text-forest-dark font-serif italic leading-relaxed mb-16 opacity-90">
                        {post.excerpt}
                    </p>

                    {/* Content */}
                    <div className="mt-8">
                        <BlockRenderer content={post.content || ''} />
                    </div>

                    {/* Author Box */}
                    <div className="mt-20 p-8 bg-forest/5 rounded-2xl border border-forest/10 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-forest text-sand-light flex items-center justify-center text-2xl font-serif">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-serif text-xl text-forest-dark mb-1">Written by {post.author}</h3>
                            <p className="text-sm text-forest-dark/60 uppercase tracking-widest">Contributing Editor</p>
                        </div>
                    </div>

                </article>
            </div>

            {/* Next Article Liquid Transition (Replaces standard Grid) */}
            {relatedPosts.length > 0 && (
                <div className="relative w-full h-[70vh] overflow-hidden group cursor-pointer mt-0">
                    <Link href={`/journal/${relatedPosts[0].slug}`} className="block w-full h-full relative">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                            style={{ backgroundImage: `url(${relatedPosts[0].image_url})` }}
                        />
                        <div className="absolute inset-0 bg-forest/80 group-hover:bg-forest/70 transition-colors duration-500" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                            <span className="text-sand-light/60 text-xs uppercase tracking-[0.3em] mb-6 animate-pulse">Up Next</span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-sand-light max-w-4xl leading-none mb-8 group-hover:translate-y-[-10px] transition-transform duration-500">
                                {relatedPosts[0].title}
                            </h2>
                            <div className="flex items-center gap-4 text-sand-light border border-sand-light/30 px-8 py-3 rounded-full hover:bg-sand-light hover:text-forest transition-all">
                                <span className="uppercase tracking-widest text-sm font-bold">Read Story</span>
                                <ArrowLeft size={18} className="rotate-180" />
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Show other related posts nicely below if more than 1? Or just hide them for the 'clean' look?
                Awwwards style: usually one big next button. But let's keep it simple with just the big one for now.
             */}

        </div>
    );
};
