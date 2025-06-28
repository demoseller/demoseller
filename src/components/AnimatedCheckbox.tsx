
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

const AnimatedCheckbox = ({ checked, onChange, label, className = '' }: AnimatedCheckboxProps) => {
  return (
    <motion.label
      className={`flex items-center space-x-3 cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
          checked
            ? 'bg-gradient-primary dark:bg-gradient-primary-dark border-primary'
            : 'border-gray-300 dark:border-gray-600 bg-transparent'
        }`}
        animate={{ 
          scale: checked ? [1, 1.1, 1] : 1,
          backgroundColor: checked ? '#6366f1' : 'transparent'
        }}
        transition={{ duration: 0.3 }}
        onClick={() => onChange(!checked)}
      >
        <motion.div
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ duration: 0.2, delay: checked ? 0.1 : 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.span
        className="text-sm font-medium text-foreground select-none"
        animate={{ 
          color: checked ? '#6366f1' : 'currentColor' 
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.label>
  );
};

export default AnimatedCheckbox;
