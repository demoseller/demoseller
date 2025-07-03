
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
    console.log('Starting image upload:', { name: file.name, type: file.type, size: file.size });
    
    setUploading(true);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return { success: false, error: 'Invalid file type' };
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return { success: false, error: 'File too large' };
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('Calling upload-image function...');

      const { data, error } = await supabase.functions.invoke('upload-image', {
        body: formData,
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error(`Upload failed: ${error.message}`);
        return { success: false, error: error.message };
      }

      if (data?.success) {
        console.log('Upload successful:', data.imageUrl);
        toast.success('Image uploaded successfully');
        return {
          success: true,
          imageUrl: data.imageUrl,
          publicId: data.publicId
        };
      } else {
        console.error('Upload failed:', data);
        toast.error(`Upload failed: ${data?.error || 'Unknown error'}`);
        return { success: false, error: data?.error || 'Upload failed' };
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return { success: false, error: 'Network error' };
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
