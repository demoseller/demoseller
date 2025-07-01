
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Package, Edit, Trash2, Upload, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useProductTypes, useProducts } from '../../hooks/useSupabaseStore';
import AddProductModal from './AddProductModal';
import { toast } from 'sonner';

const ProductsTab = () => {
  const { productTypes, loading: typesLoading, addProductType, updateProductType, deleteProductType } = useProductTypes();
  const { products, loading: productsLoading, deleteProduct } = useProducts();
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditTypeModal, setShowEditTypeModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [editingType, setEditingType] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'product' | 'productType', id: string} | null>(null);

  const toggleTypeExpansion = (typeId: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedTypes(newExpanded);
  };

  const getProductsByType = (typeId: string) => {
    return products.filter(product => product.product_type_id === typeId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      try {
        if (deleteTarget.type === 'productType') {
          await deleteProductType(deleteTarget.id);
          toast.success('Product type deleted successfully!');
        } else {
          await deleteProduct(deleteTarget.id);
          toast.success('Product deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete. Please try again.');
      }
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
    }
  };

  const AddProductTypeModal = () => {
    const [typeName, setTypeName] = useState(editingType?.name || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const imageUrl = imageFile 
          ? `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&v=${Date.now()}`
          : editingType?.image_url || '/placeholder.svg';

        if (editingType) {
          await updateProductType(editingType.id, {
            name: typeName,
            image_url: imageUrl
          });
          toast.success('Product type updated successfully!');
          setShowEditTypeModal(false);
          setEditingType(null);
        } else {
          await addProductType({
            name: typeName,
            image_url: imageUrl
          });
          toast.success('Product type added successfully!');
          setShowAddTypeModal(false);
        }
      } catch (error) {
        toast.error('Failed to save product type. Please try again.');
      } finally {
        setLoading(false);
        setTypeName('');
        setImageFile(null);
      }
    };

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
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
            {editingType ? 'Edit Product Type' : 'Add New Product Type'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Type Name</label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                placeholder="e.g., T-Shirts, Hoodies"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-3 sm:p-4 text-center">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="type-image"
                />
                <label htmlFor="type-image" className="cursor-pointer text-xs sm:text-sm text-muted-foreground">
                  Click to upload image
                </label>
                {imageFile && (
                  <p className="text-xs sm:text-sm text-primary mt-2">{imageFile.name}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={() => {
                  if (editingType) {
                    setShowEditTypeModal(false);
                    setEditingType(null);
                  } else {
                    setShowAddTypeModal(false);
                  }
                }}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-border rounded-lg hover:bg-muted/50 text-xs sm:text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-gradient py-2 rounded-lg disabled:opacity-50 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingType ? 'Update Type' : 'Add Type')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  const DeleteConfirmModal = () => (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-background rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="text-xl font-bold mb-4 text-red-500">Confirm Deletion</h3>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete this {deleteTarget?.type === 'productType' ? 'product type' : 'product'}? 
          This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteTarget(null);
            }}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => setShowAddTypeModal(true)}
          className="btn-gradient px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Add Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {productTypes.map((type, index) => {
          const typeProducts = getProductsByType(type.id);
          const isExpanded = expandedTypes.has(type.id);
          
          return (
            <motion.div
              key={type.id}
              className="glass-effect rounded-lg sm:rounded-xl overflow-hidden border card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="aspect-video bg-muted relative">
                <img
                  src={type.image_url || '/placeholder.svg'}
                  alt={type.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                  <h3 className="text-sm sm:text-lg font-bold">{type.name}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{typeProducts.length} products</p>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <button
                    onClick={() => {
                      setSelectedTypeId(type.id);
                      setEditingProduct(null);
                      setShowAddProductModal(true);
                    }}
                    className="bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleTypeExpansion(type.id)}
                      className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setEditingType(type);
                        setShowEditTypeModal(true);
                      }}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        setDeleteTarget({type: 'productType', id: type.id});
                        setShowDeleteConfirm(true);
                      }}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 border border-border rounded-lg hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t pt-2 sm:pt-3 space-y-1 sm:space-y-2"
                  >
                    <h4 className="font-medium text-xs sm:text-sm">Products in this type:</h4>
                    {typeProducts.length > 0 ? (
                      <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                        {typeProducts.map(product => (
                          <div key={product.id} className="flex justify-between items-center p-1.5 sm:p-2 bg-muted/30 rounded text-xs sm:text-sm">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-muted-foreground">{product.base_price} DA</p>
                            </div>
                            <div className="flex space-x-0.5 sm:space-x-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setSelectedTypeId(type.id);
                                  setShowEditProductModal(true);
                                }}
                                className="p-0.5 sm:p-1 hover:bg-muted/50 rounded"
                              >
                                <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget({type: 'product', id: product.id});
                                  setShowDeleteConfirm(true);
                                }}
                                className="p-0.5 sm:p-1 hover:bg-red-500/10 hover:text-red-500 rounded"
                              >
                                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs sm:text-sm">No products yet</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {productTypes.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Product Types Yet</h3>
          <p className="text-muted-foreground mb-4">Create your first product type to get started.</p>
          <button
            onClick={() => setShowAddTypeModal(true)}
            className="btn-gradient px-6 py-2 rounded-lg"
          >
            Add Product Type
          </button>
        </div>
      )}

      {(showAddTypeModal || showEditTypeModal) && <AddProductTypeModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      
      <AddProductModal
        isOpen={showAddProductModal || showEditProductModal}
        onClose={() => {
          setShowAddProductModal(false);
          setShowEditProductModal(false);
          setEditingProduct(null);
          setSelectedTypeId('');
        }}
        selectedTypeId={selectedTypeId}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default ProductsTab;
