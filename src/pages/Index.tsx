
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductTypeCard from '../components/ProductTypeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProductTypes } from '../hooks/useSupabaseStore';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const { productTypes, loading: typesLoading } = useProductTypes();

  useEffect(() => {
    // Simulate loading for UI smoothness
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || typesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-20 md:pt-32 pb-12 md:pb-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto text-center max-w-full">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 gradient-text leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SpectraCommerce
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of e-commerce with stunning visuals, fluid animations, and seamless interactions
          </motion.p>
          
          <motion.div
            className="inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 200 }}
          >
            <div className="btn-gradient text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4">
              Explore Collections
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Product Types Grid */}
      <motion.section 
        className="py-12 md:py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-full">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-16 gradient-text px-2"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover Our Collections
          </motion.h2>
          
          {productTypes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
              {productTypes.map((type, index) => (
                <ProductTypeCard
                  key={type.id}
                  id={type.id}
                  name={type.name}
                  imageUrl={type.image_url || '/placeholder.svg'}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg md:text-xl text-muted-foreground px-4">No product types available yet.</p>
            </div>
          )}
        </div>
      </motion.section>
      
      {/* Footer */}
      <motion.footer
        className="py-8 md:py-12 px-4 mt-12 md:mt-20 glass-effect"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center max-w-full">
          <p className="text-sm md:text-base text-muted-foreground px-2">
            © 2024 SpectraCommerce. The Zenith of Interactive E-commerce.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
