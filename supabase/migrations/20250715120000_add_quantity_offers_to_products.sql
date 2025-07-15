-- Add quantity_offers column to products table
ALTER TABLE public.products
ADD COLUMN quantity_offers JSONB;

-- Add a comment to the column
COMMENT ON COLUMN public.products.quantity_offers IS 'Array of quantity-based price offers, e.g., [{"quantity": 2, "price": 190}, {"quantity": 3, "price": 250}]';