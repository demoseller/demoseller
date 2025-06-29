
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Order {
  id: string;
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
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  images: string[];
  product_type_id: string;
  options: {
    sizes: Array<{ name: string; priceModifier: number }>;
    colors: Array<{ name: string; priceModifier: number }>;
  };
}

export interface ProductType {
  id: string;
  name: string;
  image_url: string;
  productCount?: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      // Transform the data to match our Order interface
      const transformedOrders: Order[] = (data || []).map(order => ({
        ...order,
        status: (order.status as 'pending' | 'confirmed') || 'pending'
      }));
      setOrders(transformedOrders);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'confirmed') => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order:', error);
    } else {
      await fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, updateOrderStatus, refreshOrders: fetchOrders };
};

export const useProductTypes = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductTypes = async () => {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching product types:', error);
    } else {
      // Get product count for each type
      const typesWithCount = await Promise.all((data || []).map(async (type) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('product_type_id', type.id);
        
        return { ...type, productCount: count || 0 };
      }));
      setProductTypes(typesWithCount);
    }
    setLoading(false);
  };

  const addProductType = async (productType: Omit<ProductType, 'id'>) => {
    const { data, error } = await supabase
      .from('product_types')
      .insert([{
        name: productType.name,
        image_url: productType.image_url
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product type:', error);
      return null;
    } else {
      await fetchProductTypes();
      return data;
    }
  };

  const updateProductType = async (id: string, updates: Partial<Omit<ProductType, 'id'>>) => {
    const { error } = await supabase
      .from('product_types')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product type:', error);
    } else {
      await fetchProductTypes();
    }
  };

  const deleteProductType = async (id: string) => {
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product type:', error);
    } else {
      await fetchProductTypes();
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return { 
    productTypes, 
    loading, 
    addProductType, 
    updateProductType, 
    deleteProductType,
    refreshProductTypes: fetchProductTypes 
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      // Transform the data to match our Product interface
      const transformedProducts: Product[] = (data || []).map(product => ({
        ...product,
        options: typeof product.options === 'object' && product.options !== null 
          ? product.options as { sizes: Array<{ name: string; priceModifier: number }>; colors: Array<{ name: string; priceModifier: number }> }
          : { sizes: [], colors: [] }
      }));
      setProducts(transformedProducts);
    }
    setLoading(false);
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        images: product.images,
        product_type_id: product.product_type_id,
        options: product.options
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      return null;
    } else {
      await fetchProducts();
      return data;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
    } else {
      await fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
    } else {
      await fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    refreshProducts: fetchProducts 
  };
};
