-- Create the store_settings table
CREATE TABLE public.store_settings (
    id smallint PRIMARY KEY DEFAULT 1,
    store_name TEXT,
    logo_url TEXT,
    hero_images TEXT[],
    social_media JSONB,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT pk_store_settings CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to store settings"
ON public.store_settings
FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admins) to update
CREATE POLICY "Allow admin update access to store settings"
ON public.store_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert a single row of default data
INSERT INTO public.store_settings (id, store_name, logo_url, hero_images, social_media, phone_number)
VALUES (
    1,
    'اسم المتجر',
    '/favicon.ico',
    ARRAY['/bg1.jpg', '/bg2.jpg', '/bg3.jpg', '/bg4.jpg'],
    '{"facebook": "https://facebook.com/your-page", "instagram": "https://www.instagram.com/abdrhmn.baat/", "telegram": "https://t.me/abdrhmn_baat"}',
    '+213667441637'
);