// src/pages/ProductsPage.tsx

import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { useProducts, useProductTypes } from '../hooks/useSupabaseStore';
import GenericCarousel from '../components/GenericCarousel';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const { typeId = '' } = useParams();
  
  // 1. Fetch products by typeId using the hook
  const { products, loading: productsLoading } = useProducts(typeId);
  const { productTypes, loading: typesLoading } = useProductTypes();
  
  // Products are already filtered by the hook, but we keep this for safety
  const filteredProducts = products.filter(product => product.product_type_id === typeId);

  const currentProductType = productTypes.find(type => type.id === typeId);

  if (productsLoading || typesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <motion.div
        className="pt-20 md:pt-32 pb-12 md:pb-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-full">
          {/* Back Button */}
          <motion.div
            className="mb-6 md:mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <motion.button
                className="flex items-center space-x-2 glass-effect px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span>العودة إلى الصفحة الرئيسية</span>
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Header */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-16 gradient-text capitalize px-2 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {currentProductType?.name || 'المنتجات'}
          </motion.h1>
          
          {/* Products Carousel now receives the CORRECTLY filtered list */}
          {filteredProducts.length > 0 ? (
            <GenericCarousel
              items={filteredProducts}
              renderSlide={(product) => <ProductCard product={product} typeId={typeId} />}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg md:text-xl text-muted-foreground px-4">لا توجد منتجات متاحة في هذه الفئة حالياً.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsPage;