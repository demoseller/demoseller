-- Drop the existing foreign key constraint
ALTER TABLE public.orders
DROP CONSTRAINT orders_product_id_fkey;

-- Add the foreign key constraint back with ON DELETE CASCADE
ALTER TABLE public.orders
ADD CONSTRAINT orders_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;