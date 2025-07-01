
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../hooks/useProductData';
import { toast } from 'sonner';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageUpload, 
  className = "" 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload image
      const imageUrl = await uploadImage(file);
      
      // Clean up local preview
      URL.revokeObjectURL(localPreview);
      
      // Update with uploaded image URL
      setPreviewUrl(imageUrl);
      onImageUpload(imageUrl);
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Image
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-red-500 hover:text-red-700 transition-colors"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative">
        {previewUrl ? (
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Click to upload an image</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {!previewUrl && (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
