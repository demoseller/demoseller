
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { useProducts, useProductTypes } from '../hooks/useSupabaseStore';

const ProductsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { products, loading: productsLoading } = useProducts();
  const { productTypes, loading: typesLoading } = useProductTypes();
  
  const currentProductType = productTypes.find(type => type.id === id);
  const filteredProducts = products.filter(product => product.product_type_id === id);

  useEffect(() => {
    if (!productsLoading && !typesLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [productsLoading, typesLoading]);

  if (loading || productsLoading || typesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <motion.div
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <motion.button
                className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Header */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-16 gradient-text capitalize"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {currentProductType?.name || 'Products'}
          </motion.h1>
          
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl card-hover"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative h-80 w-full overflow-hidden">
                      <motion.img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      <motion.div
                        className="absolute inset-0 glass-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ rotateY: 5, rotateX: 2 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className="absolute bottom-6 left-6 right-6">
                          <motion.h3
                            className="text-xl font-bold text-white mb-2"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {product.name}
                          </motion.h3>
                          
                          <motion.p
                            className="text-lg font-semibold text-white mb-3"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {product.base_price} DA
                          </motion.p>
                          
                          <motion.div
                            className="w-12 h-1 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 48 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No products available in this category yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsPage;
