
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ProductTypeCardProps {
  id: string;
  name: string;
  imageUrl: string;
  index: number;
}

const ProductTypeCard = ({ id, name, imageUrl, index }: ProductTypeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl shadow-xl card-hover"
    >
      <Link to={`/products/${id}`}>
        <div className="relative h-80 w-full overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 glass-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-6 left-6 right-6">
              <motion.h3
                className="text-2xl font-bold text-white mb-2 transform translate-y-5 group-hover:translate-y-0 transition-transform duration-300"
                initial={false}
              >
                {name}
              </motion.h3>
              
              <div className="w-0 h-1 bg-gradient-primary dark:bg-gradient-primary-dark rounded-full group-hover:w-12 transition-all duration-600 ease-out" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductTypeCard;
