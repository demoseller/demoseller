
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface ShippingData {
  shippingPrices: Record<string, number>;
  communes: Record<string, string[]>;
}

interface ShippingDataRow {
  id: string;
  wilaya: string;
  base_price: number;
  communes: string[];
  created_at: string;
  updated_at: string;
}

export const useShippingData = () => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    shippingPrices: {},
    communes: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShippingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('shipping_data')
        .select('*')
        .order('wilaya');

      if (error) {
        console.error('Error loading shipping data:', error);
        setError(error.message);
        return;
      }

      if (data) {
        const shippingPrices: Record<string, number> = {};
        const communes: Record<string, string[]> = {};

        data.forEach((row: ShippingDataRow) => {
          shippingPrices[row.wilaya] = row.base_price;
          communes[row.wilaya] = row.communes || [];
        });

        setShippingData({ shippingPrices, communes });
        console.log('Loaded shipping data:', { shippingPrices, communes });
      }
    } catch (error) {
      console.error('Error loading shipping data:', error);
      setError('Failed to load shipping data');
      setShippingData({
        shippingPrices: {},
        communes: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWilayaPrice = async (wilaya: string, price: number) => {
    try {
      const { error } = await supabase
        .from('shipping_data')
        .update({ 
          base_price: price, 
          updated_at: new Date().toISOString() 
        })
        .eq('wilaya', wilaya);

      if (error) {
        console.error('Error updating price:', error);
        throw error;
      }

      await loadShippingData();
      return true;
    } catch (error) {
      console.error('Error updating price:', error);
      throw error;
    }
  };

  const updateWilayaCommunes = async (wilaya: string, communes: string[]) => {
    try {
      const { error } = await supabase
        .from('shipping_data')
        .update({ 
          communes, 
          updated_at: new Date().toISOString() 
        })
        .eq('wilaya', wilaya);

      if (error) {
        console.error('Error updating communes:', error);
        throw error;
      }

      await loadShippingData();
      return true;
    } catch (error) {
      console.error('Error updating communes:', error);
      throw error;
    }
  };

  const addWilaya = async (wilaya: string, price: number, communes: string[] = []) => {
    try {
      const { error } = await supabase
        .from('shipping_data')
        .insert({
          wilaya,
          base_price: price,
          communes
        });

      if (error) {
        console.error('Error adding wilaya:', error);
        throw error;
      }

      await loadShippingData();
      return true;
    } catch (error) {
      console.error('Error adding wilaya:', error);
      throw error;
    }
  };

  const removeWilaya = async (wilaya: string) => {
    try {
      const { error } = await supabase
        .from('shipping_data')
        .delete()
        .eq('wilaya', wilaya);

      if (error) {
        console.error('Error removing wilaya:', error);
        throw error;
      }

      await loadShippingData();
      return true;
    } catch (error) {
      console.error('Error removing wilaya:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadShippingData();
  }, []);

  return {
    shippingData,
    loading,
    error,
    updateWilayaPrice,
    updateWilayaCommunes,
    addWilaya,
    removeWilaya,
    refreshData: loadShippingData
  };
};
