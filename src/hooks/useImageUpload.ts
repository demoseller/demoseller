
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
        const error = 'Please select an image file';
        toast.error(error);
        return { success: false, error };
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        const error = 'Image size must be less than 10MB';
        toast.error(error);
        return { success: false, error };
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
        let errorMessage = 'Upload failed';
        
        if (error.message) {
          if (error.message.includes('FunctionsHttpError')) {
            errorMessage = 'Upload service temporarily unavailable. Please try again.';
          } else if (error.message.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage = `Upload failed: ${error.message}`;
          }
        }
        
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
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
        const errorMsg = data?.error || 'Upload failed for unknown reason';
        console.error('Upload failed:', data);
        toast.error(`Upload failed: ${errorMsg}`);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = 'Network error occurred during upload. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
