import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageLightbox from '../components/ImageLightbox';
import { ArrowLeft } from 'lucide-react';

// Mock data for products
const mockProducts = {
  't-shirts': [
    {
      id: '1',
      name: 'Classic White Tee',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      name: 'Vintage Black Tee',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      name: 'Premium Cotton Tee',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=600&fit=crop'
    }
  ],
  'hoodies': [
    {
      id: '4',
      name: 'Comfort Hoodie',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a9c6aa6a6ad?w=800&h=600&fit=crop'
    },
    {
      id: '5',
      name: 'Premium Hoodie',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    }
  ],
  'accessories': [
    {
      id: '6',
      name: 'Classic Watch',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
    }
  ],
  'electronics': [
    {
      id: '7',
      name: 'Wireless Headphones',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop'
    }
  ]
};

const ProductsPage = () => {
  const { type } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts[type as keyof typeof mockProducts] || []);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [type]);

  if (loading) {
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
            {type?.replace('-', ' ')}
          </motion.h1>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl card-hover"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative h-80 w-full overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-110 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setLightboxImage(product.imageUrl);
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    <div className="absolute inset-0 glass-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-xl font-bold text-white mb-2 transform translate-y-5 group-hover:translate-y-0 transition-transform duration-300">
                          {product.name}
                        </h3>
                        
                        <p className="text-lg font-semibold text-white mb-3 transform translate-y-5 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          ${product.price}
                        </p>
                        
                        <div className="w-0 h-1 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full group-hover:w-12 transition-all duration-600 ease-out delay-150" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <ImageLightbox
        src={lightboxImage || ''}
        alt="Product Image"
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
};

export default ProductsPage;
