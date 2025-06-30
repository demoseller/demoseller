
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageLightbox from '../components/ImageLightbox';
import ImageGalleryPagination from '../components/ImageGalleryPagination';
import StarRating from '../components/StarRating';
import { useProducts, useProductTypes } from '../hooks/useSupabaseStore';
import { useReviews, useOrders } from '../hooks/useProductData';
import { useShippingData } from '../hooks/useShippingData';
import { toast } from 'sonner';

const ProductPage = () => {
  const { typeId, productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shipToHome, setShipToHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  
  const galleryRef = useRef<HTMLDivElement>(null);

  const { products, loading: productsLoading } = useProducts();
  const { productTypes, loading: typesLoading } = useProductTypes();
  const { reviews, loading: reviewsLoading } = useReviews(productId || '');
  const { addOrder } = useOrders();
  const { shippingData, loading: shippingLoading } = useShippingData();

  const product = products.find(p => p.id === productId);
  const productType = productTypes.find(t => t.id === typeId);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  useEffect(() => {
    if (!productsLoading && !typesLoading && !reviewsLoading && !shippingLoading) {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [productsLoading, typesLoading, reviewsLoading, shippingLoading]);

  // Handle scroll-based image index update
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current && product?.images) {
        const scrollLeft = galleryRef.current.scrollLeft;
        const imageWidth = galleryRef.current.scrollWidth / product.images.length;
        const newIndex = Math.round(scrollLeft / imageWidth);
        setCurrentImageIndex(Math.max(0, Math.min(newIndex, product.images.length - 1)));
      }
    };

    const galleryElement = galleryRef.current;
    if (galleryElement) {
      galleryElement.addEventListener('scroll', handleScroll);
      return () => galleryElement.removeEventListener('scroll', handleScroll);
    }
  }, [product]);

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let total = product.base_price;
    
    if (selectedSize && product.options.sizes) {
      const size = product.options.sizes.find(s => s.name === selectedSize);
      total += size?.priceModifier || 0;
    }
    
    if (selectedColor && product.options.colors) {
      const color = product.options.colors.find(c => c.name === selectedColor);
      total += color?.priceModifier || 0;
    }
    
    if (selectedWilaya && shippingData.shippingPrices[selectedWilaya]) {
      let shippingCost = shippingData.shippingPrices[selectedWilaya];
      if (shipToHome) {
        shippingCost = shippingCost * 1.3;
      }
      total += shippingCost;
    }
    
    return Math.round(total * 100) / 100;
  };

  const handleHorizontalScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleImageClick = (image: string) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };

  const handleImageIndexChange = (index: number) => {
    setCurrentImageIndex(index);
    if (galleryRef.current && product?.images) {
      const imageWidth = galleryRef.current.scrollWidth / product.images.length;
      galleryRef.current.scrollTo({
        left: imageWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSubmitting(true);
    
    try {
      // Add order to database
      await addOrder({
        customer_name: fullName,
        customer_phone: phoneNumber,
        wilaya: selectedWilaya,
        commune: selectedCommune,
        full_address: `${selectedWilaya}${selectedCommune ? `, ${selectedCommune}` : ''}`,
        product_name: product.name,
        size: selectedSize,
        color: selectedColor,
        total_price: calculateTotalPrice(),
        status: 'pending' as const
      });
      
      // Navigate to confirmation page
      navigate('/confirmation', { 
        state: { 
          fromProductType: productType?.name,
          productId: product.id,
          productName: product.name,
          productImage: product.images[0]
        }
      });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading || !product) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <motion.div
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
            <Link to={`/products/${typeId}`}>
              <motion.button
                className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Products</span>
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery with Pagination */}
            <motion.div
              className="relative"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div
                ref={galleryRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide h-96 lg:h-[600px]"
                onWheel={handleHorizontalScroll}
                style={{ scrollBehavior: 'smooth' }}
              >
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-80 lg:w-96 h-full relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                ))}
              </div>
              
              {/* Image Pagination Dots */}
              <ImageGalleryPagination
                images={product.images}
                currentIndex={currentImageIndex}
                onIndexChange={handleImageIndexChange}
              />
              
              <motion.p
                className="text-sm text-muted-foreground mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Click images to view in full screen • Scroll horizontally for more
              </motion.p>
            </motion.div>

            {/* Product Information Form */}
            <motion.div
              className="space-y-8"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold gradient-text mb-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {product.name}
                </motion.h1>

                {/* Star Rating Display */}
                <motion.div
                  className="flex items-center space-x-2 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <StarRating 
                    rating={averageRating} 
                    readonly 
                    showText 
                  />
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </motion.div>
                
                <motion.p
                  className="text-lg text-muted-foreground mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {product.description}
                </motion.p>
                
                {/* Pricing */}
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold gradient-text">
                      {product.base_price} DA
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {calculateTotalPrice()} DA (including options & shipping)
                  </p>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.options.sizes && product.options.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Size</label>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                      >
                        <option value="">Select Size</option>
                        {product.options.sizes.map(size => (
                          <option key={size.name} value={size.name}>
                            {size.name} {size.priceModifier > 0 && `(+${size.priceModifier} DA)`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {product.options.colors && product.options.colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Color</label>
                      <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                      >
                        <option value="">Select Color</option>
                        {product.options.colors.map(color => (
                          <option key={color.name} value={color.name}>
                            {color.name} {color.priceModifier > 0 && `(+${color.priceModifier} DA)`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Full Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="0555 123 456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Wilaya *</label>
                    <select
                      value={selectedWilaya}
                      onChange={(e) => {
                        setSelectedWilaya(e.target.value);
                        setSelectedCommune('');
                      }}
                      className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      required
                    >
                      <option value="">Select Wilaya</option>
                      {Object.entries(shippingData.shippingPrices).map(([wilaya, baseCost]) => {
                        const finalCost = shipToHome ? baseCost * 1.3 : baseCost;
                        return (
                          <option key={wilaya} value={wilaya}>
                            {wilaya} (+{finalCost.toFixed(2)} DA shipping)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Advanced Shipping Option */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="shipToHome"
                        checked={shipToHome}
                        onChange={(e) => setShipToHome(e.target.checked)}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50"
                      />
                      <label htmlFor="shipToHome" className="text-sm font-medium text-foreground">
                        Ship to my Home Address (+30% shipping cost)
                      </label>
                    </div>

                    {shipToHome && selectedWilaya && shippingData.communes[selectedWilaya] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Daira/Commune (Town) *
                        </label>
                        <select
                          value={selectedCommune}
                          onChange={(e) => setSelectedCommune(e.target.value)}
                          className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                          required={shipToHome}
                        >
                          <option value="">Select Commune</option>
                          {shippingData.communes[selectedWilaya].map(commune => (
                            <option key={commune} value={commune}>
                              {commune}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gradient flex items-center justify-center space-x-2 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Place Order ({calculateTotalPrice()} DA)</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image Lightbox */}
      <ImageLightbox
        src={lightboxImage}
        alt={product.name}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default ProductPage;
