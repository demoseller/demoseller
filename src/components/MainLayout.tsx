// src/components/MainLayout.tsx

import { Phone } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

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

  // Inject Facebook Pixel base code
  useEffect(() => {
    if (settings?.facebook_pixel_id) {
      const pixelId = settings.facebook_pixel_id;

      // Check if the script already exists to prevent re-injection
      if (document.getElementById('facebook-pixel-script')) {
        // If it exists and pixelId has changed, reinitialize or reload
        if ((window as any).fbq) {
          (window as any).fbq('init', pixelId);
          (window as any).fbq('track', 'PageView'); // إعادة تتبع PageView عند التحديث أو إعادة التحميل
        }
        return;
      }

      // Standard Facebook Pixel Base Code - Corrected to fix ESLint/TypeScript errors
      void (function (f: any, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          void (n.callMethod // Use void to ignore return value and satisfy ESLint/TypeScript
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments)); // Use void to ignore return value and satisfy ESLint/TypeScript
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        t.id = 'facebook-pixel-script'; // Add an ID to easily check its existence
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );

      (window as any).fbq('init', pixelId);
      (window as any).fbq('track', 'PageView'); // تتبع حدث مشاهدة الصفحة
    }
  }, [settings?.facebook_pixel_id]);

  const handlePhoneCallClick = () => {
    if ((window as any).fbq) {
      // Trigger a standard 'Contact' event
      (window as any).fbq('track', 'Contact', { // تتبع حدث "اتصال"
        content_name: 'Phone Call via WhatsApp button',
        content_category: 'Contact',
        value: 0, // You can set a value if this contact leads to a sale
        currency: 'DZD',
        phone_number: settings?.phone_number || 'N/A' // Include phone number for context
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Helmet>
        {/* Favicons etc. handled by index.html for static, or Dashboard.tsx for dynamic in admin */}
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Sticky WhatsApp Button (now tracking clicks) */}
      <a
       href={`tel:${settings?.phone_number || ''}`}
        className="fixed bottom-3 right-3 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contact us via phone"
        onClick={handlePhoneCallClick} // Added onClick event handler
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default MainLayout;