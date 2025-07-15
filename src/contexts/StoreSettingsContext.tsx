import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface StoreSettings {
  store_name: string;
  logo_url: string;
  hero_images: string[];
  social_media: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
  };
  phone_number: string;
}

interface StoreSettingsContextType {
  settings: StoreSettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching store settings:', error);
      } else if (data) {
        // Correctly cast the social_media field
        const formattedSettings: StoreSettings = {
          ...data,
          social_media: data.social_media as {
            facebook?: string;
            instagram?: string;
            telegram?: string;
          },
        };
        setSettings(formattedSettings);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const { data, error } = await supabase
      .from('store_settings')
      .update(newSettings)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      throw error;
    }
    // Also apply the type cast here after updating
    if (data) {
        const formattedSettings: StoreSettings = {
            ...data,
            social_media: data.social_media as {
                facebook?: string;
                instagram?: string;
                telegram?: string;
            },
        };
        setSettings(formattedSettings);
    }
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};