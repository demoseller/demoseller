import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { useProducts } from '../hooks/useSupabaseStore';
import { useShippingData } from '../hooks/useShippingData';
import { useOrders } from '../hooks/useProductData';
import { toast } from 'sonner';
const ProductPage = () => {
  const {
    typeId,
    productId
  } = useParams();
  const navigate = useNavigate();
  const {
    products,
    loading: productsLoading
  } = useProducts();
  const {
    shippingData,
    loading: shippingLoading
  } = useShippingData();
  const {
    addOrder
  } = useOrders();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const product = products.find(p => p.id === productId);
  useEffect(() => {
    if (product && product.options.sizes.length > 0) {
      setSelectedSize(product.options.sizes[0].name);
    }
    if (product && product.options.colors.length > 0) {
      setSelectedColor(product.options.colors[0].name);
    }
  }, [product]);
  const selectedSizeOption = product?.options.sizes.find(s => s.name === selectedSize);
  const selectedColorOption = product?.options.colors.find(c => c.name === selectedColor);
  const shippingPrice = selectedWilaya ? shippingData.shippingPrices[selectedWilaya] || 0 : 0;
  const totalPrice = product ? product.base_price + (selectedSizeOption?.priceModifier || 0) + (selectedColorOption?.priceModifier || 0) + shippingPrice : 0;
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!customerName.trim() || !customerPhone.trim() || !selectedWilaya || !selectedCommune || !fullAddress.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await addOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        wilaya: selectedWilaya,
        commune: selectedCommune,
        full_address: fullAddress,
        product_name: product.name,
        size: selectedSize,
        color: selectedColor,
        total_price: totalPrice,
        status: 'pending'
      });
      navigate('/confirmation', {
        state: {
          fromProductType: typeId,
          fromProductTypeId: typeId,
          // Pass the actual type ID
          productId: product.id,
          productName: product.name,
          productImage: product.images[0]
        }
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (productsLoading || shippingLoading) {
    return <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to={`/products/${typeId}`}>
              <button className="btn-gradient px-6 py-3 rounded-lg">
                Back to Products
              </button>
            </Link>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div className="mb-6" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }}>
          <Link to={`/products/${typeId}`}>
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </button>
          </Link>
        </motion.div>

        {/* Product Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <motion.img src={product.images[selectedImageIndex]} alt={product.name} className="w-full rounded-lg shadow-lg" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3
          }} />
            <div className="flex mt-4 space-x-2 overflow-auto">
              {product.images.map((image, index) => <motion.div key={index} className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${index === selectedImageIndex ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedImageIndex(index)} whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.95
            }}>
                  <img src={image} alt={`${product.name} - ${index}`} className="w-full h-full object-cover" />
                </motion.div>)}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <motion.h1 className="text-3xl font-bold gradient-text" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.2
          }}>
              {product.name}
            </motion.h1>
            <motion.p className="text-muted-foreground leading-relaxed" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.3
          }}>
              {product.description}
            </motion.p>
            <motion.div className="flex items-center space-x-2" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.4
          }}>
              <StarRating rating={4.5} readonly size="sm" />
              <span className="text-sm text-muted-foreground">
                (4.5/5 - 24 ratings)
              </span>
            </motion.div>
            <motion.div className="text-2xl font-semibold" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.5
          }}>
              Price: <span className="gradient-text">{product.base_price} DA</span>
            </motion.div>

            {/* Size Options */}
            {product.options.sizes.length > 0 && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.6
          }}>
                <h4 className="text-lg font-semibold mb-2">Size:</h4>
                <div className="flex space-x-2">
                  {product.options.sizes.map(size => <button key={size.name} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSize === size.name ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 hover:bg-muted'}`} onClick={() => setSelectedSize(size.name)}>
                      {size.name} {size.priceModifier > 0 ? `(+${size.priceModifier} DA)` : ''}
                    </button>)}
                </div>
              </motion.div>}

            {/* Color Options */}
            {product.options.colors.length > 0 && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.7
          }}>
                <h4 className="text-lg font-semibold mb-2">Color:</h4>
                <div className="flex space-x-2">
                  {product.options.colors.map(color => <button key={color.name} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedColor === color.name ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 hover:bg-muted'}`} onClick={() => setSelectedColor(color.name)}>
                      {color.name} {color.priceModifier > 0 ? `(+${color.priceModifier} DA)` : ''}
                    </button>)}
                </div>
              </motion.div>}
          </div>
        </div>

        {/* Order Form */}
        <motion.div className="glass-effect rounded-2xl p-8 mt-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <h2 className="text-2xl font-semibold mb-6 gradient-text">Order Information</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Enter your phone number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Wilaya</label>
              <select value={selectedWilaya} onChange={e => setSelectedWilaya(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="">Select Wilaya</option>
                {Object.keys(shippingData.shippingPrices).map(wilaya => <option key={wilaya} value={wilaya}>{wilaya}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Commune</label>
              <select value={selectedCommune} onChange={e => setSelectedCommune(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" disabled={!selectedWilaya}>
                <option value="">Select Commune</option>
                {selectedWilaya && shippingData.communes[selectedWilaya] ? shippingData.communes[selectedWilaya].map(commune => <option key={commune} value={commune}>{commune}</option>) : <option value="" disabled>Select Wilaya First</option>}
              </select>
            </div>
            <div className="hidden ">
              <label className="block text-sm font-medium mb-2">Full Address</label>
              <textarea value={fullAddress} onChange={e => setFullAddress(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" rows={3} placeholder="Enter your full address" />
            </div>

            {/* Order Summary */}
            <div className="py-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Base Price:</span>
                <span>{product.base_price} DA</span>
              </div>
              {selectedSizeOption && <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Size ({selectedSize}):</span>
                  <span>{selectedSizeOption.priceModifier} DA</span>
                </div>}
              {selectedColorOption && <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Color ({selectedColor}):</span>
                  <span>{selectedColorOption.priceModifier} DA</span>
                </div>}
              {selectedWilaya && <div className="flex justify-between items-center">
                  <span className="font-medium">Shipping to {selectedWilaya}:</span>
                  <span>{shippingPrice} DA</span>
                </div>}
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold gradient-text">{totalPrice} DA</span>
              </div>
            </div>

            <motion.button type="submit" disabled={isSubmitting} className="btn-gradient w-full px-6 py-3 rounded-lg font-semibold" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              {isSubmitting ? <div className="flex items-center justify-center space-x-2">
                  <RotateCcw className="animate-spin w-4 h-4" />
                  <span>Processing...</span>
                </div> : <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span>Place Order</span>
                </>}
            </motion.button>
          </form>
        </motion.div>

        {/* Guarantee Section */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }}>
          <div className="glass-effect rounded-2xl p-6">
            <Truck className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-1">Fast Shipping</h3>
            <p className="text-muted-foreground text-sm">
              Enjoy fast and reliable shipping on all orders.
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <Shield className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-1">Secure Payments</h3>
            <p className="text-muted-foreground text-sm">
              We guarantee secure payment processing for your peace of mind.
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <RotateCcw className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-1">Easy Returns</h3>
            <p className="text-muted-foreground text-sm">
              Not satisfied? Return your order within 30 days for a full refund.
            </p>
          </div>
        </motion.div>
      </div>
    </div>;
};
export default ProductPage;