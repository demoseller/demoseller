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
  basePrice: 29.99,
  originalPrice: 42.99, // 30% discount
  averageRating: 4.2,
  reviewCount: 127,
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583743814133-5c9e2c78bb93?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=800&fit=crop'
  ],
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
  const [selectedCommune, setSelectedCommune] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shipToHome, setShipToHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [productRating, setProductRating] = useState(mockProduct.averageRating);
  const [reviewCount, setReviewCount] = useState(mockProduct.reviewCount);
  
  const galleryRef = useRef<HTMLDivElement>(null);

  // Mock communes data
  const communesData: Record<string, string[]> = {
    'Adrar': ['Adrar', 'Tamest', 'Charouine', 'Reggane', 'Inzghmir'],
    'Chlef': ['Chlef', 'Ténès', 'Boukadir', 'El Karimia', 'Sobha'],
    'Laghouat': ['Laghouat', 'Aflou', 'Ksar El Hirane', 'Hassi Delaa', 'Hassi R\'Mel'],
    'Oum El Bouaghi': ['Oum El Bouaghi', 'Aïn Beïda', 'Aïn M\'Lila', 'Sigus', 'Ksar Sbahi'],
    'Batna': ['Batna', 'Barika', 'Arris', 'Biskra', 'Menaâ'],
    'Béjaïa': ['Béjaïa', 'Akbou', 'Kherrata', 'Sidi Aïch', 'Amizour'],
    'Biskra': ['Biskra', 'Tolga', 'Sidi Okba', 'Chetma', 'Djemorah'],
    'Béchar': ['Béchar', 'Kenadsa', 'Abadla', 'Beni Ounif', 'Igli'],
    'Blida': ['Blida', 'Boufarik', 'Larbaa', 'Meftah', 'Soumaa'],
    'Bouira': ['Bouira', 'Lakhdaria', 'M\'Chedallah', 'Sour El Ghouzlane', 'Aïn Bessem'],
    'Tamanrasset': ['Tamanrasset', 'In Salah', 'In Guezzam', 'Tin Zaouatine', 'Idles'],
    'Tébessa': ['Tébessa', 'Cheria', 'El Aouinet', 'Bir El Ater', 'Negrine'],
    'Tlemcen': ['Tlemcen', 'Maghnia', 'Chetouane', 'Nedroma', 'Remchi'],
    'Tiaret': ['Tiaret', 'Sougueur', 'Mahdia', 'Frenda', 'Ksar Chellala'],
    'Tizi Ouzou': ['Tizi Ouzou', 'Azazga', 'Azeffoun', 'Tigzirt', 'Aïn El Hammam'],
    'Alger': ['Alger Centre', 'Bab El Oued', 'Casbah', 'El Madania', 'Sidi M\'Hamed', 'Bir Mourad Raïs', 'Birkhadem', 'El Biar', 'Hydra', 'Kouba'],
    'Djelfa': ['Djelfa', 'Messaâd', 'Hassi Bahbah', 'Aïn Oussara', 'Birine'],
    'Jijel': ['Jijel', 'Ferdjioua', 'Taher', 'El Milia', 'Sidi Maârouf'],
    'Sétif': ['Sétif', 'El Eulma', 'Aïn Oulmen', 'Bougaâ', 'Hammam Sokhna'],
    'Saïda': ['Saïda', 'Balloul', 'Ouled Brahim', 'Sidi Boubekeur', 'El Hassasna'],
    'Skikda': ['Skikda', 'Collo', 'Azzaba', 'Tamalous', 'Oued Z\'hour'],
    'Sidi Bel Abbès': ['Sidi Bel Abbès', 'Telagh', 'Sfisef', 'Ben Badis', 'Mostefa Ben Brahim'],
    'Annaba': ['Annaba', 'El Hadjar', 'Berrahal', 'Chetaibi', 'Aïn Berda'],
    'Guelma': ['Guelma', 'Bouchegouf', 'Héliopolis', 'Hammam Debagh', 'Oued Zenati'],
    'Constantine': ['Constantine', 'Hamma Bouziane', 'Didouche Mourad', 'El Khroub', 'Aïn Smara'],
    'Médéa': ['Médéa', 'Berrouaghia', 'Ksar El Boukhari', 'Ouzera', 'Chellalet El Adhaoura'],
    'Mostaganem': ['Mostaganem', 'Relizane', 'Sidi Ali', 'Hassi Mameche', 'Stidia'],
    'MSila': ['M\'Sila', 'Boussaâda', 'Sidi Aïssa', 'Magra', 'Hammam Dalaa'],
    'Mascara': ['Mascara', 'Sig', 'Mohammadia', 'Tighennif', 'Bouhanifia'],
    'Ouargla': ['Ouargla', 'Hassi Messaoud', 'Touggourt', 'Megarine', 'N\'Goussa'],
    'Oran': ['Oran', 'Bir El Djir', 'Es Senia', 'Gdyel', 'Mers El Kébir', 'Aïn Turk', 'Boutlélis', 'El Braya'],
    'El Bayadh': ['El Bayadh', 'Rogassa', 'Stitten', 'Brezina', 'Boualem'],
    'Illizi': ['Illizi', 'Djanet', 'Bordj Omar Driss', 'Debdeb', 'In Aménas'],
    'Bordj Bou Arréridj': ['Bordj Bou Arréridj', 'Ras El Oued', 'Bordj Ghdir', 'Mansourah', 'El M\'hir'],
    'Boumerdès': ['Boumerdès', 'Dellys', 'Naciria', 'Khemis El Khechna', 'Boudouaou'],
    'El Tarf': ['El Tarf', 'El Kala', 'Bouteldja', 'Ben M\'Hidi', 'Bougous'],
    'Tindouf': ['Tindouf', 'Oum El Assel', 'Hassi El Ghella', 'Chenachene'],
    'Tissemsilt': ['Tissemsilt', 'Theniet El Had', 'Bordj Bou Naama', 'Lazharia', 'Khemisti'],
    'El Oued': ['El Oued', 'Robbah', 'Guemar', 'Reguiba', 'Magrane'],
    'Khenchela': ['Khenchela', 'Babar', 'Bouhmama', 'El Hamma', 'Kais'],
    'Souk Ahras': ['Souk Ahras', 'Sedrata', 'Haddada', 'Ouled Driss', 'Tiffech'],
    'Tipaza': ['Tipaza', 'Koléa', 'Cherchell', 'Hadjout', 'Menaceur'],
    'Mila': ['Mila', 'Ferdjioua', 'Chelghoum Laïd', 'Oued Athmania', 'Rouached'],
    'Aïn Defla': ['Aïn Defla', 'Khemis Miliana', 'El Attaf', 'Boumedfaa', 'Djelida'],
    'Naâma': ['Naâma', 'Mécheria', 'Aïn Sefra', 'Tiout', 'Sfissifa'],
    'Aïn Témouchent': ['Aïn Témouchent', 'Hammam Bou Hadjar', 'Beni Saf', 'El Malah', 'Ouled Kihal'],
    'Ghardaïa': ['Ghardaïa', 'El Menea', 'Berriane', 'Metlili', 'El Guerrara'],
    'Relizane': ['Relizane', 'Mazouna', 'Oued Rhiou', 'Yellel', 'Sidi Khettab'],
    'Timimoun': ['Timimoun', 'Aougrout', 'Deldoul', 'Charouine', 'Metarfa'],
    'Bordj Badji Mokhtar': ['Bordj Badji Mokhtar', 'Timiaouine', 'Timokten'],
    'Ouled Djellal': ['Ouled Djellal', 'Sidi Khaled', 'Besbes', 'Chaiba'],
    'Béni Abbès': ['Béni Abbès', 'Tamtert', 'Ouled Khoudir', 'El Ouata'],
    'In Salah': ['In Salah', 'Foggaret Ezzouia', 'In Ghar'],
    'In Guezzam': ['In Guezzam', 'Tin Zaouatine'],
    'Touggourt': ['Touggourt', 'Megarine', 'Sidi Slimane', 'Nezla'],
    'Djanet': ['Djanet', 'Bordj El Haoues'],
    'El MGhair': ['El MGhair', 'Djamaa', 'Sidi Amrane'],
    'El Menia': ['El Menia', 'Hassi Gara', 'Hassi El Fejej']
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll-based image index update
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const scrollLeft = galleryRef.current.scrollLeft;
        const imageWidth = galleryRef.current.scrollWidth / mockProduct.images.length;
        const newIndex = Math.round(scrollLeft / imageWidth);
        setCurrentImageIndex(Math.max(0, Math.min(newIndex, mockProduct.images.length - 1)));
      }
    };

    const galleryElement = galleryRef.current;
    if (galleryElement) {
      galleryElement.addEventListener('scroll', handleScroll);
      return () => galleryElement.removeEventListener('scroll', handleScroll);
    }
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
      let shippingCost = shippingCosts[selectedWilaya as keyof typeof shippingCosts] || 0;
      // Add 30% to shipping if home delivery is selected
      if (shipToHome) {
        shippingCost = shippingCost * 1.3;
      }
      total += shippingCost;
    }
    
    return total;
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
    if (galleryRef.current) {
      const imageWidth = galleryRef.current.scrollWidth / mockProduct.images.length;
      galleryRef.current.scrollTo({
        left: imageWidth * index,
        behavior: 'smooth'
      });
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
      fullAddress: `${selectedWilaya}${selectedCommune ? `, ${selectedCommune}` : ''}`,
      productName: mockProduct.name,
      size: selectedSize,
      color: selectedColor,
      totalPrice: calculateTotalPrice(),
      status: 'pending'
    });
    
    // Simulate customer review submission and update rating
    const newRating = Math.random() * 2 + 3; // Random rating between 3-5
    const newAverageRating = ((productRating * reviewCount) + newRating) / (reviewCount + 1);
    setProductRating(newAverageRating);
    setReviewCount(reviewCount + 1);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to confirmation page with product info
    navigate('/confirmation', { 
      state: { 
        fromProductType: 't-shirts',
        productId: mockProduct.id,
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
                {mockProduct.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-80 lg:w-96 h-full relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleImageClick(image)}
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
              
              {/* Image Pagination Dots */}
              <ImageGalleryPagination
                images={mockProduct.images}
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
                  {mockProduct.name}
                </motion.h1>

                {/* Star Rating Display */}
                <motion.div
                  className="flex items-center space-x-2 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <StarRating 
                    rating={productRating} 
                    readonly 
                    showText 
                  />
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} reviews)
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
                
                {/* Pricing with Discount */}
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl text-muted-foreground line-through">
                      ${mockProduct.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-3xl font-bold gradient-text">
                      ${mockProduct.basePrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      30% OFF
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: ${calculateTotalPrice().toFixed(2)} (including options & shipping)
                  </p>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
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
                    <label className="block text-sm font-medium mb-2 text-foreground">Color</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
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
                        setSelectedCommune(''); // Reset commune when wilaya changes
                      }}
                      className="w-full bg-background border border-border text-foreground rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      required
                    >
                      <option value="">Select Wilaya</option>
                      {Object.keys(shippingCosts).map(wilaya => {
                        const baseCost = shippingCosts[wilaya as keyof typeof shippingCosts];
                        const finalCost = shipToHome ? baseCost * 1.3 : baseCost;
                        return (
                          <option key={wilaya} value={wilaya}>
                            {wilaya} (+${finalCost.toFixed(2)} shipping)
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

                    {shipToHome && selectedWilaya && communesData[selectedWilaya] && (
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
                          {communesData[selectedWilaya].map(commune => (
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
        src={lightboxImage}
        alt={mockProduct.name}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default ProductPage;
