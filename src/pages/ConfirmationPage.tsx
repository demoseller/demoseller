import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import StarRating from '../components/StarRating';
import { useReviews } from '../hooks/useProductData';
import { toast } from 'sonner';

const ConfirmationPage = () => {
  const location = useLocation();
  const { fromProductType, fromProductTypeId, productId, productName, productImage } = location.state || {};
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { reviews, loading: reviewsLoading, addReview } = useReviews(productId || '');

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit review called with rating:', rating);
    
    if (rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      await addReview({
        product_id: productId,
        rating: rating,
        comment: comment,
        reviewer_name: reviewerName || 'مجهول'
      });
      
      setReviewSubmitted(true);
      setRating(0);
      setComment('');
      setReviewerName('');
      toast.success('تم إرسال التقييم بنجاح!');
    } catch (error) {
      toast.error('فشل في إرسال التقييم');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    console.log('Rating changed to:', newRating);
    setRating(newRating);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
      <motion.div
        className="w-full max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Success Icon */}
        <motion.div
          className="relative mb-6 sm:mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full opacity-20 animate-pulse-ring"></div>
            <div className="w-full h-full bg-gradient-primary dark:bg-gradient-primary-dark rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          شكراً لك! تم تقديم طلبك.
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          تم تقديم طلبك بنجاح وسيتم شحنه قريباً. ستتلقى مكالمة تأكيد خلال 24 ساعة.
        </motion.p>

        {/* Order Details */}
        <motion.div
          className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-left"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 gradient-text">ما الخطوة التالية؟</h3>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-2 h-2 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>سيتصل بك فريقنا خلال 24 ساعة لتأكيد تفاصيل طلبك</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-2 h-2 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>سيتم تجهيز طلبك وشحنه خلال 2-3 أيام عمل</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-2 h-2 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>ستتلقى معلومات التتبع بمجرد شحن طلبك</span>
            </li>
          </ul>
        </motion.div>

        {/* Reviews Section */}
        {productId && (
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Leave a Review Section */}
            {!reviewSubmitted && (
              <motion.div
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 gradient-text">
                  كيف تقيّم منتجك الجديد؟
                </h3>
                
                {productImage && (
                  <motion.div
                    className="mb-4 sm:mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg mx-auto shadow-lg"
                    />
                    <p className="text-sm sm:text-base md:text-lg font-medium mt-2 sm:mt-3 text-foreground">{productName}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">اسمك (اختياري)</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm sm:text-base"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">تقييمك</label>
                    <div className="flex justify-center">
                      <StarRating
                        rating={rating}
                        onRatingChange={handleRatingChange}
                        size="lg"
                        readonly={false}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">تعليق (اختياري)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm sm:text-base"
                      rows={3}
                      placeholder="شارك تجربتك مع هذا المنتج..."
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={rating === 0 || isSubmittingReview}
                    className="btn-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: rating === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: rating === 0 ? 1 : 0.95 }}
                  >
                    {isSubmittingReview ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>جاري الإرسال...</span>
                      </div>
                    ) : (
                      'إرسال التقييم'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Review Success Message */}
            {reviewSubmitted && (
              <motion.div
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-green-500/10 border-green-500/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base">
                  شكراً على تقييمك! يساعد ذلك العملاء الآخرين على اتخاذ قرارات مستنيرة.
                </p>
              </motion.div>
            )}

            {/* Display Existing Reviews */}
            {!reviewsLoading && reviews.length > 0 && (
              <motion.div
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: reviewSubmitted ? 0.5 : 1.4 }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold">تقييمات العملاء</h3>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <StarRating rating={averageRating} readonly size="sm" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({reviews.length} تقييمات)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 sm:p-4 bg-muted/10 rounded-lg">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-medium text-sm sm:text-base">{review.reviewer_name || 'مجهول'}</span>
                          <StarRating rating={review.rating} readonly size="sm" />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-xs sm:text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {reviews.length > 5 && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 text-center">
                    عرض 5 من {reviews.length} تقييمات
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Continue Shopping Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: reviewSubmitted ? 0.7 : 1.2 }}
        >
          <Link to={`/products/${fromProductTypeId || fromProductType || 't-shirts'}`}>
            <motion.button
              className="btn-gradient flex items-center space-x-2 sm:space-x-3 mx-auto px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>مواصلة التسوق</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional Navigation */}
        <motion.div
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reviewSubmitted ? 0.9 : 1.4 }}
        >
          <Link to="/">
            <motion.span
              className="text-sm sm:text-base text-muted-foreground hover:gradient-text transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              العودة إلى الصفحة الرئيسية
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage;
