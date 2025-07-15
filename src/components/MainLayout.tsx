// src/components/MainLayout.tsx

import { Phone } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useEffect } from 'react';



interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
   const { settings } = useStoreSettings();
   useEffect(() => {
   if (settings?.store_name) {
     document.title = settings.store_name;
   }
 }, [settings]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Sticky WhatsApp Button */}
      <a 
       href={`tel:${settings?.phone_number || ''}`}
        className="fixed bottom-3 right-3 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contact us via phone"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default MainLayout;