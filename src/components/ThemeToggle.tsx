
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-0 h-0 sm:w-12 sm:h-7 md:w-14 md:h-8 rounded-full bg-gradient-primary dark:bg-gradient-primary-dark p-0.5 sm:p-1 shadow-lg my-0.05 flex items-center"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? (window.innerWidth < 640 ? 8 : window.innerWidth < 768 ? 20 : 24) : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-purple-600" />
          ) : (
            <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-orange-500" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
