
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Settings, Key, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import OrdersTab from '../components/dashboard/OrdersTab';
import ProductsTab from '../components/dashboard/ProductsTab';
import ShippingTab from '../components/dashboard/ShippingTab';
import PasswordResetModal from '../components/dashboard/PasswordResetModal';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">
                  Dashboard
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your e-commerce business from one place
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setIsPasswordResetOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 w-fit"
                >
                  <Key className="w-4 h-4" />
                  Reset Password
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2 w-fit"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders" className="flex items-center space-x-1 sm:space-x-2">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center space-x-1 sm:space-x-2">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Products</span>
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex items-center space-x-1 sm:space-x-2">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Shipping</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4 sm:mt-6">
                <OrdersTab />
              </TabsContent>

              <TabsContent value="products" className="mt-4 sm:mt-6">
                <ProductsTab />
              </TabsContent>

              <TabsContent value="shipping" className="mt-4 sm:mt-6">
                <ShippingTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <PasswordResetModal
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
