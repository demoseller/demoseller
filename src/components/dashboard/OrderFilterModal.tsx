
import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { useProductTypes, useProducts } from '../../hooks/useSupabaseStore';

interface FilterOptions {
  status: 'all' | 'pending' | 'confirmed';
  product: string;
  productType: string;
  wilaya: string;
}

interface OrderFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const OrderFilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters }: OrderFilterModalProps) => {
  const { productTypes } = useProductTypes();
  const { products } = useProducts();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const wilayas = [
    'Algiers', 'Oran', 'Constantine', 'Batna', 'Biskra', 'Blida', 'Bouira',
    'Tlemcen', 'Sétif', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Jijel'
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = { status: 'all' as const, product: '', productType: '', wilaya: '' };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold flex items-center space-x-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Filter Orders</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value as FilterOptions['status']})}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Product Type</label>
            <select
              value={filters.productType}
              onChange={(e) => setFilters({...filters, productType: e.target.value})}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
            >
              <option value="">All Product Types</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Product Name</label>
            <select
              value={filters.product}
              onChange={(e) => setFilters({...filters, product: e.target.value})}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.name}>{product.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Wilaya</label>
            <select
              value={filters.wilaya}
              onChange={(e) => setFilters({...filters, wilaya: e.target.value})}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
            >
              <option value="">All Wilayas</option>
              {wilayas.map(wilaya => (
                <option key={wilaya} value={wilaya}>{wilaya}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-2 sm:space-x-3 pt-4 sm:pt-6">
          <button
            onClick={handleReset}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors text-xs sm:text-sm"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 btn-gradient py-2 rounded-lg text-xs sm:text-sm"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderFilterModal;
