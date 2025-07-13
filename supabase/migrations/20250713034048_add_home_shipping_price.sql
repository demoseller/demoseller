-- Add the new column for home shipping price
ALTER TABLE public.shipping_data
ADD COLUMN shipping_home_price NUMERIC NOT NULL DEFAULT 0;

-- Set an initial value for existing rows based on the old logic
UPDATE public.shipping_data
SET shipping_home_price = base_price * 1.3;

-- Alter the default to be based on the base_price for new rows
-- Note: This is a bit advanced, a simple default of 0 is also fine.
-- For simplicity, we'll stick with the default 0 and let the app handle it.
-- You can manually update the values in your dashboard.