
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
    console.log('Fetching orders...');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      console.log('Orders fetched:', data?.length || 0);
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
    console.log('Updating order status:', orderId, status);
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order:', error);
      return false;
    } else {
      console.log('Order status updated successfully');
      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      return true;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      console.log('Attempting to delete order:', orderId);
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) {
        console.error('Error deleting order from database:', error);
        return false;
      } else {
        console.log('Order deleted successfully from database');
        // Update local state immediately
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        return true;
      }
    } catch (error) {
      console.error('Error in deleteOrder function:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, updateOrderStatus, deleteOrder, refreshOrders: fetchOrders };
};

export const useProductTypes = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductTypes = async () => {
    console.log('Fetching product types...');
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching product types:', error);
    } else {
      console.log('Product types fetched:', data?.length || 0);
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
    console.log('Adding product type:', productType.name);
    
    // Handle image upload with a simple placeholder for now
    let imageUrl = productType.image_url;
    if (productType.image_url && !productType.image_url.startsWith('http')) {
      // For now, use a placeholder. In a real implementation, you'd upload to storage
      imageUrl = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&v=${Date.now()}`;
    }

    const { data, error } = await supabase
      .from('product_types')
      .insert([{
        name: productType.name,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product type:', error);
      return null;
    } else {
      console.log('Product type added successfully');
      // Update local state immediately
      const newType = { ...data, productCount: 0 };
      setProductTypes(prevTypes => [newType, ...prevTypes]);
      return data;
    }
  };

  const updateProductType = async (id: string, updates: Partial<Omit<ProductType, 'id'>>) => {
    console.log('Updating product type:', id);
    
    // Handle image upload
    let imageUrl = updates.image_url;
    if (updates.image_url && !updates.image_url.startsWith('http')) {
      imageUrl = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&v=${Date.now()}`;
    }

    const { error } = await supabase
      .from('product_types')
      .update({ 
        ...updates, 
        image_url: imageUrl,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product type:', error);
    } else {
      console.log('Product type updated successfully');
      // Update local state immediately
      setProductTypes(prevTypes => 
        prevTypes.map(type => 
          type.id === id ? { ...type, ...updates, image_url: imageUrl } : type
        )
      );
    }
  };

  const deleteProductType = async (id: string) => {
    console.log('Deleting product type:', id);
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product type:', error);
    } else {
      console.log('Product type deleted successfully');
      // Update local state immediately
      setProductTypes(prevTypes => prevTypes.filter(type => type.id !== id));
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
    console.log('Fetching products...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      console.log('Products fetched:', data?.length || 0);
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
    console.log('Adding product:', product.name);
    
    // Handle image uploads with placeholders for now
    let images = product.images;
    if (images && images.length > 0) {
      images = images.map(img => 
        img.startsWith('http') ? img : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&v=${Date.now()}`
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        images: images,
        product_type_id: product.product_type_id,
        options: product.options,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      return null;
    } else {
      console.log('Product added successfully');
      // Update local state immediately
      const newProduct = {
        ...data,
        options: typeof data.options === 'object' && data.options !== null 
          ? data.options as { sizes: Array<{ name: string; priceModifier: number }>; colors: Array<{ name: string; priceModifier: number }> }
          : { sizes: [], colors: [] }
      };
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      return data;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    console.log('Updating product:', id);
    
    // Handle image uploads
    let images = updates.images;
    if (images && images.length > 0) {
      images = images.map(img => 
        img.startsWith('http') ? img : `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&v=${Date.now()}`
      );
    }

    const { error } = await supabase
      .from('products')
      .update({ 
        ...updates, 
        images: images,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
    } else {
      console.log('Product updated successfully');
      // Update local state immediately
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { 
            ...product, 
            ...updates, 
            images: images || product.images,
            options: updates.options || product.options
          } : product
        )
      );
    }
  };

  const deleteProduct = async (id: string) => {
    console.log('Deleting product:', id);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
    } else {
      console.log('Product deleted successfully');
      // Update local state immediately
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
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
