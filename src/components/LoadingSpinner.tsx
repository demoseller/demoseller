
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-transparent bg-gradient-primary dark:bg-gradient-primary-dark opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-transparent bg-gradient-primary dark:bg-gradient-primary-dark opacity-40"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-transparent bg-gradient-primary dark:bg-gradient-primary-dark opacity-60"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center pulse */}
        <motion.div
          className="absolute top-6 left-6 w-8 h-8 rounded-full bg-gradient-primary dark:bg-gradient-primary-dark"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
