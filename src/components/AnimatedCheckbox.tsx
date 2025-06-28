
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const AnimatedCheckbox = ({ id, checked, onChange, label }: AnimatedCheckboxProps) => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        className="relative cursor-pointer"
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
            checked 
              ? 'bg-primary border-primary' 
              : 'bg-background border-border hover:border-primary/50'
          }`}
          animate={{
            scale: checked ? [1, 1.2, 1] : 1,
            backgroundColor: checked ? '#3b82f6' : 'transparent'
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: checked ? 1 : 0, 
              opacity: checked ? 1 : 0 
            }}
            transition={{ duration: 0.2, delay: checked ? 0.1 : 0 }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </motion.div>
      
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-foreground cursor-pointer select-none"
        onClick={() => onChange(!checked)}
      >
        {label}
      </label>
    </div>
  );
};

export default AnimatedCheckbox;
