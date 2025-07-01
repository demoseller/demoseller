
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  comment?: string;
  reviewer_name?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url?: string;
  images: string[];
  product_type_id: string;
  sizes?: string[];
  colors?: string[];
  options?: {
    sizes: Array<{ name: string; priceModifier: number }>;
    colors: Array<{ name: string; priceModifier: number }>;
  };
}

export interface OrderData {
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  commune: string;
  full_address: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  base_price: number;
  total_price: number;
  status: 'pending' | 'confirmed';
  product_type_id: string;
  image_url?: string;
}

export const useProductById = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    console.log('Fetching product with ID:', productId);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } else if (data) {
      console.log('Product data received:', data);
      
      // Safely parse the options field
      let parsedOptions = { sizes: [], colors: [] };
      if (data.options && typeof data.options === 'object' && data.options !== null) {
        const options = data.options as any;
        if (options.sizes && Array.isArray(options.sizes)) {
          parsedOptions.sizes = options.sizes;
        }
        if (options.colors && Array.isArray(options.colors)) {
          parsedOptions.colors = options.colors;
        }
      }

      // Transform the data to match our Product interface
      const transformedProduct: Product = {
        ...data,
        image_url: data.images?.[0] || null,
        sizes: parsedOptions.sizes?.map((s: any) => s.name) || [],
        colors: parsedOptions.colors?.map((c: any) => c.name) || [],
        options: parsedOptions
      };
      setProduct(transformedProduct);
    } else {
      console.log('No product found with ID:', productId);
      setProduct(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return { product, loading, refreshProduct: fetchProduct };
};

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      throw error;
    } else {
      await fetchReviews(); // Refresh reviews
      return data;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return { reviews, loading, addReview, refreshReviews: fetchReviews };
};

export const useOrders = () => {
  const addOrder = async (orderData: OrderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error adding order:', error);
      throw error;
    }

    return data;
  };

  return { addOrder };
};
