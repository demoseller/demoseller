
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { User, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/">
          <motion.div
            className="text-2xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Store logo
          </motion.div>
        </Link>
        
        <div className="flex items-center space-x-6">
          <ThemeToggle />
          
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isDashboard ? (
              <Link to="/">
                <motion.button
                  className="p-2 rounded-lg glass-effect hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Go to Home"
                >
                  <Home className="w-5 h-5" />
                </motion.button>
              </Link>
            ) : (
              null  )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
