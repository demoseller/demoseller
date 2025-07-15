-- Drop the existing incorrect constraint if it was partially applied or exists from a failed run
ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS check_quantity_offers_format;

-- Create a function to validate the structure of quantity_offers JSONB
CREATE OR REPLACE FUNCTION public.is_valid_quantity_offers(offers jsonb)
RETURNS boolean AS $$
BEGIN
  -- Return true if the array is null or empty
  IF offers IS NULL OR jsonb_array_length(offers) = 0 THEN
    RETURN TRUE;
  END IF;

  -- Check if every element in the array is a valid offer object
  RETURN (
    SELECT bool_and(
      (offer->>'quantity')::numeric > 1 AND
      (offer->>'price')::numeric >= 0
    )
    FROM jsonb_array_elements(offers) AS offer
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add the new, correct constraint using the function
ALTER TABLE public.products
ADD CONSTRAINT check_quantity_offers_format CHECK (
  public.is_valid_quantity_offers(quantity_offers)
);