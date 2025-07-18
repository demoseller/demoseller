import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const FacebookPixelSettingsTab = () => {
  const { settings, updateSettings, loading } = useStoreSettings();
  const [pixelId, setPixelId] = useState(settings?.facebook_pixel_id || '');
  const [originalPixelId, setOriginalPixelId] = useState(settings?.facebook_pixel_id || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Validation state
  const [isValid, setIsValid] = useState(false);
  
  // Check if there's a valid change
  const hasValidChanges = isValid && pixelId !== originalPixelId;

  // Validate the pixel ID format
  const validatePixelId = (id: string) => {
    return /^\d{15,16}$/.test(id);
  };

  useEffect(() => {
    if (settings?.facebook_pixel_id) {
      setPixelId(settings.facebook_pixel_id);
      setOriginalPixelId(settings.facebook_pixel_id);
      setIsValid(validatePixelId(settings.facebook_pixel_id));
    }
  }, [settings]);

  // Update validation on input change
  useEffect(() => {
    setIsValid(validatePixelId(pixelId));
  }, [pixelId]);

  const handleSave = async () => {
    if (!isValid) {
      toast.error('معرف بيكسل فيسبوك غير صالح. يجب أن يكون 15-16 رقماً فقط.');
      return;
    }
    
    setIsSaving(true);
    try {
      await updateSettings({ facebook_pixel_id: pixelId.trim() });
      setOriginalPixelId(pixelId.trim()); // Update the original after successful save
      toast.success('تم حفظ معرف بيكسل فيسبوك بنجاح!');
    } catch (error) {
      toast.error('فشل حفظ معرف بيكسل فيسبوك.');
      console.error('Failed to save Facebook Pixel ID:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إعدادات تتبع البيكسل</h2>
        {hasValidChanges && (
          <Button onClick={handleSave} disabled={isSaving || !hasValidChanges}>
            {isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </Button>
        )}
      </div>

      <motion.div
        className="glass-effect p-6 rounded-xl border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <BarChart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">معرف بيكسل فيسبوك</h3>
          </div>
          <p className="text-muted-foreground p-0 text-sm">
            أدخل معرف بيكسل فيسبوك الخاص بك لتتبع أحداث المستخدم وتحسين إعلاناتك.
          </p>
          <div>
            <Label htmlFor="facebook_pixel_id" className="p-2">معرف البيكسل</Label>
            <Input
              id="facebook_pixel_id"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="مثال: 123456789012345"
              className={pixelId && !isValid ? "border-red-500 m-5" : ""}
            />
            {pixelId && !isValid && (
              <p className="text-red-500 text-xs mt-1">
                معرف بيكسل فيسبوك يجب أن يتكون من 15-16 رقماً فقط.
              </p>
            )}
            {isValid && (
              <p className="text-green-500 text-xs mt-1">
                صيغة معرف البيكسل صحيحة.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FacebookPixelSettingsTab;