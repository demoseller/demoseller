-- supabase/migrations/20250718120000_add_facebook_pixel_id_to_store_settings.sql
ALTER TABLE public.store_settings
ADD COLUMN facebook_pixel_id TEXT;

COMMENT ON COLUMN public.store_settings.facebook_pixel_id IS 'Facebook Pixel ID for tracking purposes';