
import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { useProductTypes } from '../../hooks/useAppStore';

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
  const productTypes = useProductTypes();
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-background rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Orders</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value as FilterOptions['status']})}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Type</label>
            <select
              value={filters.productType}
              onChange={(e) => setFilters({...filters, productType: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Product Types</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wilaya</label>
            <select
              value={filters.wilaya}
              onChange={(e) => setFilters({...filters, wilaya: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Wilayas</option>
              {wilayas.map(wilaya => (
                <option key={wilaya} value={wilaya}>{wilaya}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              value={filters.product}
              onChange={(e) => setFilters({...filters, product: e.target.value})}
              placeholder="Search by product name..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-6">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 btn-gradient py-2 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderFilterModal;
