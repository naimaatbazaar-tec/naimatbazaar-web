'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '@/context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart, openBlog } = useShop();

  // Normalize backend schema vs legacy frontend fields
  const variants = product.variants && product.variants.length > 0 
    ? product.variants 
    : (product.sizes || []);

  const defaultVariant = variants[0] || { grammage: 'Default', price: 0 };

  const [selectedGrammage, setSelectedGrammage] = useState(
    defaultVariant.grammage || defaultVariant.size
  );
  const [currentPrice, setCurrentPrice] = useState(
    defaultVariant.price || defaultVariant.sale || 0
  );

  // Extract main image URL safely from backend array or fallback string
  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]?.url || product.images[0]
    : product.image || '/placeholder.png';

  const handleVariantChange = (e) => {
    const grammageVal = e.target.value;
    const found = variants.find(
      (v) => (v.grammage || v.size) === grammageVal
    );
    
    setSelectedGrammage(grammageVal);
    if (found) {
      setCurrentPrice(found.price || found.sale || 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.12)" }}
      className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between shadow-sm transition-shadow duration-300"
    >
      <div>
        {/* Product Image */}
        <div className="w-full h-[170px] bg-gray-50 rounded-lg overflow-hidden mb-2.5 relative">
          {(product.badge || product.isFeatured) && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="absolute top-2 left-2 bg-[#5c0000] text-white text-[10px] px-2 py-0.5 rounded font-bold z-10 shadow-sm"
            >
              {product.badge || (product.isFeatured ? 'Featured' : 'Pure')}
            </motion.span>
          )}
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <h3 className="text-sm font-extrabold text-gray-900 mb-1">{product.title}</h3>
        <p className="text-xs text-gray-600 mb-2.5 min-h-[32px]">
          {product.description || product.target || '100% Khaalis & Organic'}
        </p>

        {/* Variant / Size Selector */}
        {variants.length > 0 && (
          <div className="mb-2">
            <label className="text-[11px] font-bold text-gray-600 block mb-1">
              Select Size / Grammage:
            </label>
            <select
              value={selectedGrammage}
              onChange={handleVariantChange}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-gray-50 mb-2 focus:outline-none focus:ring-1 focus:ring-[#5c0000] cursor-pointer transition-all"
            >
              {variants.map((v, i) => {
                const label = v.grammage || v.size;
                const price = v.price || v.sale;
                return (
                  <option key={i} value={label}>
                    {label} - Rs. {price?.toLocaleString()}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <div>
        {/* Price Section */}
        <div className="mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPrice}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[#5c0000] text-base font-black">
                Rs. {currentPrice.toLocaleString()}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Blog / Story Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openBlog && openBlog(product)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded mb-1.5 border border-gray-200 cursor-pointer transition-colors"
        >
          📖 Q Apky Liye Best ha?
        </motion.button>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product, selectedGrammage, currentPrice)}
          className="w-full bg-[#5c0000] hover:bg-[#400000] text-white border-none py-2 rounded font-bold text-xs cursor-pointer shadow-sm transition-colors"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}