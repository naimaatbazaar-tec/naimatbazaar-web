'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const productImages = [
  "/images/Talbina.png",
  "/images/Oats.jpeg",
  "/images/Skincare.png",
];

export default function HeroProduct() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 4.5 seconds stay time
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[380px] h-[360px] mx-auto flex items-center justify-center my-4">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={productImages[currentIndex]}
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: [0, -12, 0], // Smooth continuous floating effect
          }}
          exit={{
            opacity: 0,
            scale: 0.7,
            rotate: 8,
            y: -90,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            duration: 0.6,
            ease: "easeInOut"
          }}
          className="absolute w-[300px] h-[300px] flex items-center justify-center bg-transparent"
        >
          <img
            src={productImages[currentIndex]}
            alt="Naimat Bazaar Product"
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}