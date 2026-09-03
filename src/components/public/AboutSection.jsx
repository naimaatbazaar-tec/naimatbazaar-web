'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Leaf } from 'lucide-react';
import { aboutAccordionData } from '@/data/AboutSectionData';

export default function AboutSection() {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#FDFBF7]" id="about-us">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Top Header info */}
        <div className="text-center mb-12 space-y-3">
          
          {/* Main Top Tag */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#F7F2EC] text-[#8B0000] px-4 py-1.5 rounded-full text-xs font-bold border border-[#E6D5C3] shadow-xs"
          >
            <Leaf className="w-3.5 h-3.5 text-[#8B0000]" />
            <span>NAIMAT BAZAAR — ABOUT US</span>
            <Leaf className="w-3.5 h-3.5 text-[#8B0000]" />
          </motion.div>

          {/* Tagline on the Next Line with Rounded Border & Radius */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block text-xs font-bold text-[#8B0000] border border-[#8B0000]/30 bg-red-50/50 py-1 px-5 rounded-full tracking-wide shadow-xs mt-2"
            >
              🌿 Her Dana, Shifa ka Khazana
            </motion.div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-black text-[#1E1E1E] tracking-tight uppercase pt-2"
          >
            Purity Aur Trust Ka Dusra Naam — <span className="text-[#8B0000]">Naimat Bazaar</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm text-gray-600 font-medium"
          >
            Aap ki sehat aur khoobsurati ke liye 100% khalis aur natural products
          </motion.p>
        </div>

        {/* Main Box Container with Full Entrance Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          
          {/* Left Column: Accordion */}
          <div className="lg:col-span-6 space-y-3">
            <div className="mb-3">
              <span className="text-[11px] font-black tracking-widest text-[#8B0000] uppercase">
                Humari Kahani
              </span>
              <h3 className="text-lg md:text-xl font-black text-[#1E1E1E] mt-0.5">
                Khalis Ajzaa Se Tayyar Karda Sehatmand Shifa
              </h3>
            </div>

            {aboutAccordionData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={item.id}
                  initial={false}
                  animate={{ 
                    borderColor: "#8B0000",
                    backgroundColor: isOpen ? "#FFFDF9" : "#FFFFFF"
                  }}
                  className="border border-[#8B0000] rounded-2xl overflow-hidden shadow-xs transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-3.5 md:p-4 text-left font-bold text-[#8B0000] cursor-pointer"
                  >
                    <span className="text-xs md:text-sm">{item.title}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#8B0000]"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-3.5 pb-4 md:px-4 text-[11px] md:text-xs text-gray-600 leading-relaxed border-t border-red-100 pt-2.5">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Animated Image Showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
            >
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src="/images/aboutus.png" 
                alt="Naimat Bazaar Products Showcase" 
                className="w-full h-[320px] md:h-[380px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}