
import { useState, useEffect } from 'react';

interface ShippingData {
  shippingPrices: Record<string, number>;
  communes: Record<string, string[]>;
}

export const useShippingData = () => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    shippingPrices: {},
    communes: {}
  });
  const [loading, setLoading] = useState(true);

  const loadShippingData = async () => {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem('shippingData');
      if (stored) {
        setShippingData(JSON.parse(stored));
      } else {
        // If no localStorage data, load from JSON file and save to localStorage
        const response = await fetch('/src/data/shippingData.json');
        const data = await response.json();
        setShippingData(data);
        localStorage.setItem('shippingData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading shipping data:', error);
      // Fallback to empty data if everything fails
      setShippingData({
        shippingPrices: {},
        communes: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const updateShippingData = (newData: ShippingData) => {
    setShippingData(newData);
    localStorage.setItem('shippingData', JSON.stringify(newData));
  };

  const updateWilayaPrice = (wilaya: string, price: number) => {
    const newData = {
      ...shippingData,
      shippingPrices: {
        ...shippingData.shippingPrices,
        [wilaya]: price
      }
    };
    updateShippingData(newData);
  };

  const updateWilayaCommunes = (wilaya: string, communes: string[]) => {
    const newData = {
      ...shippingData,
      communes: {
        ...shippingData.communes,
        [wilaya]: communes
      }
    };
    updateShippingData(newData);
  };

  const addWilaya = (wilaya: string, price: number, communes: string[] = []) => {
    const newData = {
      shippingPrices: {
        ...shippingData.shippingPrices,
        [wilaya]: price
      },
      communes: {
        ...shippingData.communes,
        [wilaya]: communes
      }
    };
    updateShippingData(newData);
  };

  const removeWilaya = (wilaya: string) => {
    const newShippingPrices = { ...shippingData.shippingPrices };
    const newCommunes = { ...shippingData.communes };
    delete newShippingPrices[wilaya];
    delete newCommunes[wilaya];
    
    const newData = {
      shippingPrices: newShippingPrices,
      communes: newCommunes
    };
    updateShippingData(newData);
  };

  useEffect(() => {
    loadShippingData();
  }, []);

  return {
    shippingData,
    loading,
    updateWilayaPrice,
    updateWilayaCommunes,
    addWilaya,
    removeWilaya,
    refreshData: loadShippingData
  };
};
