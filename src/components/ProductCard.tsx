// src/components/ProductCard.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import ImageLightbox from './ImageLightbox'; // We need to import the lightbox

interface ProductCardProps {
  typeId: string;
  product: {
    id: string;
    name: string;
    images: string[];
    base_price: number;
  };
}

const ProductCard = ({ typeId, product }: ProductCardProps) => {
  // 1. Add state to control the lightbox visibility
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const mainImageUrl = product.images?.[0] || '/placeholder.svg';

  // This function opens the lightbox and crucially stops the card's
  // main link from being triggered.
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to the product page
    e.stopPropagation(); // Stops the event from bubbling up to the <Link>
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl card-hover w-full">
        <Link to={`/products/${typeId}/${product.id}`} className="block h-full w-full">
          <div className="relative h-60 sm:h-96 w-full overflow-hidden">
            <img
              src={mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* View Icon Button */}
            <button
              onClick={handleViewClick}
              className="absolute top-3 right-3 z-10 p-3 bg-black/40 text-white rounded-full  transition-opacity duration-300 hover:bg-black/60 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="View image in full screen"
            >
              <Eye className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 leading-tight">
                {product.name}
              </h3>
              <p className="text-base sm:text-lg font-semibold text-white">
                {product.base_price} DA
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Lightbox Component */}
      {/* This component will only render when isLightboxOpen is true */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={mainImageUrl}
        alt={product.name}
      />
    </>
  );
};

export default ProductCard;