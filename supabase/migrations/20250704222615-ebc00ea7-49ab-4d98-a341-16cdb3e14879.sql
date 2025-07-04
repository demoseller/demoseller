
-- Enable authenticated users to perform all CRUD operations on shipping_data table
CREATE POLICY "Authenticated users can view shipping data" 
  ON public.shipping_data 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert shipping data" 
  ON public.shipping_data 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shipping data" 
  ON public.shipping_data 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shipping data" 
  ON public.shipping_data 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Also allow public read access for the product page (unauthenticated users need to see shipping options)
CREATE POLICY "Public can view shipping data" 
  ON public.shipping_data 
  FOR SELECT 
  TO anon
  USING (true);
