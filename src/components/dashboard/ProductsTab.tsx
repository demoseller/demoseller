import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Package, Edit, Trash2, Upload } from 'lucide-react';
import { useProductTypes } from '../../hooks/useAppStore';
import { appStore } from '../../store/appStore';

interface ProductType {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  productTypeId: string;
  options: {
    sizes: Array<{ name: string; priceModifier: number }>;
    colors: Array<{ name: string; priceModifier: number }>;
  };
}

const ProductsTab = () => {
  const productTypes = useProductTypes();
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');

  const AddProductTypeModal = () => {
    const [typeName, setTypeName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      appStore.addProductType({
        name: typeName,
        imageUrl: '/placeholder.svg', // In real app, upload image first
        productCount: 0
      });
      setShowAddTypeModal(false);
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
          <h3 className="text-xl font-bold mb-4">Add New Product Type</h3>
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
                onClick={() => setShowAddTypeModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-gradient py-2 rounded-lg"
              >
                Add Type
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  const AddProductModal = () => {
    const [productData, setProductData] = useState({
      name: '',
      description: '',
      basePrice: 0,
      sizes: [{ name: 'S', priceModifier: 0 }, { name: 'M', priceModifier: 0 }, { name: 'L', priceModifier: 100 }],
      colors: [{ name: 'Black', priceModifier: 0 }, { name: 'White', priceModifier: 0 }, { name: 'Blue', priceModifier: 50 }]
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      appStore.addProduct({
        name: productData.name,
        description: productData.description,
        basePrice: productData.basePrice,
        images: ['/placeholder.svg'],
        productTypeId: selectedTypeId,
        options: {
          sizes: productData.sizes,
          colors: productData.colors
        }
      });
      setShowAddProductModal(false);
      setSelectedTypeId('');
    };

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
          <h3 className="text-xl font-bold mb-4">Add New Product</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({...productData, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Base Price (DA)</label>
                <input
                  type="number"
                  value={productData.basePrice}
                  onChange={(e) => setProductData({...productData, basePrice: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Size Options</label>
                <div className="space-y-2">
                  {productData.sizes.map((size, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={size.name}
                        onChange={(e) => {
                          const newSizes = [...productData.sizes];
                          newSizes[index].name = e.target.value;
                          setProductData({...productData, sizes: newSizes});
                        }}
                        className="flex-1 px-2 py-1 text-sm rounded border border-border bg-background"
                        placeholder="Size"
                      />
                      <input
                        type="number"
                        value={size.priceModifier}
                        onChange={(e) => {
                          const newSizes = [...productData.sizes];
                          newSizes[index].priceModifier = Number(e.target.value);
                          setProductData({...productData, sizes: newSizes});
                        }}
                        className="w-20 px-2 py-1 text-sm rounded border border-border bg-background"
                        placeholder="Price +"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Options</label>
                <div className="space-y-2">
                  {productData.colors.map((color, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => {
                          const newColors = [...productData.colors];
                          newColors[index].name = e.target.value;
                          setProductData({...productData, colors: newColors});
                        }}
                        className="flex-1 px-2 py-1 text-sm rounded border border-border bg-background"
                        placeholder="Color"
                      />
                      <input
                        type="number"
                        value={color.priceModifier}
                        onChange={(e) => {
                          const newColors = [...productData.colors];
                          newColors[index].priceModifier = Number(e.target.value);
                          setProductData({...productData, colors: newColors});
                        }}
                        className="w-20 px-2 py-1 text-sm rounded border border-border bg-background"
                        placeholder="Price +"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowAddProductModal(false); setSelectedTypeId(''); }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-gradient py-2 rounded-lg"
              >
                Add Product
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

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
        {productTypes.map((type, index) => (
          <motion.div
            key={type.id}
            className="glass-effect rounded-xl overflow-hidden border card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="aspect-video bg-muted relative">
              <img
                src={type.imageUrl}
                alt={type.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">{type.name}</h3>
                <p className="text-sm opacity-90">{type.productCount} products</p>
              </div>
            </div>
            
            <div className="p-4">
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
                <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-border rounded-lg hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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

      {showAddTypeModal && <AddProductTypeModal />}
      {showAddProductModal && <AddProductModal />}
    </div>
  );
};

export default ProductsTab;
