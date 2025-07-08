// src/pages/Index.tsx

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Search, Facebook, Instagram, Send, Phone } from 'lucide-react';

import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import GenericCarousel from '../components/GenericCarousel';
import ProductTypeCard from '../components/ProductTypeCard';
import ProductCard from '../components/ProductCard';
import HeroImageCard from '../components/HeroImageCard';
import { useProductTypes, useProducts } from '../hooks/useSupabaseStore';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

// --- (Keep your heroImages array and component logic as it is) ---
const heroImages = [
  { id: 1, url: '/bg1.jpg' },
  { id: 2, url: '/bg2.jpg' },
  { id: 3, url: '/bg3.jpg' },
  { id: 4, url: '/bg4.jpg' },
];

const Index = () => {
    // --- (Keep all your existing hooks and state variables) ---
    const { productTypes, loading: typesLoading } = useProductTypes();
    const { products, loading: productsLoading } = useProducts('');
    const [productTypeSearchTerm, setProductTypeSearchTerm] = useState('');
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [searchPrice, setSearchPrice] = useState('');
    const [searchColor, setSearchColor] = useState('');
    const [searchSize, setSearchSize] = useState('');
    const [displayCount, setDisplayCount] = useState(0);

    const filteredProductTypes = useMemo(() => {
        if (!productTypeSearchTerm) return productTypes;
        return productTypes.filter(type => 
        type.name.toLowerCase().includes(productTypeSearchTerm.toLowerCase())
        );
    }, [productTypeSearchTerm, productTypes]);

    const filteredProducts = useMemo(() => {
        const lowerSearchTerm = productSearchTerm.toLowerCase().trim();
        const lowerSearchColor = searchColor.toLowerCase().trim();
        const lowerSearchSize = searchSize.toLowerCase().trim();
        const numericSearchPrice = parseFloat(searchPrice);

        return products.filter(product => {
        const nameMatch = !lowerSearchTerm || product.name.toLowerCase().includes(lowerSearchTerm);
        const priceMatch = isNaN(numericSearchPrice) || product.base_price <= numericSearchPrice;
        const colorMatch = !lowerSearchColor || product.options.colors.some(c => c.name.toLowerCase().includes(lowerSearchColor));
        const sizeMatch = !lowerSearchSize || product.options.sizes.some(s => s.name.toLowerCase().includes(lowerSearchSize));
        
        return nameMatch && priceMatch && colorMatch && sizeMatch;
        });
    }, [productSearchTerm, searchPrice, searchColor, searchSize, products]);

    useEffect(() => {
        if (filteredProducts.length > 0) {
        setDisplayCount(Math.ceil(filteredProducts.length * 0.20));
        }
    }, [filteredProducts]);

    const handleShowMore = () => {
        const increment = Math.ceil(products.length * 0.20);
        setDisplayCount(prevCount => Math.min(prevCount + increment, filteredProducts.length));
    };
  
    const shouldShowMoreButton = displayCount < filteredProducts.length;

    if (typesLoading || productsLoading) {
        return <LoadingSpinner />;
    }

  return (
    <div className="min-h-screen w-full">
      <Navbar />

      {/* --- (Your existing Hero and Carousel sections remain the same) --- */}
      <motion.section 
        className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 space-y-6 md:space-y-8"
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
              slideClassName="w-full"
              renderSlide={(image) => <HeroImageCard imageUrl={image.url} />}
            />
        </div>
      </motion.section>
      
      <motion.section 
        className="py-0 sm:py-8 md:py-12 px-3 sm:px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <motion.h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-6 gradient-text" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            إكتشف أنواع المنتجات
          </motion.h2>
          <div className="max-w-md mx-auto mb-8 md:mb-12">
            <Input 
              placeholder="...ابحث عن نوع منتج"
              value={productTypeSearchTerm}
              onChange={(e) => setProductTypeSearchTerm(e.target.value)}
            />
          </div>
          {filteredProductTypes.length > 0 ? (
            <GenericCarousel 
              items={filteredProductTypes}
              renderSlide={(type) => <ProductTypeCard id={type.id} name={type.name} imageUrl={type.image_url || '/placeholder.svg'} />}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">لا توجد أنواع منتجات تطابق بحثك</p>
            </div>
          )}
        </div>
      </motion.section>

      <motion.section 
        className="py-6 sm:py-8 md:py-12 px-3 sm:px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center items-center gap-4 mb-8 md:mb-12">
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center gradient-text"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              تصفح جميع المنتجات
            </motion.h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">بحث متقدم</h4>
                    <p className="text-sm text-muted-foreground">
                      ابحث عن منتجاتك بمعايير محددة.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Input placeholder="اسم المنتج..." value={productSearchTerm} onChange={(e) => setProductSearchTerm(e.target.value)} />
                    <Input type="number" placeholder="السعر الأقصى..." value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)} />
                    <Input placeholder="اللون..." value={searchColor} onChange={(e) => setSearchColor(e.target.value)} />
                    <Input placeholder="المقاس..." value={searchSize} onChange={(e) => setSearchSize(e.target.value)} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredProducts.slice(0, displayCount).map((product) => (
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

          {shouldShowMoreButton && (
            <div className="text-center mt-8 md:mt-12">
              <Button onClick={handleShowMore} className="btn-gradient">
                عرض المزيد
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* NEW: Sticky WhatsApp Button */}
      <a 
        href="tel:+213667441637" // <-- REPLACE WITH YOUR PHONE NUMBER
        className="fixed bottom-6 right-6 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contact us via WhatsApp"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
      
      {/* Footer */}
      <motion.footer
        className="py-2 sm:py-8 md:py-12 px-0 sm:px-4 mt-0 sm:mt-12 md:mt-20 glass-effect"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          {/* NEW: Social Media Links Section */}
          <div className="flex justify-center items-center space-x-6 mb-6">
            <a href="https://facebook.com/your-page" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/abdrhmn.baat/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            
            <a href="https://t.me/abdrhmn_baat" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Send className="w-6 h-6" />
            </a>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            © 2024 جميع الحقوق محفوظة
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;