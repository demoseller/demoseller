import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, Phone, MapPin, Package, Calendar, Filter } from 'lucide-react';
import { useOrders } from '../../hooks/useAppStore';
import { appStore } from '../../store/appStore';
import OrderFilterModal from './OrderFilterModal';

interface FilterOptions {
  status: 'all' | 'pending' | 'confirmed';
  product: string;
  productType: string;
  wilaya: string;
}

const OrdersTab = () => {
  const orders = useOrders();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    product: '',
    productType: '',
    wilaya: ''
  });

  const toggleOrderStatus = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const newStatus = order.status === 'pending' ? 'confirmed' : 'pending';
      appStore.updateOrderStatus(orderId, newStatus);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (filters.product && !order.productName.toLowerCase().includes(filters.product.toLowerCase())) return false;
    if (filters.wilaya && order.wilaya !== filters.wilaya) return false;
    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'all'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors relative"
          >
            <Filter className="w-4 h-4" />
            <span>Filter Orders</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <div className="text-sm text-muted-foreground">
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            className="glass-effect p-6 rounded-xl border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Customer Details</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {order.customerName}</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <p>{order.wilaya}, {order.commune}</p>
                      <p className="text-muted-foreground text-xs">{order.fullAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Product Details</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Product:</strong> {order.productName}</p>
                  <p><strong>Size:</strong> {order.size}</p>
                  <p><strong>Color:</strong> {order.color}</p>
                  <p><strong>Total:</strong> <span className="text-lg font-bold text-primary">{order.totalPrice} DA</span></p>
                </div>
              </div>

              {/* Order Status & Actions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Order Status</span>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">Status:</span>
                    <button
                      onClick={() => toggleOrderStatus(order.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        order.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Match Your Filters</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filter criteria.</p>
          <button
            onClick={() => setFilters({ status: 'all', product: '', productType: '', wilaya: '' })}
            className="btn-gradient px-6 py-2 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground">Orders will appear here once customers start purchasing.</p>
        </div>
      )}

      <OrderFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default OrdersTab;
