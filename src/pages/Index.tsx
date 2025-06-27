
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FullScreenSection from '../components/FullScreenSection';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock data for product types
const mockProductTypes = [
  {
    id: 't-shirts',
    name: 'T-Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&h=1080&fit=crop'
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a9c6aa6a6ad?w=1920&h=1080&fit=crop'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=1080&fit=crop'
  }
];

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const sectionHeight = window.innerHeight;
      const currentSection = Math.round(scrollTop / sectionHeight);
      
      setActiveSection(currentSection);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      <Navbar />
      
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Hero Section */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden snap-start">
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
              alt="SpectraCommerce Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          </motion.div>

          <div className="relative z-10 text-center px-8">
            <motion.h1
              className="text-6xl md:text-9xl font-bold text-white mb-8 drop-shadow-2xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
              SpectraCommerce
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            >
              Experience the future of e-commerce with stunning visuals and seamless interactions
            </motion.p>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2, type: "spring", stiffness: 200 }}
            >
              <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 cursor-pointer">
                Scroll to Explore
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
            </motion.div>
          </motion.div>
        </section>

        {/* Product Type Sections */}
        {mockProductTypes.map((type, index) => (
          <FullScreenSection
            key={type.id}
            id={type.id}
            name={type.name}
            imageUrl={type.imageUrl}
            index={index + 1}
            isActive={activeSection === index + 1}
            linkTo={`/products/${type.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
