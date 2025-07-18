
import { Phone } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Use a Set to keep track of pixel IDs that have been initialized
// This prevents multiple 'fbq("init")' calls for the same pixel ID across renders or components.
const initializedPixels = new Set<string>();

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

  // Inject Facebook Pixel base code and initialize it
  useEffect(() => {
    if (settings?.facebook_pixel_id) {
      const pixelId = settings.facebook_pixel_id;

      // Ensure the fbq script is loaded into the window only once
      // The IIFE (Immediately Invoked Function Expression) pattern provided by Facebook handles this internally with `if (f.fbq) return;`
      void (function (f: any, b, e, v, n, t, s) {
        if (f.fbq) return; // If fbq is already defined, don't load the script again
        n = f.fbq = function () {
          void (n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments));
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        t.id = 'facebook-pixel-script'; // Add an ID to the script tag
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );

      // Initialize the pixel only if it hasn't been initialized for this specific ID in this session
      if (!initializedPixels.has(pixelId)) {
        (window as any).fbq('init', pixelId);
        initializedPixels.add(pixelId); // Mark this pixel ID as initialized
        // Facebook's base pixel code automatically tracks 'PageView' after 'init'.
        // Explicitly calling fbq('track', 'PageView') here often leads to duplicates.
      }
    }
  }, [settings?.facebook_pixel_id]); // Re-run effect if pixel ID changes

  const handlePhoneCallClick = () => {
    // No hardcoded pixel events here. Seller can define 'Contact' event via Facebook Event Setup Tool.
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

      {/* Sticky WhatsApp Button */}
      <a
       href={`tel:${settings?.phone_number || ''}`}
        className="fixed bottom-3 right-3 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contact us via phone"
        onClick={handlePhoneCallClick} // Keeping onClick, but it doesn't track pixel events directly anymore
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default MainLayout;