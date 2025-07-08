// src/pages/Index.tsx

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import GenericCarousel from '../components/GenericCarousel';
import ProductTypeCard from '../components/ProductTypeCard';
import ProductCard from '../components/ProductCard';
import HeroImageCard from '../components/HeroImageCard';
import { useProductTypes, useProducts } from '../hooks/useSupabaseStore';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

// Define your hero images
const heroImages = [
  { id: 1, url: '/bg1.jpg' },
  { id: 2, url: '/bg2.jpg' },
  { id: 3, url: '/bg3.jpg' },
  { id: 4, url: '/bg4.jpg' },
];

const Index = () => {
  const { productTypes, loading: typesLoading } = useProductTypes();
  const { products, loading: productsLoading } = useProducts('');
  
  // State for search filters and display logic
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchColor, setSearchColor] = useState('');
  const [searchSize, setSearchSize] = useState('');
  const [isShowingAll, setIsShowingAll] = useState(false);

  // Memoize the initial "smart" list of products to display
  const initialProductList = useMemo(() => {
    if (products.length === 0 || productTypes.length === 0) return [];
    
    const includedProductIds = new Set<string>();
    const initialList = [];

    // 1. Ensure at least one product from each type is included
    for (const type of productTypes) {
      const productForType = products.find(p => p.product_type_id === type.id);
      if (productForType && !includedProductIds.has(productForType.id)) {
        initialList.push(productForType);
        includedProductIds.add(productForType.id);
      }
    }
    
    // 2. Calculate the 50% display limit
    const limit = Math.max(initialList.length, Math.ceil(products.length / 2));

    // 3. Fill the rest with other products until the limit is reached
    for (const product of products) {
      if (initialList.length >= limit) break;
      if (!includedProductIds.has(product.id)) {
        initialList.push(product);
        includedProductIds.add(product.id);
      }
    }
    
    return initialList;
  }, [products, productTypes]);

  // Memoize the final list of products to be displayed based on search and "show more" state
  const displayedProducts = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const lowerSearchColor = searchColor.toLowerCase().trim();
    const lowerSearchSize = searchSize.toLowerCase().trim();
    const numericSearchPrice = parseFloat(searchPrice);
    
    const hasSearchCriteria = lowerSearchTerm || searchPrice || lowerSearchColor || lowerSearchSize;

    // Filter products based on an "AND" condition for all filled search fields
    const results = products.filter(product => {
      const nameMatch = !lowerSearchTerm || product.name.toLowerCase().includes(lowerSearchTerm);
      const priceMatch = isNaN(numericSearchPrice) || product.base_price <= numericSearchPrice;
      const colorMatch = !lowerSearchColor || product.options.colors.some(c => c.name.toLowerCase().includes(lowerSearchColor));
      const sizeMatch = !lowerSearchSize || product.options.sizes.some(s => s.name.toLowerCase().includes(lowerSearchSize));
      
      return nameMatch && priceMatch && colorMatch && sizeMatch;
    });

    if (hasSearchCriteria) {
      return results; // If searching, show all results that match
    }

    return isShowingAll ? results : initialProductList; // Otherwise, show initial list or all products
    
  }, [searchTerm, searchPrice, searchColor, searchSize, products, initialProductList, isShowingAll]);

  // Determine if the "Show More" button should be visible
  const shouldShowMoreButton = !isShowingAll && initialProductList.length < products.length && !searchTerm && !searchPrice && !searchColor && !searchSize;

  if (typesLoading || productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-14 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 md:pb-16 px-2 sm:px-4 space-y-8 md:space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          <motion.h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 gradient-text leading-tight" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            إسم المتجر
          </motion.h1>
          <motion.p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 text-muted-foreground max-w-3xl mx-auto leading-relaxed" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            أفضل المنتجات بأفضل الأسعار - التوصيل متوفر 58 ولاية
          </motion.p>
        </div>
        <div className="w-full">
           <GenericCarousel
              items={heroImages}
              renderSlide={(image) => <HeroImageCard imageUrl={image.url} />}
            />
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
          <motion.h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-16 gradient-text" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            إكتشف أنواع المنتجات
          </motion.h2>
          {productTypes.length > 0 ? (
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

      {/* NEW: All Products Section */}
      <motion.section 
        className="py-8 sm:py-12 md:py-20 px-3 sm:px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 gradient-text"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            تصفح جميع المنتجات
          </motion.h2>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12 p-4 glass-effect rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input placeholder="اسم المنتج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Input type="number" placeholder="السعر الأقصى..." value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)} />
              <Input placeholder="اللون..." value={searchColor} onChange={(e) => setSearchColor(e.target.value)} />
              <Input placeholder="المقاس..." value={searchSize} onChange={(e) => setSearchSize(e.target.value)} />
            </div>
          </div>
          
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  typeId={product.product_type_id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">لم يتم العثور على منتجات تطابق بحثك.</p>
            </div>
          )}

          {/* Show More Button */}
          {shouldShowMoreButton && (
            <div className="text-center mt-8 md:mt-12">
              <Button onClick={() => setIsShowingAll(true)} className="btn-gradient">
                عرض المزيد
              </Button>
            </div>
          )}
        </div>
      </motion.section>
      
      {/* Footer */}
      <motion.footer className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 mt-8 sm:mt-12 md:mt-20 glass-effect" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
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