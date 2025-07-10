import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Product } from '@/store/appStore';
import GenericCarousel from '@/components/GenericCarousel';
import useEmblaCarousel from 'embla-carousel-react';
import { getClientIp } from '../hooks/useProductData.ts';


// Update the ImageSlide component near the top of the file
const ImageSlide = ({ imageUrl, alt, onImageClick }: { imageUrl: string, alt: string, onImageClick: () => void }) => (
    <div className="relative p-[2px]">
        {/* Gradient border wrapper */}
        <div className="absolute inset-0 rounded-lg bg-gradient-primary dark:bg-gradient-primary-dark"></div>
        
        {/* Image content */}
        <div className="aspect-square bg-background rounded-lg overflow-hidden relative cursor-zoom-in z-10" onClick={onImageClick}>
            <img
                src={imageUrl}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    </div>
);
// Helper Component for Image Gallery


// Helper Component for Product Header
const ProductHeader = ({ product, averageRating, reviewsCount }: { product: any; averageRating: number; reviewsCount: number; }) => (
  <div>
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-3">
       {product.base_price} DA
    </p>
    {product.price_before_discount && product.price_before_discount > product.base_price && (
        <p className="text-lg sm:text-xl text-red-500 line-through">
          {product.price_before_discount} DA
        </p>
      )}
    <div className="flex items-center space-x-0 mb-4">
      <StarRating rating={averageRating} readonly size="md" />
      <span className="text-sm font-medium ml-1">{averageRating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">(تقييم{reviewsCount !== 1 ? 'ات' : ''}{reviewsCount} )</span>
    </div>
    <p className="text-lg font-bold mb-2">وصف المنتج</p>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {product.description}
    </p>
  </div>
);



const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [shipToHome, setShipToHome] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const OrderRef = useRef<HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const { product, loading } = useProductById(productId || '');
  const { shippingData, loading: shippingLoading, error: shippingError } = useShippingData();
  const { addOrder } = useOrders();
  const { reviews, loading: reviewsLoading } = useReviews(productId || '');


  const scrollToOrder = () => {
    OrderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Validate Algerian phone number
  const validateAlgerianPhone = (phone: string): boolean => {
    const algerianPhoneRegex = /^(05|06|07)\d{8}$/;
    return algerianPhoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setCustomerPhone(phoneValue);
    
    if (phoneValue.trim() === '') {
      setPhoneError(null);
    } else if (!validateAlgerianPhone(phoneValue)) {
      setPhoneError('يجب أن يبدأ رقم الهاتف بـ 05 أو 06 أو 07 ويتكون من 10 أرقام');
    } else {
      setPhoneError(null);
    }
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSize(e.target.value);
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setColor(e.target.value);
  
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
    if (!customerName.trim()) return toast.error('الرجاء إدخال الاسم الكامل');
    if (!customerPhone.trim()) return toast.error('الرجاء إدخال رقم الهاتف');
    if (!validateAlgerianPhone(customerPhone)) return toast.error('رقم الهاتف غير صحيح، يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام');
    if (!wilaya.trim()) return toast.error('الرجاء اختيار الولاية');
    if (shipToHome && !commune.trim()) return toast.error('الرجاء اختيار البلدية للتوصيل المنزلي');
    
    // Only validate size and color if they exist in product options
    const hasSizeOptions = product?.options?.sizes && product.options.sizes.length > 0;
    const hasColorOptions = product?.options?.colors && product.options.colors.length > 0;
    
    if (hasSizeOptions && !size) return toast.error('الرجاء اختيار المقاس');
    if (hasColorOptions && !color) return toast.error('الرجاء اختيار اللون');
    
    if (!product) return toast.error('تفاصيل المنتج غير متوفرة');

    setIsPlacingOrder(true);
    try {
      const ipAddress = await getClientIp();

      const orderData = {
        product_id: product.id,
        product_name: product.name,
        ip_address: ipAddress,
        size: product.options?.sizes?.length > 0 ? size : 'لا يوجد',
        color: product.options?.colors?.length > 0 ? color : 'لا يوجد',
        quantity,
        base_price: product.base_price,
        total_price: calculateTotalPrice(),
        customer_name: customerName,
        customer_phone: customerPhone,
        wilaya,
        commune: shipToHome ? commune : 'استلام',
        full_address: shipToHome ? `${commune}, ${wilaya}` : `استلام من ${wilaya}`,
        status: 'pending' as const,
      };
      const newOrder = await addOrder(orderData);
      if (newOrder) {
        navigate('/confirmation', {
          state: {
            fromProductType: product.product_type_id,
            fromProductTypeId: product.product_type_id,
            productId: product.id,
            productName: product.name,
            productImage: product.images?.[0] || product.image_url,
          },
        });
        toast.success('تم تقديم الطلب بنجاح!');
      } else {
        toast.error('فشل في تقديم الطلب');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      if (error instanceof Error && error.message === 'duplicate_order') {
      toast.error('لقد قمت بطلب هذا المنتج مسبقاً خلال الـ 24 ساعة الماضية');
    } else {
      toast.error('حدث خطأ أثناء تقديم الطلب');
    }
  } finally {
    setIsPlacingOrder(false);
  }
  };

  const availableWilayas = Object.keys(shippingData.shippingPrices || {});
  const availableCommunes = wilaya ? shippingData.communes[wilaya] || [] : [];

  if (loading || shippingLoading || reviewsLoading) return <LoadingSpinner />;
  
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
      <div className="sticky top-12 backdrop-blur-sm border-background p-0 sm:p-10 z-40">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">الرجوع</span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-16 py-12 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          

          {/* Right Column: Product Info & Order Form */}
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text capitalize px-2 py-3 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                تفاصيل المنتج
            </motion.h1>
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {product.images?.map((image, index) => (
                  <div key={`main-image-${index}`} className="flex-0 flex-grow-0 shrink-0 w-full">
                    <ImageSlide 
                      imageUrl={image}
                      alt={product.name}
                      onImageClick={() => setIsLightboxOpen(true)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <ImageGalleryPagination
                images={product.images}
                currentIndex={currentImageIndex}
                onIndexChange={(index) => emblaApi?.scrollTo(index)}
                productName={product.name}
              />
            )}
          </motion.div>
            <ProductHeader product={product} averageRating={averageRating} reviewsCount={reviews.length} />
            {/* Left Column: Image Gallery */}
        
            
            <div className="relative p-[0px] w-full">
  {/* Gradient border wrapper */}
  <div className="absolute inset-0 rounded-lg bg-gradient-primary dark:bg-gradient-primary-dark"></div>
  
  {/* Form content */}
  <form onSubmit={handleSubmit} className="w-full space-y-4 p-4 glass-effect rounded-lg relative z-10">
    <motion.section ref={OrderRef}>
      <h3 className="text-lg font-bold">قدم طلبك</h3>
    </motion.section>
              {/* Form fields remain the same */}
              <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم الكامل</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="أدخل اسمك الكامل" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      value={customerPhone} 
                      onChange={handlePhoneChange} 
                      className={`w-full px-3 py-2 rounded-lg border ${phoneError ? 'border-red-500' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm`} 
                      placeholder="مثال: 0599123456" 
                      required 
                    />
                    {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">الولاية</label>
                    <select value={wilaya} onChange={(e) => { setWilaya(e.target.value); setCommune(''); }} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" required>
                      <option value="">اختر الولاية</option>
                      {availableWilayas.map((wilayaName) => (
                        <option key={wilayaName} value={wilayaName}>{wilayaName} ({shippingData.shippingPrices[wilayaName]} دج)</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="shipToHome" checked={shipToHome} onCheckedChange={(checked) => { setShipToHome(checked as boolean); if (!checked) setCommune(''); }} />
                    <label htmlFor="shipToHome" className="text-xs font-medium">التوصيل إلى المنزل (+30% رسوم شحن)</label>
                  </div>
                  {shipToHome && (
                    <div>
                      <label className="block text-xs font-medium mb-1">البلدية (المدينة)</label>
                      <select value={commune} onChange={(e) => setCommune(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" required disabled={!wilaya}>
                        <option value="">اختر البلدية</option>
                        {availableCommunes.map((communeName) => (
                          <option key={communeName} value={communeName}>{communeName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {product.options?.sizes && product.options.sizes.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium mb-1">المقاس</label>
                      <select value={size} onChange={handleSizeChange} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" required={product.options.sizes.length > 0}>
                        <option value="">اختر المقاس</option>
                        {product.options.sizes.map((s, index) => (
                          <option key={index} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {product.options?.colors && product.options.colors.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium mb-1">اللون</label>
                      <select value={color} onChange={handleColorChange} className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" required={product.options.colors.length > 0}>
                        <option value="">اختر اللون</option>
                        {product.options.colors.map((c, index) => (
                          <option key={index} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">الكمية</label>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={decrementQuantity} className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors disabled:opacity-50" disabled={quantity <= 1}>-</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={incrementQuantity} className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">+</button>
                  </div>
                </div>
                {product && wilaya && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2 text-sm">
                    <h4 className="font-semibold">تفاصيل السعر:</h4>
                    <div className="flex justify-between text-xs"><span>السعر الأساسي ({quantity}x):</span><span>{product.base_price * quantity} دج</span></div>
                    <div className="flex justify-between text-xs"><span>الشحن{shipToHome ? ' (توصيل منزلي)' : ''}:</span><span>{calculateShippingCost()} دج</span></div>
                    <div className="flex justify-between font-bold border-t pt-2"><span>المجموع:</span><span>{calculateTotalPrice()} دج</span></div>
                  </div>
                )}
                
                <button  type="submit" disabled={isPlacingOrder} className="w-full btn-gradient py-3 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center justify-center space-x-2">
                  
                  {isPlacingOrder ? (<><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div><span>جاري تقديم الطلب...</span></>) : (<><ShoppingCart  className="w-4 h-4" /><span>تقديم الطلب</span></>)}
                  
                </button>
                

            </form>
            </div>
          </motion.div>
        </div>
        <motion.button 
  onClick={scrollToOrder} 
  className="fixed bottom-4 left-0 right-0 mx-auto z-50 p-2 btn-gradient rounded-full shadow bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-0 w-38 max-w-[120px]" 
  aria-label="كيفية الطلب" 
  initial={{ scale: 0 }} 
  animate={{ 
    scale: [1, 1.1, 1],
    y: [0, -10, 0]
  }} 
  transition={{ 
    delay: 1, 
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse"
  }}
>
  <ShoppingCart className="w-5 h-5 m-1" />
  <span className="font-medium">اطلب الآن</span>
</motion.button>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <motion.div className="mt-8 lg:mt-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="text-xl font-bold mb-4">تقييمات العملاء</h3>
            <div className="space-y-4">
{reviews.map((review) => (
  <div key={review.id} className="relative p-[0px]">
    {/* Gradient border wrapper */}
    <div className="absolute inset-0 rounded-lg bg-gradient-primary dark:bg-gradient-primary-dark"></div>
    
    {/* Review content */}
    <div className="p-2 glass-effect rounded-lg relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex flex-wrap items-center mb-1 sm:mb-0">
          <span className="font-bold mr-2 break-words max-w-[80%]">{review.reviewer_name || 'مجهول'}</span>
          <div className="star-rating-compact -space-x-2">
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
        </div>
        <span className="text-xs text-foreground ">{new Date(review.created_at).toLocaleDateString()}</span>
      </div>
      <p className="text-foreground text-sm ">{review.comment}</p>
    </div>
  </div>
))}
            </div>
          </motion.div>
        )}
      </main>
        
      {/* Image Lightbox */}
      <ImageLightbox
  src={product.images?.[currentImageIndex] || '/placeholder.svg'}
  alt={product.name}
  isOpen={isLightboxOpen}
  onClose={() => setIsLightboxOpen(false)}
/>
    </div>
  );
};

export default ProductPage;


