import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';

interface JournalPostProps {
  slug: string;
  onNavigate: () => void;
  onPostClick?: (slug: string) => void;
}

export const JournalPost: React.FC<JournalPostProps> = ({ slug, onNavigate, onPostClick }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);

      // Fetch main post
      const { data, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setPost({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          imageUrl: data.image_url,
          publishedAt: data.published_at,
          slug: data.slug,
          author: data.author
        });

        // Fetch related posts (same category, different id)
        const { data: related } = await supabase
          .from('journal_posts')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);

        if (related) {
          setRelatedPosts(related.map(p => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            imageUrl: p.image_url,
            publishedAt: p.published_at,
            slug: p.slug,
            author: p.author
          })));
        }
      }

      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <Loader2 className="animate-spin text-forest-dark" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-serif text-forest-dark mb-4">Post Not Found</h1>
        <button
          onClick={() => onNavigate()}
          className="flex items-center gap-2 text-forest-dark hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} /> Back to Journal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen pt-32 pb-20 text-forest-dark">

      {/* Back Button */}
      <div className="px-6 md:px-12 max-w-4xl mx-auto mb-8">
        <button
          onClick={() => onNavigate()}
          className="flex items-center gap-2 text-forest-dark/60 hover:text-forest-dark text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Back to Journal
        </button>
      </div>

      {/* Hero Image */}
      <div className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="px-6 md:px-12 max-w-3xl mx-auto">

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-forest-dark/60 mb-6">
          <span className="bg-forest/10 px-3 py-1 rounded-full">{post.category}</span>
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>{post.publishedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={12} />
            <span>{post.author}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-dark leading-tight mb-8">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-forest-dark/80 font-serif italic leading-relaxed mb-12 border-l-2 border-forest/20 pl-6">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-lg prose-forest max-w-none">
          <div
            className="font-sans text-forest-dark/90 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        {/* Divider */}
        <div className="my-16 flex items-center justify-center">
          <div className="w-24 h-px bg-forest/20"></div>
        </div>

        {/* Author Info */}
        <div className="bg-white/40 border border-white/60 rounded-2xl p-8 mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center">
              <User size={24} className="text-forest-dark/60" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-forest-dark">{post.author}</h3>
              <p className="text-sm text-forest-dark/60">Contributing Writer</p>
            </div>
          </div>
          <p className="font-sans text-forest-dark/70 text-sm leading-relaxed">
            {post.author} is a passionate storyteller exploring the intersection of culture,
            wellness, and sustainable living in Bali.
          </p>
        </div>

      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-6 md:px-12 max-w-7xl mx-auto mt-24 pt-12 border-t border-forest/10">
          <h2 className="text-3xl font-serif text-forest-dark mb-12 text-center">
            More From <span className="italic">{post.category}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(related => (
              <div
                key={related.id}
                onClick={() => onPostClick?.(related.slug)}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4">
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-xl text-forest-dark group-hover:underline">
                  {related.title}
                </h3>
                <p className="text-sm text-forest-dark/60 mt-2">{related.publishedAt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
