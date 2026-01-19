import React, { useState, useEffect } from 'react';
import { JournalCard } from './JournalCard';
import { BlogPost } from '../../types';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase, isMock } from '../../lib/supabase';

const CATEGORIES = ['All', 'Culture', 'Wellness', 'Food', 'Design', 'Travel'];

// Mock Data for Fallback
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Silence: Nyepi Day Explained',
    excerpt: 'Why the entire island of Bali shuts down for 24 hours, and how this ancient tradition restores the balance of nature and spirit.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a91?auto=format&fit=crop&q=80&w=1000',
    publishedAt: 'March 10, 2024',
    slug: 'art-of-silence-nyepi',
    author: 'Wayan Sudra',
    content: `<h2>The Sacred Silence</h2>
    <p>Nyepi, the Balinese Day of Silence, is perhaps one of the most unique celebrations in the world. On this day, the entire island of Bali—including the international airport—shuts down for 24 hours. No flights land or take off, no vehicles drive on the roads, and even tourists are required to stay inside their hotels.</p>
    
    <h2>The Four Prohibitions</h2>
    <p>The day is governed by four main restrictions called Catur Brata Penyepian:</p>
    <ul>
      <li><strong>Amati Geni</strong> - No fire or light (including no electricity)</li>
      <li><strong>Amati Karya</strong> - No working</li>
      <li><strong>Amati Lelungan</strong> - No traveling</li>
      <li><strong>Amati Lelanguan</strong> - No entertainment or pleasure</li>
    </ul>
    
    <p>The silence is so profound that you can hear the wind moving through the palm trees and the distant sound of the ocean. It is a day of meditation, reflection, and renewal.</p>
    
    <h2>Why It Matters</h2>
    <p>In our hyperconnected world, Nyepi offers something increasingly rare: complete disconnection. It is a reminder that sometimes, the most powerful thing we can do is nothing at all.</p>`
  },
  {
    id: '2',
    title: 'Hidden Waterfalls of Northern Ubud',
    excerpt: 'Venture beyond Tegenungan. We explore three secret cascades accessible only by footpaths known to locals.',
    category: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1596395818822-7f94d35eb7a4?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'February 28, 2024',
    slug: 'hidden-waterfalls',
    author: 'Sarah Jenkins',
    content: `<h2>Beyond the Tourist Trail</h2>
    <p>While Tegenungan Waterfall draws crowds daily, Northern Ubud hides gems known only to locals and adventurous travelers willing to trek off the beaten path.</p>
    
    <h2>1. Tukad Cepung Waterfall</h2>
    <p>Hidden inside a cave, sunlight streams through the opening above, creating ethereal light beams. The trek involves descending into a canyon—wear good shoes.</p>
    
    <h2>2. Kanto Lampo Waterfall</h2>
    <p>A terraced waterfall perfect for photography. Visit early morning to avoid crowds and catch golden hour light.</p>
    
    <h2>3. Goa Rang Reng</h2>
    <p>The most secret of all. Requires a local guide to find. Worth every step.</p>`
  },
  {
    id: '3',
    title: 'Farm to Table: The Organic Revolution',
    excerpt: 'Meet the chefs transforming Ubud culinary scene by returning to the roots of traditional Balinese permaculture.',
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1596919014169-2f588a800880?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'February 15, 2024',
    slug: 'organic-revolution',
    author: 'Chef Made',
    content: `<h2>The Movement</h2>
    <p>Ubud restaurants are leading a quiet revolution: returning to traditional Balinese farming methods that predate modern agriculture by centuries.</p>
    
    <h2>Permaculture Principles</h2>
    <p>Balinese farmers have practiced sustainable agriculture for over a thousand years. The subak irrigation system, recognized by UNESCO, distributes water fairly while maintaining biodiversity.</p>
    
    <h2>Where to Eat</h2>
    <p>Restaurants like Locavore, Moksa, and Alchemy are sourcing 90% of ingredients within 50km. The result? Dishes that taste like Bali itself.</p>`
  },
  {
    id: '4',
    title: 'Architectural Harmony: Building with Bamboo',
    excerpt: 'How sustainable architecture is redefining luxury living without compromising the surrounding jungle ecosystem.',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1533038676602-5e6f53a47942?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'January 20, 2024',
    slug: 'building-with-bamboo',
    author: 'Elena Rossi',
    content: `<h2>Bamboo: The Steel of the 21st Century</h2>
    <p>Bamboo grows 3 feet per day. It sequesters carbon faster than trees. And in the hands of Bali master builders, it becomes architecture that breathes.</p>
    
    <h2>Structural Innovation</h2>
    <p>Modern engineering has unlocked bamboo potential. When treated properly, it is stronger than concrete and more flexible than steel—perfect for earthquake-prone Bali.</p>
    
    <h2>Living Architecture</h2>
    <p>The best bamboo structures feel alive. They creak gently in the wind, age gracefully, and blend seamlessly into the jungle canopy.</p>`
  },
  {
    id: '5',
    title: 'Morning Rituals: A Guide to Balinese Offerings',
    excerpt: 'The Canang Sari is more than just flowers on the street. It is a daily gesture of gratitude found everywhere in Bali.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1516212176463-e5927515d90e?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'January 05, 2024',
    slug: 'balinese-offerings',
    author: 'Wayan Sudra',
    content: `<h2>The Daily Offering</h2>
    <p>Before sunrise, Balinese women weave palm leaves into small baskets called canang sari. Inside: flowers, rice, incense, and sometimes a sweet or cigarette.</p>
    
    <h2>Symbolism</h2>
    <p>Each color represents a Hindu deity and cardinal direction. The act of giving matters more than what is given—it is about maintaining cosmic balance.</p>
    
    <h2>Where You Will See Them</h2>
    <p>Everywhere. On doorsteps, in temples, on car dashboards, even on sidewalks. Watch your step—stepping on one accidentally is forgiven, but try to walk around them.</p>`
  },
  {
    id: '6',
    title: 'Sound Healing: Vibrations of the Soul',
    excerpt: 'Exploring the Pyramids of Chi and the rising trend of sound therapy in the wellness capital of Asia.',
    category: 'Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1603102371900-514757c2c96b?auto=format&fit=crop&q=80&w=800',
    publishedAt: 'December 12, 2023',
    slug: 'sound-healing',
    author: 'Dr. Anika Sharma',
    content: `<h2>The Science of Sound</h2>
    <p>Sound healing is not mystical—it is physics. Different frequencies affect brainwave patterns, shifting us from beta (stress) to alpha (calm) and theta (meditation).</p>
    
    <h2>The Pyramids of Chi</h2>
    <p>Ubud most unique venue. Seven copper pyramids create acoustic resonance. Lie on the floor as gongs, singing bowls, and didgeridoos wash over you.</p>
    
    <h2>What to Expect</h2>
    <p>Physical sensations: tingling, warmth, even tears. Sound bypasses the logical brain and speaks directly to the nervous system. Leave your skepticism at the door.</p>`
  }
];

