
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

const ConfirmationPage = () => {
  const location = useLocation();
  const fromProductType = location.state?.fromProductType || 't-shirts';

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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
          Order Confirmed!
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Thank you for your order! Your item has been successfully placed and will be shipped soon. 
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

        {/* Continue Shopping Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link to={`/products/${fromProductType}`}>
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
          transition={{ delay: 1.2 }}
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
