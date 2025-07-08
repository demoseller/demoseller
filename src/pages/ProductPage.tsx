import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductById, useReviews, useOrders } from '../hooks/useProductData';
import { useShippingData } from '../hooks/useShippingData';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import ImageGalleryPagination from '../components/ImageGalleryPagination';
import ImageLightbox from '../components/ImageLightbox';
import Navbar from '../components/Navbar';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [shipToHome, setShipToHome] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { product, loading } = useProductById(productId || '');
  const { shippingData, loading: shippingLoading, error: shippingError } = useShippingData();
  const { addOrder } = useOrders();
  const { reviews, loading: reviewsLoading } = useReviews(productId || '');

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Calculate shipping cost based on "Ship to Home" option
  const calculateShippingCost = () => {
    if (!wilaya || !shippingData.shippingPrices[wilaya]) return 0;
    const baseShippingPrice = shippingData.shippingPrices[wilaya];
    return shipToHome ? Math.round(baseShippingPrice * 1.3) : baseShippingPrice;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!product) return 0;
    const basePrice = product.base_price * quantity;
    const shippingCost = calculateShippingCost();
    return basePrice + shippingCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting order submission...');

    if (!customerName.trim()) {
      toast.error('الرجاء إدخال الاسم الكامل');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('الرجاء إدخال رقم الهاتف');
      return;
    }
    if (!wilaya.trim()) {
      toast.error('الرجاء اختيار الولاية');
      return;
    }
    if (shipToHome && !commune.trim()) {
      toast.error('الرجاء اختيار البلدية للتوصيل المنزلي');
      return;
    }
    if (!size || !color) {
      toast.error('الرجاء اختيار المقاس واللون');
      return;
    }
    if (!product) {
      toast.error('تفاصيل المنتج غير متوفرة');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        product_name: product.name,
        size: size,
        color: color,
        quantity: quantity,
        base_price: product.base_price,
        total_price: calculateTotalPrice(),
        customer_name: customerName,
        customer_phone: customerPhone,
        wilaya: wilaya,
        commune: shipToHome ? commune : 'استلام',
        full_address: shipToHome ? `${commune}, ${wilaya}` : `استلام من ${wilaya}`,
        status: 'pending' as const
      };

      console.log('Order data:', orderData);
      const newOrder = await addOrder(orderData);
      console.log('Order created:', newOrder);

      if (newOrder) {
        navigate('/confirmation', {
          state: {
            fromProductType: product.product_type_id,
            fromProductTypeId: product.product_type_id,
            productId: product.id,
            productName: product.name,
            productImage: product.images?.[0] || product.image_url
          }
        });
        toast.success('تم تقديم الطلب بنجاح!');
      } else {
        toast.error('فشل في تقديم الطلب');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('حدث خطأ أثناء تقديم الطلب');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatAverageRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Get available wilayas from shipping data
  const availableWilayas = Object.keys(shippingData.shippingPrices || {});
  const availableCommunes = wilaya ? shippingData.communes[wilaya] || [] : [];

  if (loading || shippingLoading) {
    return <LoadingSpinner />;
  }

  if (shippingError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
        <Navbar />
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold mb-4">خطأ في تحميل بيانات الشحن</h2>
          <p className="text-muted-foreground mb-4">{shippingError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-gradient px-4 py-2 rounded-lg text-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
        <Navbar />
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold mb-4">المنتج غير موجود</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-gradient px-4 py-2 rounded-lg text-sm"
          >
            الرجوع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Back Button */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-12 backdrop-blur-sm border-background p-5 sm:p-2"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">الرجوع</span>
        </button>
      </motion.div>

      <div className="max-w-5xl mx-auto px-1 sm:px-4 py-3 sm:py-4 md:py-6">
        {/* Mobile: Product Info First */}
        <div className="block lg:hidden mb-4">
          <motion.div 
            className="space-y-3 sm:space-y-4" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">
                {product.base_price} دج
              </p>
              
              {/* Rating Section */}
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <StarRating rating={averageRating} readonly size="lg" />
                </div>
                <span className="text-sm font-medium ml-1">
                  {formatAverageRating(averageRating)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({reviews.length} تقييم{reviews.length !== 1 ? 'ات' : ''})
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {product.description}
              </p>
            </div>

            {/* Size and Color Information */}
            <div className="space-y-3 p-3 sm:p-4 glass-effect rounded-lg">
              <h3 className="text-base font-semibold mb-2">الخيارات المتاحة</h3>
              
              <div>
                <h4 className="text-sm font-medium mb-2">المقاسات المتاحة:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.map((s, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">الألوان المتاحة:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors && product.colors.map((c, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {/* Left Column - Image Gallery and Order Form */}
          <motion.div 
            className="space-y-4" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
          >
            {/* Image Gallery */}
            <div className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                <img 
                  src={product.images?.[currentImageIndex] || product.image_url || '/placeholder.svg'} 
                  alt={product.name} 
                  className="w-full h-full object-cover cursor-zoom-in" 
                  onClick={() => setIsLightboxOpen(true)} 
                />
                
                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage} 
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextImage} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image Pagination */}
              {product.images && product.images.length > 1 && (
                <ImageGalleryPagination 
                  images={product.images} 
                  currentIndex={currentImageIndex} 
                  onIndexChange={setCurrentImageIndex} 
                />
              )}
            </div>

            {/* Order Form - Centered on Mobile */}
            <div className="flex justify-center lg:justify-start">
              <form onSubmit={handleSubmit} className="w-full max-w-md lg:max-w-none space-y-3 sm:space-y-4 p-3 sm:p-4 glass-effect rounded-lg">
                <h3 className="text-base sm:text-lg font-bold mb-3">قدم طلبك</h3>
                
                {/* Customer Information */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم الكامل</label>
                    <input 
                      type="text" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" 
                      placeholder="أدخل اسمك الكامل" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" 
                      placeholder="أدخل رقم هاتفك" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">الولاية</label>
                    <select 
                      value={wilaya} 
                      onChange={(e) => {
                        setWilaya(e.target.value);
                        setCommune(''); // Reset commune when wilaya changes
                      }} 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" 
                      required
                    >
                      <option value="">اختر الولاية</option>
                      {availableWilayas.map((wilayaName) => (
                        <option key={wilayaName} value={wilayaName}>
                          {wilayaName} ({shippingData.shippingPrices[wilayaName]} دج)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ship to Home Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shipToHome" 
                      checked={shipToHome} 
                      onCheckedChange={(checked) => {
                        setShipToHome(checked as boolean);
                        if (!checked) {
                          setCommune(''); // Clear commune if unchecking
                        }
                      }} 
                    />
                    <label htmlFor="shipToHome" className="text-xs font-medium">
                      التوصيل إلى المنزل (+30% رسوم شحن)
                    </label>
                  </div>

                  {/* Commune field - only show when Ship to Home is checked */}
                  {shipToHome && (
                    <div>
                      <label className="block text-xs font-medium mb-1">البلدية (المدينة)</label>
                      <select 
                        value={commune} 
                        onChange={(e) => setCommune(e.target.value)} 
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" 
                        required 
                        disabled={!wilaya}
                      >
                        <option value="">اختر البلدية</option>
                        {availableCommunes.map((communeName) => (
                          <option key={communeName} value={communeName}>
                            {communeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">المقاس</label>
                    <select 
                      value={size} 
                      onChange={handleSizeChange} 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" 
                      required
                    >
                      <option value="">اختر المقاس</option>
                      {product.sizes && product.sizes.map((s, index) => (
                        <option key={index} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">اللون</label>
                    <select 
                      value={color} 
                      onChange={handleColorChange} 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" 
                      required
                    >
                      <option value="">اختر اللون</option>
                      {product.colors && product.colors.map((c, index) => (
                        <option key={index} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">الكمية</label>
                  <div className="flex items-center space-x-3">
                    <button 
                      type="button" 
                      onClick={decrementQuantity} 
                      className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-sm">{quantity}</span>
                    <button 
                      type="button" 
                      onClick={incrementQuantity} 
                      className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                {product && wilaya && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <h4 className="text-sm font-semibold">تفاصيل السعر:</h4>
                    <div className="flex justify-between text-xs">
                      <span>السعر الأساسي ({quantity}x):</span>
                      <span>{product.base_price * quantity} دج</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>الشحن{shipToHome ? ' (توصيل منزلي)' : ''}:</span>
                      <span>{calculateShippingCost()} دج</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                      <span>المجموع:</span>
                      <span>{calculateTotalPrice()} دج</span>
                    </div>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isPlacingOrder} 
                  className="w-full btn-gradient py-2.5 sm:py-3 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>جاري تقديم الطلب...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>تقديم الطلب</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Product Information (Desktop Only) */}
          <motion.div 
            className="hidden lg:block space-y-3 sm:space-y-4" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">
                {product.base_price} دج
              </p>
              
              {/* Rating Section */}
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <StarRating rating={averageRating} readonly size="lg" />
                </div>
                <span className="text-sm font-medium ml-1">
                  {formatAverageRating(averageRating)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({reviews.length} تقييم{reviews.length !== 1 ? 'ات' : ''})
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size and Color Information */}
            <div className="space-y-3 p-3 sm:p-4 glass-effect rounded-lg">
              <h3 className="text-base font-semibold mb-2">الخيارات المتاحة</h3>
              
              <div>
                <h4 className="text-sm font-medium mb-2">المقاسات المتاحة:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.map((s, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">الألوان المتاحة:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors && product.colors.map((c, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <motion.div 
            className="mt-6 sm:mt-8" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">تقييمات العملاء</h3>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="p-3 glass-effect rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{review.reviewer_name || 'مجهول'}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox 
        src={product.images?.[currentImageIndex] || product.image_url || '/placeholder.svg'} 
        alt={product.name} 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </div>
  );
};

export default ProductPage;
