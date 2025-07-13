import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ProductOption {
  name: string;
  priceModifier: number;
}

interface ProductOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: ProductOption) => void;
  optionType: 'size' | 'color';
  initialData?: ProductOption | null;
}

const ProductOptionModal = ({ isOpen, onClose, onSave, optionType, initialData }: ProductOptionModalProps) => {
  const [name, setName] = useState('');
  const [priceModifier, setPriceModifier] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPriceModifier(initialData.priceModifier.toString());
    } else {
      setName('');
      setPriceModifier('');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const title = `${initialData ? 'تعديل' : 'إضافة'} ${optionType === 'size' ? 'مقاس' : 'لون'}`;
  const namePlaceholder = optionType === 'size' ? 'مثال: L, XL' : 'مثال: أحمر, أزرق';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('الرجاء إدخال اسم الخيار');
      return;
    }
    onSave({
      name: name.trim(),
      priceModifier: parseFloat(priceModifier) || 0,
    });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-background rounded-xl p-6 w-full max-w-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={namePlaceholder}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">معدل السعر (دج)</label>
            <input
              type="number"
              value={priceModifier}
              onChange={(e) => setPriceModifier(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="0"
              step="0.01"
            />
             <p className="text-xs text-muted-foreground mt-1">
              أضف زيادة أو نقصان على السعر الأساسي. مثال: 100 أو -50.
            </p>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted/50">
              إلغاء
            </button>
            <button type="submit" className="flex-1 btn-gradient py-2 rounded-lg">
              حفظ
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductOptionModal;