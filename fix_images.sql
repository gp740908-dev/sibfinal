-- Fix broken local image paths in journal_posts table
-- Replaces missing /images/journal/*.jpg with high-quality Unsplash images

-- 1. Interior Philosophy
UPDATE journal_posts 
SET image_url = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200' 
WHERE image_url LIKE '%interior-philosophy%';

-- 2. Investment Trends
UPDATE journal_posts 
SET image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200' 
WHERE image_url LIKE '%investment-trends%';

-- 3. Hidden Gems
UPDATE journal_posts 
SET image_url = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200' 
WHERE image_url LIKE '%hidden-gems%';

-- 4. Property Guide
UPDATE journal_posts 
SET image_url = 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200' 
WHERE image_url LIKE '%bali-property-guide%';

-- 5. Catch-all for any other local image paths
UPDATE journal_posts 
SET image_url = 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=1200' 
WHERE image_url LIKE '/images/%';
