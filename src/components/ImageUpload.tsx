import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  className?: string;
}

const ImageUpload = ({ 
  onImageUploaded, 
  currentImage, 
  onImageRemoved,
  className = ""
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const { uploadImage, uploading } = useImageUpload();

  const handleFileSelect = async (file: File) => {
    setUploadError('');
    
    if (!file.type.startsWith('image/')) {
      setUploadError('الرجاء اختيار ملف صورة');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('يجب أن يكون حجم الصورة أقل من 10 ميغابايت');
      return;
    }

    const result = await uploadImage(file);
    if (result.success && result.imageUrl) {
      onImageUploaded(result.imageUrl);
    } else {
      setUploadError(result.error || 'فشل الرفع');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
    setUploadError('');
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="تم الرفع"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleClick}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-1" />
                استبدال
              </Button>
              {onImageRemoved && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4 mr-1" />
                  إزالة
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="text-sm text-muted-foreground">جارٍ رفع الصورة...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">انقر للرفع أو اسحب وأفلت</p>
                <p className="text-xs text-muted-foreground">PNG، JPG، GIF بحد أقصى 10 ميغابايت</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {uploadError && (
        <div className="mt-2 flex items-center space-x-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
