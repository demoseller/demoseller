import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import StoreSettingsModal from './StoreSettingsModal';

const SettingsTab = () => {
  const { settings, loading } = useStoreSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إعدادات المتجر</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          تعديل الإعدادات
        </Button>
      </div>

      <motion.div
        className="glass-effect p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">اسم المتجر</h3>
            <p className="text-muted-foreground">{settings?.store_name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">رقم الهاتف</h3>
            <p className="text-muted-foreground">{settings?.phone_number}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">شعار المتجر</h3>
            <img src={settings?.logo_url} alt="Logo" className="h-16 w-16 rounded-lg bg-muted p-1" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">حسابات التواصل</h3>
            <div className="flex flex-col space-y-2">
              <a href={settings?.social_media?.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Facebook</a>
              <a href={settings?.social_media?.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Instagram</a>
              <a href={settings?.social_media?.telegram} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Telegram</a>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-2">صور الواجهة</h3>
            <div className="flex flex-wrap gap-2">
              {settings?.hero_images?.map((url, index) => (
                <img key={index} src={url} alt={`Hero ${index + 1}`} className="h-24 w-24 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <StoreSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SettingsTab;