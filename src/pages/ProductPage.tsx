
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useProductById, useReviews, useOrders } from '../hooks/useProductData';
import { useShippingData } from '../hooks/useShippingData';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import { toast } from 'sonner';

const ProductPage = () => {
  const { typeId, id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Use the product ID from the URL params
  const productId = id || '';
  console.log('Product ID from params:', productId);

  const { product, loading } = useProductById(productId);
  const { shippingData } = useShippingData();
  const { addOrder } = useOrders();
  const { reviews, loading: reviewsLoading } = useReviews(productId);

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
        customer_name: 'Ship to Home',
        customer_phone: 'N/A',
        wilaya: 'N/A',
        commune: 'N/A',
        full_address: 'Ship to Home',
        status: 'pending' as const,
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
          <h2 className="text-lg sm:text-xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate(-1)} className="btn-gradient px-4 py-2 rounded-lg text-sm">
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
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b p-2 sm:p-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Product Image */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">
                {product.base_price} DA
              </p>
              
              {/* Rating Section - Mobile optimized */}
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <StarRating rating={averageRating} readonly size="lg" />
                </div>
                <span className="text-sm font-medium ml-1">
                  {formatAverageRating(averageRating)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 glass-effect rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm">Easy Returns</span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 p-3 sm:p-4 glass-effect rounded-lg">
              <h3 className="text-base sm:text-lg font-bold mb-3">Place Your Order</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Size</label>
                  <select
                    value={size}
                    onChange={handleSizeChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  >
                    <option value="">Select Size</option>
                    {product.sizes && product.sizes.map((s, index) => (
                      <option key={index} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Color</label>
                  <select
                    value={color}
                    onChange={handleColorChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
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
                <label className="block text-xs font-medium mb-1">Quantity</label>
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
              
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full btn-gradient py-2.5 sm:py-3 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
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
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Customer Reviews</h3>
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="p-3 glass-effect rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{review.reviewer_name || 'Anonymous'}</span>
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
    </div>
  );
};

export default ProductPage;
