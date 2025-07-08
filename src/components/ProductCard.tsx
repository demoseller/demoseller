// src/components/ProductCard.tsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  return (
    <div className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl card-hover w-full">
      <Link to={`/products/${typeId}/${product.id}`} className="block h-full w-full">
        <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
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
  );
};

export default ProductCard;