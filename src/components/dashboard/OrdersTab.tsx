
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, Phone, MapPin, Package, Calendar } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  fullAddress: string;
  productName: string;
  size: string;
  color: string;
  totalPrice: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders: Order[] = [
      {
        id: '1',
        customerName: 'Ahmed Benali',
        customerPhone: '+213 555 123 456',
        wilaya: 'Algiers',
        commune: 'Bab Ezzouar',
        fullAddress: '123 Rue de la Liberté, Bab Ezzouar, Algiers',
        productName: 'Premium T-Shirt',
        size: 'L',
        color: 'Blue',
        totalPrice: 2500,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        customerName: 'Fatima Zahra',
        customerPhone: '+213 666 789 012',
        wilaya: 'Oran',
        commune: 'Es Senia',
        fullAddress: '45 Boulevard Mohamed V, Es Senia, Oran',
        productName: 'Designer Hoodie',
        size: 'M',
        color: 'Black',
        totalPrice: 4200,
        status: 'confirmed',
        createdAt: '2024-01-14T14:20:00Z'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const toggleOrderStatus = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: order.status === 'pending' ? 'confirmed' : 'pending' }
        : order
    ));
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="text-sm text-muted-foreground">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order, index) => (
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

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground">Orders will appear here once customers start purchasing.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
