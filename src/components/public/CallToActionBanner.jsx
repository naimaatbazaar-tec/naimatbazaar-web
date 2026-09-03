'use client';

import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';

export default function CallToActionBanner() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white border-2 border-dashed border-[#8B0000] rounded-3xl p-8 md:p-14 text-center shadow-xl overflow-hidden group cursor-pointer"
        onClick={scrollToProducts}
      >
        {/* Decorative background glow on hover */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/5 via-transparent to-[#8B0000]/10 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          
          {/* Animated Leaf Icon Badge */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-12 h-12 bg-[#FDFBF7] text-[#8B0000] rounded-full flex items-center justify-center border border-[#8B0000]/30 shadow-xs"
          >
            <Leaf className="w-5 h-5 text-[#8B0000]" />
          </motion.div>

          {/* Heading with Entrance Motion */}
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl md:text-4xl font-black text-[#1E1E1E] tracking-tight uppercase"
          >
            Sehatmand Zindagi Ki Taraf Pehla Kadam Utayein
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm md:text-base text-gray-600 font-medium max-w-lg mx-auto"
          >
            Humari khalis aur organic products abhi explore karein.
          </motion.p>

          {/* Interactive Button with Hover & Tap Animations */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-2"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(139, 0, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                scrollToProducts();
              }}
              className="bg-[#8B0000] hover:bg-[#700000] text-white font-black text-xs md:text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-lg flex items-center gap-2.5 transition-colors cursor-pointer group/btn"
            >
              <span>Explore Products</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}