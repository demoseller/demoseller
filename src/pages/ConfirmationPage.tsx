
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
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      await addReview({
        product_id: productId,
        rating: rating,
        comment: comment,
        reviewer_name: reviewerName || 'Anonymous'
      });
      
      setReviewSubmitted(true);
      setRating(0);
      setComment('');
      setReviewerName('');
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle star rating change WITHOUT auto-submitting
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    // Don't auto-submit here, just update the rating state
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Success Icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full opacity-20 animate-pulse-ring"></div>
            <div className="w-full h-full bg-gradient-primary dark:bg-gradient-primary-dark rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold gradient-text mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Thank You! Your order has been placed.
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Your item has been successfully placed and will be shipped soon. 
          You'll receive a confirmation call within 24 hours.
        </motion.p>

        {/* Order Details */}
        <motion.div
          className="glass-effect rounded-2xl p-6 mb-8 text-left"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold mb-4 gradient-text">What's Next?</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full mt-2 flex-shrink-0"></div>
              <span>Our team will contact you within 24 hours to confirm your order details</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full mt-2 flex-shrink-0"></div>
              <span>Your order will be prepared and shipped within 2-3 business days</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full mt-2 flex-shrink-0"></div>
              <span>You'll receive tracking information once your order ships</span>
            </li>
          </ul>
        </motion.div>

        {/* Reviews Section */}
        {productId && (
          <div className="space-y-6 mb-8">
            {/* Leave a Review Section */}
            {!reviewSubmitted && (
              <motion.div
                className="glass-effect rounded-2xl p-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <h3 className="text-2xl font-semibold mb-6 gradient-text">
                  How would you rate your new product?
                </h3>
                
                {productImage && (
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-32 h-32 object-cover rounded-lg mx-auto shadow-lg"
                    />
                    <p className="text-lg font-medium mt-3 text-foreground">{productName}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
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
                    <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      rows={3}
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={rating === 0 || isSubmittingReview}
                    className="btn-gradient px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: rating === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: rating === 0 ? 1 : 0.95 }}
                  >
                    {isSubmittingReview ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Review'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Review Success Message */}
            {reviewSubmitted && (
              <motion.div
                className="glass-effect rounded-2xl p-6 bg-green-500/10 border-green-500/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  Thank you for your review! It helps other customers make informed decisions.
                </p>
              </motion.div>
            )}

            {/* Display Existing Reviews */}
            {!reviewsLoading && reviews.length > 0 && (
              <motion.div
                className="glass-effect rounded-2xl p-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: reviewSubmitted ? 0.5 : 1.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={averageRating} readonly size="sm" />
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-4 bg-muted/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                          <StarRating rating={review.rating} readonly size="sm" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {reviews.length > 5 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Showing 5 of {reviews.length} reviews
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
              className="btn-gradient flex items-center space-x-3 mx-auto px-8 py-4 text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional Navigation */}
        <motion.div
          className="mt-8 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reviewSubmitted ? 0.9 : 1.4 }}
        >
          <Link to="/">
            <motion.span
              className="text-muted-foreground hover:gradient-text transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              Return to Home
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage;
