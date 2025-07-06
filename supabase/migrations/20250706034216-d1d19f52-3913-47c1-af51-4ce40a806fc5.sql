
-- Allow public read access to product_types table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.product_types;
CREATE POLICY "Enable read access for all users" ON public.product_types
    FOR SELECT USING (true);

-- Allow public read access to products table  
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
CREATE POLICY "Enable read access for all users" ON public.products
    FOR SELECT USING (true);

-- Allow public read access to reviews table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reviews;
CREATE POLICY "Enable read access for all users" ON public.reviews
    FOR SELECT USING (true);

-- Allow public read access to shipping_data table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.shipping_data;
CREATE POLICY "Enable read access for all users" ON public.shipping_data
    FOR SELECT USING (true);
