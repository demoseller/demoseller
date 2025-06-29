
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Package, Edit, Trash2, Upload, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useProductTypes, useProducts } from '../../hooks/useSupabaseStore';

const ProductsTab = () => {
  const { productTypes, loading: typesLoading, addProductType, updateProductType, deleteProductType } = useProductTypes();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditTypeModal, setShowEditTypeModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
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
      if (deleteTarget.type === 'productType') {
        await deleteProductType(deleteTarget.id);
      } else {
        await deleteProduct(deleteTarget.id);
      }
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
    }
  };

  const AddProductTypeModal = () => {
    const [typeName, setTypeName] = useState(editingType?.name || '');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingType) {
        await updateProductType(editingType.id, {
          name: typeName,
          image_url: editingType.image_url // Keep existing image for now
        });
        setShowEditTypeModal(false);
        setEditingType(null);
      } else {
        await addProductType({
          name: typeName,
          image_url: '/placeholder.svg'
        });
        setShowAddTypeModal(false);
      }
      setTypeName('');
      setImageFile(null);
    };

    return (
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
          <h3 className="text-xl font-bold mb-4">
            {editingType ? 'Edit Product Type' : 'Add New Product Type'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type Name</label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., T-Shirts, Hoodies"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="type-image"
                />
                <label htmlFor="type-image" className="cursor-pointer text-sm text-muted-foreground">
                  Click to upload image
                </label>
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
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
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-gradient py-2 rounded-lg"
              >
                {editingType ? 'Update' : 'Add'} Type
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => setShowAddTypeModal(true)}
          className="btn-gradient px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product Type</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productTypes.map((type, index) => {
          const typeProducts = getProductsByType(type.id);
          const isExpanded = expandedTypes.has(type.id);
          
          return (
            <motion.div
              key={type.id}
              className="glass-effect rounded-xl overflow-hidden border card-hover"
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
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">{type.name}</h3>
                  <p className="text-sm opacity-90">{type.productCount || 0} products</p>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTypeId(type.id);
                      setShowAddProductModal(true);
                    }}
                    className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                  
                  <button
                    onClick={() => toggleTypeExpansion(type.id)}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setEditingType(type);
                      setShowEditTypeModal(true);
                    }}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => {
                      setDeleteTarget({type: 'productType', id: type.id});
                      setShowDeleteConfirm(true);
                    }}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t pt-3 space-y-2"
                  >
                    <h4 className="font-medium text-sm">Products in this type:</h4>
                    {typeProducts.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {typeProducts.map(product => (
                          <div key={product.id} className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-muted-foreground">{product.base_price} DA</p>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setSelectedTypeId(type.id);
                                  setShowEditProductModal(true);
                                }}
                                className="p-1 hover:bg-muted/50 rounded"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget({type: 'product', id: product.id});
                                  setShowDeleteConfirm(true);
                                }}
                                className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No products yet</p>
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
    </div>
  );
};

export default ProductsTab;
