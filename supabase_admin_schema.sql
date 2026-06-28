-- SQL Schema Update for Admin Panel

-- 1. Create profiles table for user roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create an admin user for testing (make sure to create this user in Supabase Auth first, then update their role)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';

-- 2. Update places table (already exists, ensuring it has necessary fields, or just create it if not)
-- Note: 'places' table is already created in supabase_schema.sql. We will add RLS policies for admin.
CREATE POLICY "Admins can insert places" ON public.places FOR INSERT TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Admins can update places" ON public.places FOR UPDATE TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Admins can delete places" ON public.places FOR DELETE TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone." ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON public.cities FOR ALL TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own submissions" ON public.submissions FOR SELECT TO authenticated USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update submissions" ON public.submissions FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 6. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    cover_image TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, published
    author UUID REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are viewable by everyone." ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all articles" ON public.articles FOR SELECT TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 7. Create featured table
CREATE TABLE IF NOT EXISTS public.featured (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    active_from TIMESTAMP WITH TIME ZONE,
    active_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.featured ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Featured places are viewable by everyone." ON public.featured FOR SELECT USING (true);
CREATE POLICY "Admins can manage featured" ON public.featured FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 8. Create claims table
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    business_email TEXT,
    phone_number TEXT,
    documents TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own claims" ON public.claims FOR SELECT TO authenticated USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own claims" ON public.claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- 9. Create discovery_settings table
CREATE TABLE IF NOT EXISTS public.discovery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT,
    categories TEXT[],
    keywords TEXT[],
    center_lat DOUBLE PRECISION,
    center_lng DOUBLE PRECISION,
    radius_meters INTEGER NOT NULL DEFAULT 5000,
    min_rating DOUBLE PRECISION,
    min_reviews INTEGER,
    max_results INTEGER NOT NULL DEFAULT 20,
    schedule TEXT NOT NULL DEFAULT 'manual',
    auto_publish BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.discovery_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage discovery_settings" ON public.discovery_settings FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 10. Create discovery_jobs table
CREATE TABLE IF NOT EXISTS public.discovery_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settings_id UUID REFERENCES public.discovery_settings(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued',
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    found_count INTEGER DEFAULT 0,
    duplicate_count INTEGER DEFAULT 0,
    added_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.discovery_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage discovery_jobs" ON public.discovery_jobs FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 11. Create discovery_candidates table
CREATE TABLE IF NOT EXISTS public.discovery_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.discovery_jobs(id) ON DELETE CASCADE,
    source_place_id TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    hours JSONB,
    price_level INTEGER,
    google_rating DOUBLE PRECISION,
    google_review_count INTEGER,
    website TEXT,
    instagram TEXT,
    phone TEXT,
    photo_refs TEXT[],
    raw_source_json JSONB,
    ai_vibe_tags TEXT[],
    ai_purposes TEXT[],
    ai_wifi_rating INTEGER,
    ai_outlets TEXT,
    ai_description TEXT,
    confidence DOUBLE PRECISION,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.discovery_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage discovery_candidates" ON public.discovery_candidates FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 12. Create promotion_inquiries table
CREATE TABLE IF NOT EXISTS public.promotion_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    package TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.promotion_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert inquiries" ON public.promotion_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage inquiries" ON public.promotion_inquiries FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 13. Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert subscribers" ON public.subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage subscribers" ON public.subscribers FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 14. Create affiliate_products table
CREATE TABLE IF NOT EXISTS public.affiliate_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    image_url TEXT,
    price TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active affiliate_products" ON public.affiliate_products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can manage affiliate_products" ON public.affiliate_products FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Add monetization columns to existing tables (if they don't exist)
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS featured_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS featured_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;
