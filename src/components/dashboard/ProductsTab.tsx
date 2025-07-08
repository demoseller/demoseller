import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Package, Edit, Trash2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useProductTypes, useProducts } from '../../hooks/useSupabaseStore';
import AddProductModal from './AddProductModal';
import ImageUpload from '../ImageUpload';
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
          toast.success('تم حذف نوع المنتج بنجاح!');
        } else {
          await deleteProduct(deleteTarget.id);
          toast.success('تم حذف المنتج بنجاح!');
        }
      } catch (error) {
        toast.error('فشل الحذف. يرجى المحاولة مرة أخرى.');
      }
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
    }
  };

  const AddProductTypeModal = () => {
    const [typeName, setTypeName] = useState(editingType?.name || '');
    const [imageUrl, setImageUrl] = useState(editingType?.image_url || '');
    const [loading, setLoading] = useState(false);

    const handleImageUploaded = (url: string) => {
      setImageUrl(url);
    };

    const handleImageRemoved = () => {
      setImageUrl('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const finalImageUrl = imageUrl || '/placeholder.svg';

        if (editingType) {
          await updateProductType(editingType.id, {
            name: typeName,
            image_url: finalImageUrl
          });
          toast.success('تم تحديث نوع المنتج بنجاح!');
          setShowEditTypeModal(false);
          setEditingType(null);
        } else {
          await addProductType({
            name: typeName,
            image_url: finalImageUrl
          });
          toast.success('تمت إضافة نوع المنتج بنجاح!');
          setShowAddTypeModal(false);
        }
      } catch (error) {
        toast.error('فشل حفظ نوع المنتج. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
        setTypeName('');
        setImageUrl('');
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
            {editingType ? 'تعديل نوع المنتج' : 'إضافة نوع منتج جديد'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">اسم النوع</label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                placeholder="مثال: قمصان، هوديس"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">الصورة</label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImage={imageUrl}
                onImageRemoved={handleImageRemoved}
                className="w-full"
              />
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
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 btn-gradient py-2 rounded-lg disabled:opacity-50 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? 'جارٍ الحفظ...' : (editingType ? 'تحديث النوع' : 'إضافة نوع')}
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
        <h3 className="text-xl font-bold mb-4 text-red-500">تأكيد الحذف</h3>
        <p className="text-muted-foreground mb-6">
          هل أنت متأكد أنك تريد حذف هذا {deleteTarget?.type === 'productType' ? 'نوع المنتج' : 'المنتج'}? 
          لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteTarget(null);
            }}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
          >
            إلغاء
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            حذف
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
        <h2 className="text-xl sm:text-2xl font-bold">إدارة المنتجات</h2>
        <button
          onClick={() => setShowAddTypeModal(true)}
          className="btn-gradient px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>إضافة نوع</span>
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
                  <p className="text-xs sm:text-sm opacity-90">{typeProducts.length} منتجات</p>
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
                    <span>إضافة</span>
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
                    <h4 className="font-medium text-xs sm:text-sm">المنتجات في هذا النوع:</h4>
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
                      <p className="text-muted-foreground text-xs sm:text-sm">لا توجد منتجات بعد</p>
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
          <h3 className="text-lg font-semibold mb-2">لا توجد أنواع منتجات بعد</h3>
          <p className="text-muted-foreground mb-4">قم بإنشاء أول نوع منتج للبدء.</p>
          <button
            onClick={() => setShowAddTypeModal(true)}
            className="btn-gradient px-6 py-2 rounded-lg"
          >
            إضافة نوع المنتج
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
