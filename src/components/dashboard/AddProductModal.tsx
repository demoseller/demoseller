import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useProducts, useProductTypes } from '../../hooks/useSupabaseStore';
import ImageUpload from '../ImageUpload';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypeId: string;
  editingProduct?: any;
}

const AddProductModal = ({ isOpen, onClose, selectedTypeId, editingProduct }: AddProductModalProps) => {
  const { addProduct, updateProduct } = useProducts(selectedTypeId);
  const { productTypes } = useProductTypes();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [productTypeId, setProductTypeId] = useState(selectedTypeId);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Array<{ name: string; priceModifier: number }>>([]);
  const [colors, setColors] = useState<Array<{ name: string; priceModifier: number }>>([]);

  // Initialize form with editing product data
  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name || '');
      setDescription(editingProduct.description || '');
      setBasePrice(editingProduct.base_price?.toString() || '');
      setProductTypeId(editingProduct.product_type_id || selectedTypeId);
      setImages(editingProduct.images || []);
      
      // Handle options data
      const options = editingProduct.options;
      if (options && typeof options === 'object') {
        setSizes(options.sizes || []);
        setColors(options.colors || []);
      } else {
        setSizes([]);
        setColors([]);
      }
    } else {
      resetForm();
    }
  }, [editingProduct, selectedTypeId]);

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setBasePrice('');
    setProductTypeId(selectedTypeId);
    setImages([]);
    setSizes([]);
    setColors([]);
  };

  const handleImageUploaded = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
  };

  const handleImageRemoved = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    setSizes([...sizes, { name: '', priceModifier: 0 }]);
  };

  const updateSize = (index: number, field: 'name' | 'priceModifier', value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors([...colors, { name: '', priceModifier: 0 }]);
  };

  const updateColor = (index: number, field: 'name' | 'priceModifier', value: string | number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim() || !basePrice || !productTypeId) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: productName.trim(),
        description: description.trim(),
        base_price: parseFloat(basePrice),
        product_type_id: productTypeId,
        images: images.length > 0 ? images : ['/placeholder.svg'],
        options: {
          sizes: sizes.filter(size => size.name.trim() !== ''),
          colors: colors.filter(color => color.name.trim() !== '')
        }
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('تم تحديث المنتج بنجاح!');
      } else {
        await addProduct(productData);
        toast.success('تمت إضافة المنتج بنجاح!');
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('فشل حفظ المنتج. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold">
            {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                اسم المنتج *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                placeholder="مثال: قميص أساسي"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                السعر الأساسي (دج) *
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                placeholder="2500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              نوع المنتج *
            </label>
            <select
              value={productTypeId}
              onChange={(e) => setProductTypeId(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
              required
            >
              <option value="">اختر نوع المنتج</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
              placeholder="وصف المنتج..."
              rows={3}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">صور المنتج</label>
            <div className="space-y-3">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                className="w-full"
              />
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemoved(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-medium">المقاسات</label>
              <button
                type="button"
                onClick={addSize}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة مقاس</span>
              </button>
            </div>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={size.name}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="اسم المقاس (مثال: S, M, L)"
                  />
                  <input
                    type="number"
                    value={size.priceModifier}
                    onChange={(e) => updateSize(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="معدل السعر"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-medium">الألوان</label>
              <button
                type="button"
                onClick={addColor}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة لون</span>
              </button>
            </div>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="اسم اللون (مثال: أحمر، أزرق، أخضر)"
                  />
                  <input
                    type="number"
                    value={color.priceModifier}
                    onChange={(e) => updateColor(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="معدل السعر"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 text-sm sm:text-base"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 btn-gradient py-2 rounded-lg disabled:opacity-50 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'جارٍ الحفظ...' : (editingProduct ? 'تحديث المنتج' : 'إضافة المنتج')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProductModal;
