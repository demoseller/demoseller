-- Add detailed description column to products table
ALTER TABLE public.products
ADD COLUMN detailed_description TEXT;

-- Add a comment to the column
COMMENT ON COLUMN public.products.detailed_description IS 'Detailed product description to be displayed on the product page';
