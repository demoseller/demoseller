
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

const ImageLightbox = ({ isOpen, onClose, imageUrl, alt }: ImageLightboxProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset transformations when closing
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
          
          {/* Controls */}
          <div className="absolute top-6 right-6 z-10 flex items-center space-x-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="glass-effect p-3 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="glass-effect p-3 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="glass-effect p-3 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </motion.button>
            
            <motion.button
              onClick={onClose}
              className="glass-effect p-3 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Image container */}
          <motion.div
            className="relative max-w-[90vw] max-h-[90vh] cursor-move"
            onClick={(e) => e.stopPropagation()}
            drag={scale > 1}
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            style={{
              scale,
              x: position.x,
              y: position.y,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '90vh',
                cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default')
              }}
            />
          </motion.div>

          {/* Scale indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(scale * 100)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
