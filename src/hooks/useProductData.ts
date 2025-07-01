
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

export interface OrderData {
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  commune: string;
  full_address: string;
  product_name: string;
  size: string;
  color: string;
  total_price: number;
  status: 'pending' | 'confirmed';
}

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
