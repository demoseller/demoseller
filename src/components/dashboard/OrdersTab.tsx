import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, Phone, MapPin, Package, Calendar, Filter, Trash2, ChevronDown } from 'lucide-react';
import { useOrders } from '../../hooks/useSupabaseStore';
import OrderFilterModal from './OrderFilterModal';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { format } from 'date-fns'; // <-- Import the format function


// This is now the single source of truth for this type.
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface FilterOptions {
  status?: OrderStatus;
  product: string;
  productType: string;
  wilaya: string;
}

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  returned: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
};
const statusTranslations: Record<OrderStatus, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    processing: 'جاري التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغاة',
    returned: 'مسترجع',
};


const OrdersTab = () => {
  const { orders, loading, updateOrderStatus, deleteOrder } = useOrders();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    product: '',
    productType: '',
    wilaya: ''
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    toast.success('تم تحديث حالة الطلب بنجاح');
  };

  const formatDate = (dateString: string) => {
    // Use the format function for consistent output
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
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

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.product && order.product_name !== filters.product) return false;
    if (filters.wilaya && order.wilaya !== filters.wilaya) return false;
    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const renderContent = () => {
    if (filteredOrders.length > 0) {
      return (
        <div className="grid gap-3 sm:gap-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              className="relative p-[3px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
              
              <div className="glass-effect p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl relative z-10 bg-card dark:bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">تفاصيل العميل</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
<div className="flex justify-between items-center">
                  <span className="font-bold ml-auto">{order.customer_name}</span>
                  <strong className="ml-2"> : الإسم</strong>
                </div> 
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

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">تفاصيل المنتج</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                  <span className="font-bold ml-auto">{order.product_name}</span>
                  <strong className="ml-2"> : المنتج</strong>
                    </div>
                  <div className="flex justify-between items-center">
                  <span className="font-bold ml-auto">{order.quantity}</span>
                  <strong className="ml-2"> : الكمية</strong>
                    </div>
                
                
                    <div className="flex justify-between items-center">
                  <span className="font-bold ml-auto">{order.size}</span>
                  <strong className="ml-2"> : المقاس</strong>
                    </div>
                    <div className="flex justify-between items-center">
                  <span className="font-bold ml-auto">{order.color}</span>
                  <strong className="ml-2"> : اللون</strong>
                    </div>
                    <p><strong>الإجمالي:</strong> <span className="text-base sm:text-lg font-bold text-primary">{order.total_price} دج</span></p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">حالة الطلب</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${statusColors[order.status]}`}>
                            {statusTranslations[order.status]}
                            <ChevronDown className="w-3 h-3" />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusOptions.map(status => (
                            <DropdownMenuItem key={status} onClick={() => handleStatusChange(order.id, status)}>
                              {statusTranslations[status]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
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
      );
    }

    if (orders.length > 0) {
      return (
        <div className="relative p-[3px] max-w-lg mx-auto">
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
          <div className="text-center py-12 relative z-10 bg-card dark:bg-card rounded-lg sm:rounded-xl">
            <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات تطابق فلاتر البحث</h3>
            <p className="text-muted-foreground mb-4">حاول تعديل معايير التصفية الخاصة بك.</p>
            <button
              onClick={() => setFilters({ product: '', productType: '', wilaya: '' })}
              className="btn-gradient px-6 py-2 rounded-lg"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative p-[3px] max-w-lg mx-auto">
        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
        <div className="text-center py-12 relative z-10 bg-card dark:bg-card rounded-lg sm:rounded-xl">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لم يتم استلام أي طلبات بعد.</h3>
          <p className="text-muted-foreground">عندما يقوم العميل بتقديم طلب، سيظهر هنا.</p>
        </div>
      </div>
    );
  };


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
      
      {renderContent()}

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