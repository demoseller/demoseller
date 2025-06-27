
import { motion } from 'framer-motion';

interface ImageGalleryPaginationProps {
  totalImages: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const ImageGalleryPagination = ({ totalImages, currentIndex, onDotClick }: ImageGalleryPaginationProps) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {Array.from({ length: totalImages }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'bg-primary scale-125 shadow-lg'
              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
          }`}
          whileHover={{ scale: index === currentIndex ? 1.25 : 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

export default ImageGalleryPagination;
