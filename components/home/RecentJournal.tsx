'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { supabase, isMock } from '../../lib/supabase';
import { MOCK_JOURNAL_POSTS } from '../../lib/mockData';

// Luxury Easing
const LUXURY_EASE: any = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LUXURY_EASE }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const cardReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: LUXURY_EASE,
      delay: i * 0.15
    }
  })
};

// Fallback data
// Fallback data - Imported from mockData

export const RecentJournal: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      if (isMock) {
        setPosts(MOCK_JOURNAL_POSTS);
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
          setPosts(MOCK_JOURNAL_POSTS);
        }
      } catch (err) {
        console.warn("Error fetching recent journal, using fallback:", err);
        setPosts(MOCK_JOURNAL_POSTS);
      }
    }
    fetchRecent();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-sand text-forest-dark">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-forest/10 pb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <span className="block font-sans text-xs uppercase tracking-[0.2em] text-text-muted mb-2">The Magazine</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-none text-forest">
              STORIES FROM UBUD
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Link
              href="/journal"
              className="group flex items-center gap-2 text-sm uppercase tracking-widest font-bold mt-6 md:mt-0 hover:text-accent transition-colors"
            >
              Read All Stories
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Grid with Staggered Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              custom={index}
              variants={cardReveal}
            >
              <Link
                href={`/journal/${post.slug}`}
                className="group cursor-pointer flex flex-col gap-6"
              >
                {/* Image */}
                <motion.div
                  className="overflow-hidden aspect-[4/5] relative bg-forest/5"
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.5, ease: LUXURY_EASE }}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-forest-dark/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-sans uppercase tracking-[0.2em] text-forest-dark/60">
                    <span>{post.category}</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="font-serif text-2xl md:text-3xl text-forest-dark leading-tight group-hover:underline decoration-forest-dark/30 underline-offset-4 transition-all">
                    {post.title}
                  </h3>

                  <motion.p
                    className="font-sans text-text-muted text-sm leading-relaxed line-clamp-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {post.excerpt}
                  </motion.p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default RecentJournal;
