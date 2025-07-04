
-- Add DELETE policy for orders table to allow authenticated users to delete orders
CREATE POLICY "Authenticated users can delete orders" ON public.orders
  FOR DELETE TO authenticated
  USING (true);
