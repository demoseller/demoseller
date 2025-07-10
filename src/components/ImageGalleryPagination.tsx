
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

interface ImageGalleryPaginationProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  productName?: string;
}

const ImageGalleryPagination = ({ 
  images, 
  currentIndex, 
  onIndexChange, 
  productName = "المنتج"
}: ImageGalleryPaginationProps) => {
  // Use Embla for the thumbnails
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  // Synchronize thumbnail carousel with main carousel
  useEffect(() => {
    if (!emblaThumbsApi) return;
    emblaThumbsApi.scrollTo(currentIndex);
  }, [currentIndex, emblaThumbsApi]);

  return (
    <div className="mt-4">
      <div className="overflow-hidden" ref={emblaThumbsRef}>
        <div className="flex gap-2 py-2">
          {images.map((image, index) => (
            <motion.button
              key={`thumb-${image}-${index}`}
              onClick={() => onIndexChange(index)}
              className={cn(
                "relative flex-0 shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all h-16 w-16 min-w-16",
                index === currentIndex
                  ? "border-primary opacity-100 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={{
                scale: index === currentIndex ? 1.05 : 1
              }}
              aria-label={`Go to slide ${index + 1} of ${images.length}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryPagination;
