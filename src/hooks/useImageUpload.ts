
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-image', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return { success: false, error: error.message };
      }

      if (data.success) {
        toast.success('Image uploaded successfully');
        return {
          success: true,
          imageUrl: data.imageUrl,
          publicId: data.publicId
        };
      } else {
        toast.error('Upload failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return { success: false, error: 'Upload failed' };
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
