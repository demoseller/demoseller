// src/components/ProductTypeCard.tsx

import { Link } from 'react-router-dom';

interface ProductTypeCardProps {
  id: string;
  name: string;
  imageUrl: string;
}

const ProductTypeCard = ({ id, name, imageUrl }: ProductTypeCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl w-full">
      <Link to={`/products/${id}`} className="block h-full w-full">
        <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 leading-tight">
              {name}
            </h3>
            <div className="w-8 md:w-12 h-1 bg-white rounded-full" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductTypeCard;