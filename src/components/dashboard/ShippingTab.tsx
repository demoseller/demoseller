
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useShippingData } from '../../hooks/useShippingData';
import { toast } from 'sonner';

const ShippingTab = () => {
  const { shippingData, loading, updateWilayaPrice, updateWilayaCommunes, addWilaya, removeWilaya } = useShippingData();
  const [editingWilaya, setEditingWilaya] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [editingCommunes, setEditingCommunes] = useState<string>('');
  const [newWilayaName, setNewWilayaName] = useState('');
  const [newWilayaPrice, setNewWilayaPrice] = useState('');
  const [newWilayaCommunes, setNewWilayaCommunes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEditStart = (wilaya: string) => {
    setEditingWilaya(wilaya);
    setEditingPrice(shippingData.shippingPrices[wilaya]?.toString() || '');
    setEditingCommunes(shippingData.communes[wilaya]?.join(', ') || '');
  };

  const handleEditSave = () => {
    if (!editingWilaya) return;
    
    const price = parseFloat(editingPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const communes = editingCommunes.split(',').map(c => c.trim()).filter(c => c.length > 0);
    
    updateWilayaPrice(editingWilaya, price);
    updateWilayaCommunes(editingWilaya, communes);
    
    setEditingWilaya(null);
    setEditingPrice('');
    setEditingCommunes('');
    toast.success('Shipping information updated successfully');
  };

  const handleEditCancel = () => {
    setEditingWilaya(null);
    setEditingPrice('');
    setEditingCommunes('');
  };

  const handleAddWilaya = () => {
    if (!newWilayaName.trim()) {
      toast.error('Please enter a wilaya name');
      return;
    }

    const price = parseFloat(newWilayaPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (shippingData.shippingPrices[newWilayaName]) {
      toast.error('This wilaya already exists');
      return;
    }

    const communes = newWilayaCommunes.split(',').map(c => c.trim()).filter(c => c.length > 0);
    
    addWilaya(newWilayaName, price, communes);
    setNewWilayaName('');
    setNewWilayaPrice('');
    setNewWilayaCommunes('');
    setShowAddForm(false);
    toast.success('Wilaya added successfully');
  };

  const handleRemoveWilaya = (wilaya: string) => {
    if (window.confirm(`Are you sure you want to remove ${wilaya}?`)) {
      removeWilaya(wilaya);
      toast.success('Wilaya removed successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold gradient-text">Shipping Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage shipping prices and available cities/communes
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-gradient flex items-center space-x-2 px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Wilaya</span>
        </motion.button>
      </motion.div>

      {/* Add New Wilaya Form */}
      {showAddForm && (
        <motion.div
          className="glass-effect p-6 rounded-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-foreground">Add New Wilaya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Wilaya Name</label>
              <input
                type="text"
                value={newWilayaName}
                onChange={(e) => setNewWilayaName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Enter wilaya name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Shipping Price (DA)</label>
              <input
                type="number"
                value={newWilayaPrice}
                onChange={(e) => setNewWilayaPrice(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Communes (comma separated)</label>
              <input
                type="text"
                value={newWilayaCommunes}
                onChange={(e) => setNewWilayaCommunes(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Commune1, Commune2, ..."
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAddWilaya}
              className="btn-gradient flex items-center space-x-2 px-4 py-2"
            >
              <Save className="w-4 h-4" />
              <span>Add Wilaya</span>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Shipping List */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(shippingData.shippingPrices).map(([wilaya, price]) => (
          <motion.div
            key={wilaya}
            className="glass-effect p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
          >
            {editingWilaya === wilaya ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Shipping Price (DA)</label>
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Communes (comma separated)</label>
                    <input
                      type="text"
                      value={editingCommunes}
                      onChange={(e) => setEditingCommunes(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="Commune1, Commune2, ..."
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleEditSave}
                    className="btn-gradient flex items-center space-x-2 px-4 py-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="px-4 py-2 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary dark:bg-gradient-primary-dark rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{wilaya}</h3>
                      <p className="text-lg font-bold gradient-text">{price} DA</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleEditStart(wilaya)}
                      className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleRemoveWilaya(wilaya)}
                      className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Communes */}
                {shippingData.communes[wilaya] && shippingData.communes[wilaya].length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Available Communes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {shippingData.communes[wilaya].map((commune) => (
                        <span
                          key={commune}
                          className="px-3 py-1 bg-muted/30 rounded-full text-sm text-foreground"
                        >
                          {commune}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {Object.keys(shippingData.shippingPrices).length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Shipping Areas</h3>
          <p className="text-muted-foreground">
            Add your first wilaya to start managing shipping prices and locations.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ShippingTab;
