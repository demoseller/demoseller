import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useProductById, useReviews } from '../hooks/useProductData';
import { useShippingData } from '../hooks/useShippingData';
import { useOrders } from '../hooks/useSupabaseStore';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import { toast } from 'sonner';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { product, loading } = useProductById(id || '');
  const { shippingData } = useShippingData();
  const { addOrder } = useOrders();
  const { reviews, loading: reviewsLoading } = useReviews(id || '');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!size || !color) {
      toast.error('Please select both size and color');
      return;
    }

    if (!product) {
      toast.error('Product details are not available');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        product_type_id: product.product_type_id,
        product_name: product.name,
        size: size,
        color: color,
        quantity: quantity,
        base_price: product.base_price,
        total_price: product.base_price * quantity,
        customer_name: shippingData?.fullName || 'N/A',
        customer_phone: shippingData?.phone || 'N/A',
        wilaya: shippingData?.wilaya || 'N/A',
        commune: shippingData?.commune || 'N/A',
        full_address: shippingData?.address || 'N/A',
        status: 'pending',
        image_url: product.image_url
      };

      const newOrder = await addOrder(orderData);

      if (newOrder) {
        navigate('/confirmation', {
          state: {
            fromProductType: product.product_type_id,
            fromProductTypeId: product.product_type_id,
            productId: product.id,
            productName: product.name,
            productImage: product.image_url
          }
        });
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      toast.error('An error occurred while placing the order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatAverageRating = (rating: number) => {
    return rating.toFixed(1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate(-1)} className="btn-gradient px-4 py-2 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <motion.div
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b p-3 sm:p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="aspect-square bg-muted rounded-lg sm:rounded-xl overflow-hidden">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">{product.name}</h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-3 sm:mb-4">
                {product.base_price} DA
              </p>
              
              {/* Rating Section - Made more responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <StarRating rating={averageRating} readonly size="md" />
                  <span className="text-sm sm:text-base font-medium">
                    {formatAverageRating(averageRating)}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 glass-effect rounded-lg sm:rounded-xl">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm">Easy Returns</span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 p-4 sm:p-6 glass-effect rounded-lg sm:rounded-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Place Your Order</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Size</label>
                  <select
                    value={size}
                    onChange={handleSizeChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Size</option>
                    {product.sizes && product.sizes.map((s, index) => (
                      <option key={index} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Color</label>
                  <select
                    value={color}
                    onChange={handleColorChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Color</option>
                    {product.colors && product.colors.map((c, index) => (
                      <option key={index} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-sm sm:text-base">{quantity}</span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full btn-gradient py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <motion.div
            className="mt-8 sm:mt-12 lg:mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="p-4 glass-effect rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
