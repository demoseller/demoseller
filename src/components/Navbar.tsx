import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="w-full px-3 sm:px-4 py-0 sm:py-3 md:py-4 flex items-center justify-between ">
        <Link to="/">
          <motion.div className="text-lg sm:text-xl md:text-2xl font-bold gradient-text" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            SpectraCommerce
          </motion.div>
        </Link>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <ThemeToggle />
          
          {isDashboard && <Link to="/">
              <motion.button className="p-1.5 sm:p-2 rounded-lg glass-effect hover:bg-white/20 dark:hover:bg-black/20 transition-colors" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} title="Go to Home">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </Link>}
        </div>
      </div>
    </motion.nav>;
};
export default Navbar;