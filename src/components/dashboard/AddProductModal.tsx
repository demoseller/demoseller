
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus, Upload } from 'lucide-react';
import { useProducts, useProductTypes } from '../../hooks/useSupabaseStore';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypeId?: string;
  editingProduct?: any;
}

const AddProductModal = ({ isOpen, onClose, selectedTypeId, editingProduct }: AddProductModalProps) => {
  const { addProduct, updateProduct } = useProducts();
  const { productTypes } = useProductTypes();
  
  const [productName, setProductName] = useState(editingProduct?.name || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [basePrice, setBasePrice] = useState(editingProduct?.base_price || '');
  const [productTypeId, setProductTypeId] = useState(selectedTypeId || editingProduct?.product_type_id || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [sizes, setSizes] = useState(editingProduct?.options?.sizes || [{ name: '', priceModifier: 0 }]);
  const [colors, setColors] = useState(editingProduct?.options?.colors || [{ name: '', priceModifier: 0 }]);
  const [loading, setLoading] = useState(false);

  const handleAddSize = () => {
    setSizes([...sizes, { name: '', priceModifier: 0 }]);
  };

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index: number, field: string, value: string | number) => {
    const updatedSizes = sizes.map((size, i) => 
      i === index ? { ...size, [field]: value } : size
    );
    setSizes(updatedSizes);
  };

  const handleAddColor = () => {
    setColors([...colors, { name: '', priceModifier: 0 }]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, field: string, value: string | number) => {
    const updatedColors = colors.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    );
    setColors(updatedColors);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For now, we'll use placeholder URLs for images
      // In a real app, you'd upload images to Supabase Storage
      const imageUrls = imageFiles.length > 0 
        ? imageFiles.map((_, index) => `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&v=${Date.now()}&i=${index}`)
        : ['/placeholder.svg'];

      const productData = {
        name: productName,
        description,
        base_price: Number(basePrice),
        images: imageUrls,
        product_type_id: productTypeId,
        options: {
          sizes: sizes.filter(size => size.name.trim() !== ''),
          colors: colors.filter(color => color.name.trim() !== '')
        }
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-background rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="text-xl font-bold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Base Price (DA)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Type</label>
            <select
              value={productTypeId}
              onChange={(e) => setProductTypeId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">Select a product type</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="product-images"
              />
              <label htmlFor="product-images" className="cursor-pointer text-sm text-muted-foreground">
                Click to upload images (multiple files supported)
              </label>
              {imageFiles.length > 0 && (
                <p className="text-sm text-primary mt-2">
                  {imageFiles.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Sizes Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Sizes</label>
              <button
                type="button"
                onClick={handleAddSize}
                className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Size</span>
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {sizes.map((size, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={size.name}
                    onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Size name (e.g., S, M, L)"
                  />
                  <input
                    type="number"
                    value={size.priceModifier}
                    onChange={(e) => handleSizeChange(index, 'priceModifier', Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Price +"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Colors</label>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Color</span>
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {colors.map((color, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Color name (e.g., Red, Blue)"
                  />
                  <input
                    type="number"
                    value={color.priceModifier}
                    onChange={(e) => handleColorChange(index, 'priceModifier', Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Price +"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-gradient py-2 rounded-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProductModal;
