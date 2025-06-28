import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageLightbox from '../components/ImageLightbox';
import ImageGalleryPagination from '../components/ImageGalleryPagination';
import StarRating from '../components/StarRating';
import AnimatedCheckbox from '../components/AnimatedCheckbox';

// Mock data for products
const mockProducts = {
  't-shirts': [
    {
      id: '1',
      name: 'Classic White Tee',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=600&fit=crop'
      ],
      description: 'A timeless classic, this white tee is made from premium cotton for ultimate comfort and durability.'
    },
    {
      id: '2',
      name: 'Vintage Black Tee',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=600&fit=crop'
      ],
      description: 'Add a touch of retro style to your wardrobe with this vintage black tee. Soft and comfortable for everyday wear.'
    },
    {
      id: '3',
      name: 'Premium Cotton Tee',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=800&h=600&fit=crop'
      ],
      description: 'Experience luxury with our premium cotton tee. Designed for a perfect fit and exceptional softness.'
    }
  ],
  'hoodies': [
    {
      id: '4',
      name: 'Comfort Hoodie',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a9c6aa6a6ad?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556821840-3a9c6aa6a6ad?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      ],
      description: 'Stay cozy and stylish with our comfort hoodie. Perfect for lounging or outdoor adventures.'
    },
    {
      id: '5',
      name: 'Premium Hoodie',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556821840-3a9c6aa6a6ad?w=800&h=600&fit=crop'
      ],
      description: 'Elevate your casual look with our premium hoodie. Crafted with high-quality materials for lasting warmth and style.'
    }
  ],
  'accessories': [
    {
      id: '6',
      name: 'Classic Watch',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
      ],
      description: 'A timeless accessory, this classic watch combines elegance and functionality. Perfect for any occasion.'
    }
  ],
  'electronics': [
    {
      id: '7',
      name: 'Wireless Headphones',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop'
      ],
      description: 'Immerse yourself in sound with these wireless headphones. Enjoy crystal-clear audio and comfortable fit.'
    }
  ]
};

// Mock data for wilaya and commune
const wilayaData = [
  {
    id: '1',
    name: 'Adrar',
    communes: ['Adrar', 'Aougrout', 'Reggane']
  },
  {
    id: '2',
    name: 'Chlef',
    communes: ['Chlef', 'Tenes', 'Beni Haoua']
  },
  {
    id: '3',
    name: 'Laghouat',
    communes: ['Laghouat', 'Aflou', 'Ksar Cheikh']
  }
];

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: ''
  });
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState('');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // Find the product by ID across all types
      let foundProduct = null;
      for (const type in mockProducts) {
        const product = mockProducts[type as keyof typeof mockProducts].find((p) => p.id === id);
        if (product) {
          foundProduct = product;
          break;
        }
      }

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Redirect to not found page if product doesn't exist
        navigate('/not-found');
        return;
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleZoom = (imageUrl: string) => {
    setLightboxImage(imageUrl);
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWilaya(e.target.value);
    // Reset commune when wilaya changes
    setSelectedCommune('');
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommune(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <motion.div
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2 inline-block" />
            <motion.button
              className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Back</span>
            </motion.button>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                <motion.img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl cursor-zoom-in"
                  onClick={() => handleZoom(product.images[selectedImageIndex])}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <ImageGalleryPagination
                images={product.images}
                currentIndex={selectedImageIndex}
                onIndexChange={handleImageClick}
              />
            </motion.div>
            
            {/* Product Details */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Product Title and Rating */}
              <motion.div className="space-y-3">
                <motion.h1
                  className="text-4xl font-bold gradient-text"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {product.name}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <StarRating rating={rating} onRatingChange={handleRatingChange} />
                </motion.div>
              </motion.div>
              
              {/* Product Description */}
              <motion.div className="space-y-4">
                <motion.p
                  className="text-muted-foreground leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {product.description}
                </motion.p>
              </motion.div>
              
              {/* Order Form */}
              <motion.div
                className="glass-effect p-8 rounded-2xl space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-2xl font-bold gradient-text mb-6">Place Your Order</h3>
                
                {/* Size Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <div className="flex space-x-3">
                    {['S', 'M', 'L', 'XL'].map(size => (
                      <motion.button
                        key={size}
                        className={`px-4 py-2 rounded-lg border border-border transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedSize(size)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Color Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex space-x-3">
                    {['Red', 'Blue', 'Green'].map(color => (
                      <motion.button
                        key={color}
                        className={`px-4 py-2 rounded-lg border border-border transition-colors ${
                          selectedColor === color
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedColor(color)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <motion.button
                      className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      onClick={decrementQuantity}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    
                    <span className="text-lg font-semibold">{quantity}</span>
                    
                    <motion.button
                      className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      onClick={incrementQuantity}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Customer Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                {/* Wilaya Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Wilaya</label>
                  <select
                    value={selectedWilaya}
                    onChange={handleWilayaChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="" disabled>Select your Wilaya</option>
                    {wilayaData.map(wilaya => (
                      <option key={wilaya.id} value={wilaya.name}>{wilaya.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Home Delivery Option */}
                <div className="space-y-4">
                  <AnimatedCheckbox
                    checked={homeDelivery}
                    onChange={setHomeDelivery}
                    label="Ship to my Home Address"
                    className="p-2"
                  />
                  
                  {homeDelivery && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Commune</label>
                      <select
                        value={selectedCommune}
                        onChange={handleCommuneChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={!homeDelivery}
                      >
                        <option value="" disabled>Select your Commune</option>
                        {wilayaData
                          .find(wilaya => wilaya.name === selectedWilaya)
                          ?.communes.map(commune => (
                            <option key={commune} value={commune}>{commune}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
                
                {/* Total Price and Place Order Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">Total: ${product.price * quantity}</span>
                  <motion.button
                    className="btn-gradient"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Place Order
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image Lightbox */}
      <ImageLightbox
        src={lightboxImage || ''}
        alt="Product Image"
        isOpen={!!lightboxImage}
        onClose={handleCloseLightbox}
      />
    </div>
  );
};

export default ProductPage;
