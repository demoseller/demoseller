
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageLightbox from '../components/ImageLightbox';
import ImageGalleryPagination from '../components/ImageGalleryPagination';
import StarRating from '../components/StarRating';
import { appStore } from '../store/appStore';

// Mock product data with reviews
const mockProduct = {
  id: '1',
  name: 'Premium Cotton T-Shirt',
  description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton with a perfect fit.',
  basePrice: 100.00, // Changed to show discount
  originalPrice: 130.00, // Added original price
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=800&fit=crop'
  ],
  averageRating: 4.2,
  totalReviews: 47,
  sizes: [
    { name: 'Small', modifier: 0 },
    { name: 'Medium', modifier: 0 },
    { name: 'Large', modifier: 2 },
    { name: 'XL', modifier: 5 }
  ],
  colors: [
    { name: 'White', modifier: 0 },
    { name: 'Black', modifier: 0 },
    { name: 'Navy', modifier: 3 },
    { name: 'Premium Grey', modifier: 7 }
  ]
};

// Mock shipping costs
const shippingCosts = {
  'Adrar': 15,
  'Chlef': 12,
  'Laghouat': 14,
  'Oum El Bouaghi': 13,
  'Batna': 13,
  'Béjaïa': 10,
  'Biskra': 14,
  'Béchar': 16,
  'Blida': 8,
  'Bouira': 10,
  'Tamanrasset': 20,
  'Tébessa': 15,
  'Tlemcen': 12,
  'Tiaret': 12,
  'Tizi Ouzou': 9,
  'Alger': 6,
  'Djelfa': 13,
  'Jijel': 11,
  'Sétif': 11,
  'Saïda': 13,
  'Skikda': 11,
  'Sidi Bel Abbès': 12,
  'Annaba': 12,
  'Guelma': 12,
  'Constantine': 11,
  'Médéa': 9,
  'Mostaganem': 11,
  'MSila': 13,
  'Mascara': 12,
  'Ouargla': 16,
  'Oran': 10,
  'El Bayadh': 14,
  'Illizi': 22,
  'Bordj Bou Arréridj': 11,
  'Boumerdès': 8,
  'El Tarf': 13,
  'Tindouf': 20,
  'Tissemsilt': 12,
  'El Oued': 16,
  'Khenchela': 14,
  'Souk Ahras': 13,
  'Tipaza': 8,
  'Mila': 12,
  'Aïn Defla': 10,
  'Naâma': 15,
  'Aïn Témouchent': 11,
  'Ghardaïa': 15,
  'Relizane': 11,
  'Timimoun': 18,
  'Bordj Badji Mokhtar': 22,
  'Ouled Djellal': 14,
  'Béni Abbès': 18,
  'In Salah': 20,
  'In Guezzam': 24,
  'Touggourt': 16,
  'Djanet': 24,
  'El MGhair': 17,
  'El Menia': 16
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shipToHome, setShipToHome] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const calculateTotalPrice = () => {
    let total = mockProduct.basePrice;
    
    if (selectedSize) {
      const size = mockProduct.sizes.find(s => s.name === selectedSize);
      total += size?.modifier || 0;
    }
    
    if (selectedColor) {
      const color = mockProduct.colors.find(c => c.name === selectedColor);
      total += color?.modifier || 0;
    }
    
    if (selectedWilaya) {
      const baseShipping = shippingCosts[selectedWilaya as keyof typeof shippingCosts] || 0;
      const shippingCost = shipToHome ? baseShipping * 1.3 : baseShipping;
      total += shippingCost;
    }
    
    return total;
  };

  const handleImageDotClick = (index: number) => {
    setCurrentImageIndex(index);
    if (galleryRef.current) {
      const targetScroll = index * (galleryRef.current.clientWidth * 0.8);
      galleryRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add order to the store
    appStore.addOrder({
      customerName: fullName,
      customerPhone: phoneNumber,
      wilaya: selectedWilaya,
      commune: selectedCommune,
      fullAddress: `${selectedCommune}, ${selectedWilaya}`,
      productName: mockProduct.name,
      size: selectedSize,
      color: selectedColor,
      totalPrice: calculateTotalPrice(),
      status: 'pending'
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to confirmation page with product data
    navigate('/confirmation', { 
      state: { 
        fromProductType: 't-shirts',
        productId: id,
        productName: mockProduct.name,
        productImage: mockProduct.images[0]
      }
    });
  };

  if (loading) {
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
            <Link to="/products/t-shirts">
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
            {/* Enhanced Image Gallery */}
            <motion.div
              className="relative"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div
                ref={galleryRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide h-96 lg:h-[600px]"
                style={{ scrollBehavior: 'smooth' }}
              >
                {mockProduct.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-80 lg:w-96 h-full relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={image}
                      alt={`${mockProduct.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                ))}
              </div>
              
              {/* Image Pagination */}
              <ImageGalleryPagination
                totalImages={mockProduct.images.length}
                currentIndex={currentImageIndex}
                onDotClick={handleImageDotClick}
              />
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
                  {mockProduct.name}
                </motion.h1>
                
                {/* Average Rating Display */}
                <motion.div
                  className="flex items-center space-x-2 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <StarRating rating={mockProduct.averageRating} readonly size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {mockProduct.averageRating}/5 ({mockProduct.totalReviews} reviews)
                  </span>
                </motion.div>
                
                <motion.p
                  className="text-lg text-muted-foreground mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {mockProduct.description}
                </motion.p>
                
                {/* Enhanced Pricing Display */}
                <motion.div
                  className="flex items-center space-x-4 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <span className="text-2xl text-muted-foreground line-through">
                    ${mockProduct.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold gradient-text">
                    ${mockProduct.basePrice.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    30% OFF
                  </span>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      required
                    >
                      <option value="">Select Size</option>
                      {mockProduct.sizes.map(size => (
                        <option key={size.name} value={size.name}>
                          {size.name} {size.modifier > 0 && `(+$${size.modifier})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      required
                    >
                      <option value="">Select Color</option>
                      {mockProduct.colors.map(color => (
                        <option key={color.name} value={color.name}>
                          {color.name} {color.modifier > 0 && `(+$${color.modifier})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="0555 123 456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Wilaya *</label>
                    <select
                      value={selectedWilaya}
                      onChange={(e) => setSelectedWilaya(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      required
                    >
                      <option value="">Select Wilaya</option>
                      {Object.keys(shippingCosts).map(wilaya => (
                        <option key={wilaya} value={wilaya}>
                          {wilaya} (+${shippingCosts[wilaya as keyof typeof shippingCosts]} shipping)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Advanced Shipping Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="shipToHome"
                        checked={shipToHome}
                        onChange={(e) => setShipToHome(e.target.checked)}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50"
                      />
                      <label htmlFor="shipToHome" className="text-sm font-medium">
                        Ship to my Home Address (+30% shipping cost)
                      </label>
                    </div>

                    {shipToHome && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium mb-2">Daira/Commune *</label>
                        <input
                          type="text"
                          value={selectedCommune}
                          onChange={(e) => setSelectedCommune(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                          placeholder="Enter your commune"
                          required={shipToHome}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Enhanced Submit Button */}
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
                      <span>Place Order (${calculateTotalPrice().toFixed(2)})</span>
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
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={mockProduct.images[currentImageIndex]}
        alt={`${mockProduct.name} - Image ${currentImageIndex + 1}`}
      />
    </div>
  );
};

export default ProductPage;
