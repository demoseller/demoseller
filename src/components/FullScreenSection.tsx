
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageLightbox from './ImageLightbox';

interface FullScreenSectionProps {
  id: string;
  name: string;
  imageUrl: string;
  index: number;
  isActive: boolean;
  linkTo?: string;
}

const FullScreenSection = ({ id, name, imageUrl, index, isActive, linkTo }: FullScreenSectionProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <section 
        className="relative w-full h-screen flex items-center justify-center overflow-hidden snap-start"
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Background Image with Ken Burns Effect */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: isActive ? 1.2 : 1.1,
            x: isActive ? [0, -20, 20, 0] : 0,
            y: isActive ? [0, -10, 10, 0] : 0
          }}
          transition={{ 
            duration: isActive ? 20 : 0,
            ease: "linear",
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          <motion.h2
            className="text-6xl md:text-8xl font-bold text-white mb-8 drop-shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: isActive ? 0 : 100, 
              opacity: isActive ? 1 : 0 
            }}
            transition={{ 
              duration: 0.8, 
              delay: isActive ? 0.2 : 0,
              ease: "easeOut"
            }}
          >
            {name}
          </motion.h2>

          {linkTo && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ 
                y: isActive ? 0 : 50, 
                opacity: isActive ? 1 : 0 
              }}
              transition={{ 
                duration: 0.8, 
                delay: isActive ? 0.6 : 0,
                ease: "easeOut"
              }}
            >
              <Link to={linkTo}>
                <motion.button
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Collection
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Scroll Indicator */}
        {index === 0 && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
            </motion.div>
          </motion.div>
        )}
      </section>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={imageUrl}
        alt={name}
      />
    </>
  );
};

export default FullScreenSection;
