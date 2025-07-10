import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, Phone, MapPin, Package, Calendar, Filter, Trash2 } from 'lucide-react';
import { useOrders } from '../../hooks/useSupabaseStore';
import OrderFilterModal from './OrderFilterModal';
import { toast } from 'sonner';

interface FilterOptions {
  status: 'all' | 'pending' | 'confirmed';
  product: string;
  productType: string;
  wilaya: string;
}

const OrdersTab = () => {
  const { orders, loading, updateOrderStatus, deleteOrder } = useOrders();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    product: '',
    productType: '',
    wilaya: ''
  });

  const toggleOrderStatus = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const newStatus = order.status === 'pending' ? 'confirmed' : 'pending';
      await updateOrderStatus(orderId, newStatus);
    }
  };

  const handleDeleteOrder = async (orderId: string, customerName: string) => {
    if (window.confirm(`هل أنت متأكد أنك تريد حذف طلب ${customerName}؟`)) {
      try {
        const success = await deleteOrder(orderId);
        if (success) {
          toast.success('تم حذف الطلب بنجاح');
        } else {
          toast.error('فشل حذف الطلب');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('حدث خطأ أثناء حذف الطلب');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (filters.product && order.product_name !== filters.product) return false;
    if (filters.wilaya && order.wilaya !== filters.wilaya) return false;
    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'all'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">إدارة الطلبات</h2>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors relative text-sm"
          >
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>تصفية</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            {filteredOrders.length} من {orders.length} طلبات
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              className="relative p-[3px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Gradient border wrapper */}
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
              
              {/* Card content */}
              <div className="glass-effect p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl relative z-10 bg-card dark:bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Customer Info */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">تفاصيل العميل</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><strong>الاسم:</strong> {order.customer_name}</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      <a href={`tel:${order.customer_phone}`} className="hover:underline">{order.customer_phone}</a>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />
                      <div>
                        <p>{order.wilaya}, {order.commune}</p>
                        <p className="text-muted-foreground text-xs">{order.full_address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">تفاصيل المنتج</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><strong>المنتج:</strong> {order.product_name}</p>
                    <p><strong>المقاس:</strong> {order.size}</p>
                    <p><strong>اللون:</strong> {order.color}</p>
                    <p><strong>الإجمالي:</strong> <span className="text-base sm:text-lg font-bold text-primary">{order.total_price} دج</span></p>
                  </div>
                </div>

                {/* Order Status & Actions */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">حالة الطلب</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-xs sm:text-sm">الحالة:</span>
                        <button
                          onClick={() => toggleOrderStatus(order.id)}
                          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-colors ${
                            order.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {order.status === 'confirmed' ? 'مؤكد' : order.status === 'pending' ? 'قيد الانتظار' : order.status}
                        </button>
                      </div>
                      
                      <motion.button
                        onClick={() => handleDeleteOrder(order.id, order.customer_name)}
                        className="p-1.5 sm:p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="relative p-[3px] max-w-lg mx-auto">
          {/* Gradient border wrapper */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
          
          {/* Card content */}
          <div className="text-center py-12 relative z-10 bg-card dark:bg-card rounded-lg sm:rounded-xl">
            <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات تطابق فلاتر البحث</h3>
            <p className="text-muted-foreground mb-4">حاول تعديل معايير التصفية الخاصة بك.</p>
            <button
              onClick={() => setFilters({ status: 'all', product: '', productType: '', wilaya: '' })}
              className="btn-gradient px-6 py-2 rounded-lg"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      ) : (
        <div className="relative p-[3px] max-w-lg mx-auto">
          {/* Gradient border wrapper */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
          
          {/* Card content */}
          <div className="text-center py-12 relative z-10 bg-card dark:bg-card rounded-lg sm:rounded-xl">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لم يتم استلام أي طلبات بعد.</h3>
            <p className="text-muted-foreground">عندما يقوم العميل بتقديم طلب، سيظهر هنا.</p>
          </div>
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
