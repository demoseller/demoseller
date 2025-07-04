
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useShippingData } from '../../hooks/useShippingData';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

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

  const handleEditSave = async () => {
    if (!editingWilaya) return;
    
    const price = parseFloat(editingPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const communes = editingCommunes.split(',').map(c => c.trim()).filter(c => c.length > 0);
    
    await updateWilayaPrice(editingWilaya, price);
    await updateWilayaCommunes(editingWilaya, communes);
    
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

  const handleAddWilaya = async () => {
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
    
    await addWilaya(newWilayaName, price, communes);
    setNewWilayaName('');
    setNewWilayaPrice('');
    setNewWilayaCommunes('');
    setShowAddForm(false);
    toast.success('Wilaya added successfully');
  };

  const handleRemoveWilaya = async (wilaya: string) => {
    if (window.confirm(`Are you sure you want to remove ${wilaya}?`)) {
      await removeWilaya(wilaya);
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

  const shippingEntries = Object.entries(shippingData.shippingPrices);

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
          className="btn-gradient flex items-center space-x-2 px-4 py-2 rounded-lg"
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
              className="btn-gradient flex items-center space-x-2 px-4 py-2 rounded-lg"
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

      {/* Shipping Rules Table */}
      {shippingEntries.length > 0 ? (
        <motion.div
          className="glass-effect rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Shipping Rules ({shippingEntries.length})</span>
            </h3>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Wilaya</TableHead>
                <TableHead className="w-[150px]">Price (DA)</TableHead>
                <TableHead>Available Communes</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingEntries.map(([wilaya, price]) => (
                <TableRow key={wilaya}>
                  {editingWilaya === wilaya ? (
                    // Edit Mode
                    <>
                      <TableCell>
                        <span className="font-medium">{wilaya}</span>
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(e.target.value)}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={editingCommunes}
                          onChange={(e) => setEditingCommunes(e.target.value)}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                          placeholder="Commune1, Commune2, ..."
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={handleEditSave}
                            className="p-1 hover:bg-green-500/20 text-green-600 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Save changes"
                          >
                            <Save className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={handleEditCancel}
                            className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <TableCell>
                        <span className="font-medium">{wilaya}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">{price} DA</span>
                      </TableCell>
                      <TableCell>
                        {shippingData.communes[wilaya] && shippingData.communes[wilaya].length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {shippingData.communes[wilaya].slice(0, 3).map((commune) => (
                              <span
                                key={commune}
                                className="px-2 py-1 bg-muted/50 rounded-full text-xs"
                              >
                                {commune}
                              </span>
                            ))}
                            {shippingData.communes[wilaya].length > 3 && (
                              <span className="px-2 py-1 bg-muted/50 rounded-full text-xs">
                                +{shippingData.communes[wilaya].length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No communes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() => handleEditStart(wilaya)}
                            className="p-1 hover:bg-blue-500/20 text-blue-600 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleRemoveWilaya(wilaya)}
                            className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12 glass-effect rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Shipping Areas</h3>
          <p className="text-muted-foreground mb-4">
            Add your first wilaya to start managing shipping prices and locations.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gradient px-4 py-2 rounded-lg"
          >
            Add First Wilaya
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ShippingTab;
