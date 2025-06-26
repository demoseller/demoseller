
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductTypeCard from '../components/ProductTypeCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock data for product types
const mockProductTypes = [
  {
    id: 't-shirts',
    name: 'T-Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop'
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a9c6aa6a6ad?w=800&h=600&fit=crop'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop'
  }
];

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SpectraCommerce
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto"
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
            <div className="btn-gradient">
              Explore Collections
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Product Types Grid */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover Our Collections
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockProductTypes.map((type, index) => (
              <ProductTypeCard
                key={type.id}
                id={type.id}
                name={type.name}
                imageUrl={type.imageUrl}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <motion.footer
        className="py-12 px-4 mt-20 glass-effect"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 SpectraCommerce. The Zenith of Interactive E-commerce.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
