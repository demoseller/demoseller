// src/components/Footer.tsx

import { motion } from 'framer-motion';
import { Facebook, Instagram, Send } from 'lucide-react';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';


const Footer = () => {
   const { settings } = useStoreSettings();

  return (
    <div className="mt-8 sm:mt-12 md:mt-20 relative">
      {/* Gradient border - outer div */}
      <div className="absolute inset-0 p-[2px] bg-gradient-primary dark:bg-gradient-primary-dark">
        {/* Inner transparent div to create border effect */}
        <div className="absolute inset-0 bg-background/80 dark:bg-background/80"></div>
      </div>
      
      <motion.footer
        className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 glass-effect relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-6 mb-6">
           <a href={settings?.social_media?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
           <a href={settings?.social_media?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
           <a href={settings?.social_media?.telegram || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Send className="w-6 h-6" />
            </a>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            © 2024 <a 
              href="https://www.facebook.com/abdrhmn.baat/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mx-2 font-medium text-primary hover:underline">
                 WeEcom 
                 </a>
             جميع الحقوق محفوظة
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;