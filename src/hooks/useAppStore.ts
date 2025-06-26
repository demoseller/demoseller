
import { useState, useEffect } from 'react';
import { appStore, Order, Product, ProductType } from '../store/appStore';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(appStore.getOrders());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setOrders(appStore.getOrders());
    });
    return unsubscribe;
  }, []);

  return orders;
};

export const useProductTypes = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>(appStore.getProductTypes());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setProductTypes(appStore.getProductTypes());
    });
    return unsubscribe;
  }, []);

  return productTypes;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(appStore.getProducts());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setProducts(appStore.getProducts());
    });
    return unsubscribe;
  }, []);

  return products;
};
