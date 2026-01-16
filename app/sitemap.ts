
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://stayinubud.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch Dynamic Data
  const { data: villas } = await supabase
    .from('villas')
    .select('id, created_at');

  const { data: posts } = await supabase
    .from('journal_posts')
    .select('slug, created_at');

  // 2. Build Villa Routes
  const villaRoutes = (villas || []).map((villa) => ({
    url: `${BASE_URL}/villas/${villa.id}`,
    lastModified: new Date(villa.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Build Blog Routes
  const blogRoutes = (posts || []).map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 4. Static Routes
  const staticRoutes = [
    '',
    '/villas',
    '/experiences',
    '/journal',
    '/about',
    '/faq',
    '/contact',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...villaRoutes, ...blogRoutes];
}
