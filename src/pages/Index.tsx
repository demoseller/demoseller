// src/pages/Index.tsx

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import GenericCarousel from '../components/GenericCarousel'; // Changed import
import ProductTypeCard from '../components/ProductTypeCard';
import { useProductTypes } from '../hooks/useSupabaseStore';

const Index = () => {
  const { productTypes, loading: typesLoading } = useProductTypes();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading || typesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-14 sm:pt-16 md:pt-20 lg:pt-32 pb-8 sm:pb-12 md:pb-20 px-2 sm:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 gradient-text leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            إسم المتجر
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            أفضل المنتجات بأفضل الأسعار - التوصيل متوفر 58 ولاية
          </motion.p>
        </div>
      </motion.section>
      
      {/* Product Types Carousel Section */}
      <motion.section 
        className="py-8 sm:py-12 md:py-20 px-3 sm:px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-16 gradient-text"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            إكتشف أنواع المنتجات
          </motion.h2>
          
          {productTypes.length > 0 ? (
            // Using the new GenericCarousel
            <GenericCarousel 
              items={productTypes}
              renderSlide={(type) => <ProductTypeCard id={type.id} name={type.name} imageUrl={type.image_url || '/placeholder.svg'} />}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">لاتوجد أنواع منتجات لعرضها</p>
            </div>
          )}
        </div>
      </motion.section>
      
      {/* Footer */}
      <motion.footer
        className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 mt-8 sm:mt-12 md:mt-20 glass-effect"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            © 2024 جميع الحقوق محفوظة
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;