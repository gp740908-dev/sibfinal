'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { supabase, isMock } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// Fallback data to ensure section visibility
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Silence: Nyepi Day Explained',
    excerpt: 'Why the entire island of Bali shuts down for 24 hours, and how this ancient tradition restores the balance of nature and spirit.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a91?auto=format&fit=crop&q=80&w=1000',
    publishedAt: 'March 10, 2024',
    slug: 'art-of-silence-nyepi',
    author: 'Wayan Sudra'
  },
  {
    id: '2',
    title: 'Hidden Waterfalls of Northern Ubud',
    excerpt: 'Venture beyond Tegenungan. We explore three secret cascades accessible only by footpaths known to locals.',
    category: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1596395818822-7f94d35eb7a4?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'February 28, 2024',
    slug: 'hidden-waterfalls',
    author: 'Sarah Jenkins'
  },
  {
    id: '3',
    title: 'Farm to Table: The Organic Revolution',
    excerpt: 'Meet the chefs transforming Ubud\'s culinary scene by returning to the roots of traditional Balinese permaculture.',
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1596919014169-2f588a800880?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'February 15, 2024',
    slug: 'organic-revolution',
    author: 'Chef Made'
  }
];

export const RecentJournal: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      if (isMock) {
        setPosts(MOCK_POSTS);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('journal_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted: BlogPost[] = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            imageUrl: p.image_url,
            publishedAt: p.published_at,
            slug: p.slug,
            author: p.author
          }));
          setPosts(formatted);
        } else {
          setPosts(MOCK_POSTS);
        }
      } catch (err) {
        console.warn("Error fetching recent journal, using fallback:", err);
        setPosts(MOCK_POSTS);
      }
    }
    fetchRecent();
  }, []);

  useGSAP(() => {
    if (posts.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from('.journal-header', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    tl.from('.journal-card', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    }, "-=0.4");

  }, { scope: sectionRef, dependencies: [posts] });

  if (posts.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-sand text-forest">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="journal-header flex flex-col md:flex-row justify-between items-end mb-16 border-b border-forest/10 pb-6">
          <div>
            <span className="block font-sans text-xs uppercase tracking-[0.2em] opacity-60 mb-2">The Magazine</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-none">
              STORIES FROM UBUD
            </h2>
          </div>
          <Link
            href="/journal"
            className="group flex items-center gap-2 text-sm uppercase tracking-widest font-bold mt-6 md:mt-0 hover:text-accent transition-colors"
          >
            Read All Stories
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="journal-card group cursor-pointer flex flex-col gap-6"
            >
              {/* Image */}
              <div className="overflow-hidden aspect-[4/5] relative bg-forest/5">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-95"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-sans uppercase tracking-[0.2em] text-forest/60">
                  <span>{post.category}</span>
                  <span>{post.publishedAt}</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-forest leading-tight group-hover:underline decoration-forest/30 underline-offset-4 transition-all">
                  {post.title}
                </h3>

                <p className="font-sans text-forest/70 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