// Helper to map DB response
const mapDbToPost = (p: any): BlogPost => ({
  id: p.id,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  imageUrl: p.image_url,
  publishedAt: p.published_at,
  slug: p.slug,
  author: p.author
});

interface JournalProps {
  onNavigate?: (view: 'home' | 'journal') => void;
  onPostClick?: (slug: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ onNavigate, onPostClick }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch Data from Supabase
  useEffect(() => {
    async function fetchPosts() {
      if (isMock) {
        setPosts(MOCK_POSTS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('journal_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setPosts(data.map(mapDbToPost));
        } else {
           console.log('Journal empty. Seeding...');
           const seedData = MOCK_POSTS.map(({id, ...p}) => ({
             title: p.title,
             excerpt: p.excerpt,
             content: p.content,
             category: p.category,
             image_url: p.imageUrl,
             published_at: p.publishedAt,
             slug: p.slug,
             author: p.author
           }));
           
           const { error: seedError } = await supabase.from('journal_posts').insert(seedData);
           if (!seedError) {
             const { data: newData } = await supabase.from('journal_posts').select('*').order('created_at', { ascending: false });
             if (newData) setPosts(newData.map(mapDbToPost));
           } else {
             setPosts(MOCK_POSTS);
           }
        }
      } catch (err) {
        console.error("Error loading journal, using fallback:", err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setSubscribing(true);
    
    if (isMock) {
        setTimeout(() => {
            setSubscribeStatus('success');
            setEmail('');
            setSubscribing(false);
        }, 1000);
        return;
    }

    try {
      const { error } = await supabase.from('subscribers').insert([{ email }]);
      if (error) {
        if (error.code === '23505') {
           setSubscribeStatus('success');
        } else {
           setSubscribeStatus('error');
        }
      } else {
        setSubscribeStatus('success');
        setEmail('');
      }
    } catch (e) {
      setSubscribeStatus('error');
    } finally {
      setSubscribing(false);
    }
  };

  const handlePostClick = (slug: string) => {
    if (onPostClick) {
      onPostClick(slug);
    }
  };

  // Filter Logic
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  // Split Featured vs Grid
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  if (loading) {
    return <div className="min-h-screen bg-sand flex items-center justify-center text-forest"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="pt-24 pb-0 min-h-screen bg-sand">
      
      {/* 1. Page Header */}
      <div className="px-6 md:px-12 py-12 md:py-20 text-center max-w-4xl mx-auto">
        <span className="block font-serif italic text-forest/70 text-lg md:text-xl mb-4">
          Stories from the heart of the jungle.
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-forest tracking-widest mb-12">
          THE JOURNAL
        </h1>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 border-t border-b border-forest/10 py-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 relative
                ${activeCategory === cat ? 'text-forest font-bold' : 'text-forest/50 hover:text-forest'}
              `}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute -bottom-2 left-0 w-full h-px bg-forest animate-fade-in" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Featured Story */}
      {featuredPost && (
        <section className="px-6 md:px-12 mb-24 max-w-7xl mx-auto">
          <div 
            className="group grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center cursor-pointer"
            onClick={() => handlePostClick(featuredPost.slug)}
          >
            
            {/* Left: Image (60%) */}
            <div className="lg:col-span-3 overflow-hidden aspect-video relative">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Right: Text (40%) */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 text-xs font-sans uppercase tracking-widest text-forest/60">
                 <span>Featured Story</span>
                 <span className="w-8 h-px bg-forest/30"></span>
                 <span>{featuredPost.category}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif text-forest leading-tight mb-6 group-hover:underline decoration-forest/30 underline-offset-8 transition-all">
                {featuredPost.title}
              </h2>
              
              <p className="text-forest/70 font-sans text-base md:text-lg leading-relaxed mb-8">
                {featuredPost.excerpt}
              </p>
              
              <button className="flex items-center gap-2 text-forest text-xs uppercase tracking-widest font-bold group-hover:gap-4 transition-all">
                Read Story <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. The Article Grid */}
      <section className="px-6 md:px-12 mb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {gridPosts.map(post => (
            <JournalCard 
              key={post.id} 
              post={post}
              onClick={handlePostClick}
            />
          ))}
        </div>
        
        {gridPosts.length === 0 && !featuredPost && (
            <div className="text-center py-20 text-forest/50 font-serif italic">
                No stories found in this category.
            </div>
        )}
      </section>

      {/* 4. Newsletter Signup */}
      <section className="bg-forest text-sand py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#D3D49F 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="max-w-xl mx-auto text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-serif mb-4">Join the Inner Circle</h3>
          <p className="font-sans text-sand/70 mb-10 text-sm md:text-base tracking-wide">
            Receive curated travel guides, hidden gem alerts, and exclusive villa offers directly to your inbox.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address" 
              className="flex-1 bg-transparent border-b border-sand/30 py-3 px-2 text-sand placeholder-sand/30 focus:outline-none focus:border-sand transition-colors font-sans text-sm"
              disabled={subscribing || subscribeStatus === 'success'}
            />
            <button 
              onClick={handleSubscribe}
              disabled={subscribing || subscribeStatus === 'success'}
              className="bg-sand text-forest px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors disabled:opacity-70"
            >
              {subscribing ? 'Joining...' : subscribeStatus === 'success' ? 'Joined' : 'Subscribe'}
            </button>
          </div>
          {subscribeStatus === 'success' && <p className="text-accent-light text-xs mt-4">Welcome to the family.</p>}
          {subscribeStatus === 'error' && <p className="text-red-400 text-xs mt-4">Something went wrong. Please try again.</p>}
        </div>
      </section>

    </div>
  );
};
