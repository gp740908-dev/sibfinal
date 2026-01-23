
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://stayinubud.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch Dynamic Data in parallel
  const [villasResult, postsResult, experiencesResult] = await Promise.all([
    supabase.from('villas').select('id, created_at'),
    supabase.from('journal_posts').select('slug, created_at'),
    supabase.from('experiences').select('id, created_at'),
  ]);

  const villas = villasResult.data || [];
  const posts = postsResult.data || [];
  const experiences = experiencesResult.data || [];

  // 2. Build Villa Routes (High Priority)
  const villaRoutes = villas.map((villa) => ({
    url: `${BASE_URL}/villas/${villa.id}`,
    lastModified: new Date(villa.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Build Blog Routes
  const blogRoutes = posts.map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 4. Static Routes with SEO Priority
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/villas', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/experiences', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/journal', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/bali-guide', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/bali-guide/legal-guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/bali-guide/neighborhoods', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/bali-guide/market-trends', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticRoutes, ...villaRoutes, ...blogRoutes];
}

