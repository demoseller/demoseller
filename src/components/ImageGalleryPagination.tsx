
import { motion } from 'framer-motion';

interface ImageGalleryPaginationProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageGalleryPagination = ({ images, currentIndex, onIndexChange }: ImageGalleryPaginationProps) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {images.map((_, index) => (
        <motion.button
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'bg-gradient-primary dark:bg-gradient-primary-dark shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
          }`}
          onClick={() => onIndexChange(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={false}
          animate={{
            scale: index === currentIndex ? 1.2 : 1
          }}
        />
      ))}
    </div>
  );
};

export default ImageGalleryPagination;
