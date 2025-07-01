
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { User, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect"
      >
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link to="/" onClick={closeMobileMenu}>
            <motion.div
              className="text-xl md:text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SpectraCommerce
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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
              ) : null}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg glass-effect hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] glass-effect shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link to="/" onClick={closeMobileMenu}>
                  <div className="text-xl font-bold gradient-text">
                    SpectraCommerce
                  </div>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  {isDashboard ? (
                    <Link to="/" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        <Home className="w-5 h-5" />
                        <span className="text-lg">Go to Home</span>
                      </div>
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={closeMobileMenu}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        <User className="w-5 h-5" />
                        <span className="text-lg">Dashboard</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
