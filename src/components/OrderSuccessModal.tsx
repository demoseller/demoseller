import { motion } from 'framer-motion';
import { CheckCircle, Package, User, Phone, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface OrderDetails {
  product_name: string;
  quantity: number;
  size: string;
  color: string;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  full_address: string;
}

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails | null;
}

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }: OrderSuccessModalProps) => {
  if (!isOpen || !orderDetails) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-background rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        <div className="p-[2px] rounded-2xl bg-gradient-primary dark:bg-gradient-primary-dark">
            <div className="bg-background rounded-2xl p-6 sm:p-8">

                <div className="text-center mb-6">
                    <motion.div
                        className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2"> !تم استلام طلبك بنجاح</h2>
                    
                </div>

                <div className="space-y-4 text-sm text-right">
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Package className="w-4 h-4 text-primary"/> تفاصيل المنتج</h3>
                        <div className="  p-2 bg-muted/50 rounded-lg space-y-0">
                           <div className="flex justify-end">{orderDetails.product_name} <strong>    :المنتج</strong> </div> 
                            <p><strong>الكمية:</strong> {orderDetails.quantity}</p>
                            <p><strong>المقاس:</strong> {orderDetails.size}</p>
                            <p><strong>اللون:</strong> {orderDetails.color}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary"/> تفاصيل الزبون</h3>
                         <div className="p-2 bg-muted/50 rounded-lg space-y-1">
                            <p><strong>الاسم:</strong> {orderDetails.customer_name}</p>
                            <p><strong>الهاتف:</strong> {orderDetails.customer_phone}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                         <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary"/> تفاصيل الشحن</h3>
                         <div className="p-2 bg-muted/50 rounded-lg space-y-1">
                            <div className="flex justify-end"> {orderDetails.full_address} <strong > :العنوان</strong></div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                         <div className="flex justify-between items-center text-base font-bold">
                            <span className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" />السعر الإجمالي</span>
                            <span>{orderDetails.total_price} دج</span>
                        </div>
                    </div>
                </div>

                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button onClick={onClose} className="w-full btn-gradient">
                        موافق
                    </Button>
                </motion.div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccessModal;