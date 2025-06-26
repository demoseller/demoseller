
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
      className="relative w-14 h-8 rounded-full bg-gradient-primary dark:bg-gradient-primary-dark p-1 shadow-lg"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-purple-600" />
          ) : (
            <Sun className="w-4 h-4 text-orange-500" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
