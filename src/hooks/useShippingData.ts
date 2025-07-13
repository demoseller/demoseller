
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface ShippingData {
  shippingPrices: Record<string, number>;
  shippingHomePrices: Record<string, number>; // Add this line
  communes: Record<string, string[]>;
}

interface ShippingDataRow {
  id: string;
  wilaya: string;
  base_price: number;
  shipping_home_price: number; // Add this line
  communes: string[];
  created_at: string;
  updated_at: string;
}

export const useShippingData = () => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    shippingPrices: {},
    shippingHomePrices: {}, // Add this line
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
        const shippingHomePrices: Record<string, number> = {}; // Add this line
        const communes: Record<string, string[]> = {};

        data.forEach((row: ShippingDataRow) => {
          shippingPrices[row.wilaya] = row.base_price;
          shippingHomePrices[row.wilaya] = row.shipping_home_price; // Add this line
          communes[row.wilaya] = row.communes || [];
        });

        setShippingData({ shippingPrices, shippingHomePrices, communes }); // Update this
         console.log('Loaded shipping data:', { shippingPrices, shippingHomePrices, communes }); // Update this
      }
    } catch (error) {
      console.error('Error loading shipping data:', error);
      setError('Failed to load shipping data');
      setShippingData({
        shippingPrices: {},
        shippingHomePrices: {}, // Add this line
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

  const updateWilayaHomePrice = async (wilaya: string, price: number) => {
  try {
    const { error } = await supabase
      .from('shipping_data')
      .update({
        shipping_home_price: price,
        updated_at: new Date().toISOString()
      })
      .eq('wilaya', wilaya);

    if (error) throw error;
    await loadShippingData();
    return true;
  } catch (error) {
    console.error('Error updating home price:', error);
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

  // Add the new parameter to the function signature
const addWilaya = async (wilaya: string, price: number, communes: string[] = [], homePrice: number) => {
  try {
    const { error } = await supabase
      .from('shipping_data')
      .insert({
        wilaya,
        base_price: price,
        shipping_home_price: homePrice, // Add the new field here
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
    updateWilayaHomePrice,
    updateWilayaCommunes,
    addWilaya,
    removeWilaya,
    refreshData: loadShippingData
  };
};
