
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showText = false 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      // Only call onRatingChange to update the rating state
      // Do NOT trigger form submission here
      onRatingChange(value);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            disabled={readonly}
          >
            <Star
              className={`${sizes[size]} transition-all duration-200 ${
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                  : 'text-gray-300 dark:text-gray-600'
              } ${!readonly && hoverRating >= star ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}`}
            />
          </motion.button>
        ))}
      </div>
      {showText && (
        <span className="text-sm text-muted-foreground ml-2">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
