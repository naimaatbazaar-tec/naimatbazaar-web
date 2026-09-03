"use client";

import { motion } from "framer-motion";
import { 
  Phone, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Leaf, 
  Wheat, 
  Nut, 
  Sparkles,
  Star
} from "lucide-react";
import {
  footerContactData,
  productCategoriesData,
  customerCareData,
  paymentMethodsData,
} from "@/data/footerData";

// Map icon string names to actual Lucide components
const iconMapping = {
  Phone: Phone,
  MapPin: MapPin,
  Truck: Truck,
};

export default function Footer() {
  return (
    <footer className="bg-[#5c0000] text-[#dddddd] pt-12 pb-8 px-4 sm:px-6 relative overflow-hidden border-t border-[#8B0000]/40">
      
      {/* ================= FLOATING PURE ICONS (NO TEXT) ================= */}
      
      {/* 1. Herb / Leaf Icon - Top Left Side Gap */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-10 sm:left-20 bg-[#480000]/80 border border-[#ffcc00]/40 p-3 rounded-full text-[#ffcc00] shadow-lg backdrop-blur-md pointer-events-none z-0 hidden sm:flex items-center justify-center"
      >
        <Leaf className="w-5 h-5 text-[#ffcc00]" />
      </motion.div>

      {/* 2. Oats / Wheat Icon - Top Right Side Gap */}
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-28 right-10 sm:right-24 bg-[#480000]/80 border border-[#ffcc00]/40 p-3 rounded-full text-[#ffcc00] shadow-lg backdrop-blur-md pointer-events-none z-0 hidden sm:flex items-center justify-center"
      >
        <Wheat className="w-5 h-5 text-[#ffcc00]" />
      </motion.div>

      {/* 3. Dry Fruits / Nut Icon - Middle Left Surroundings */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-36 left-12 sm:left-28 bg-[#480000]/80 border border-[#ffcc00]/40 p-3 rounded-full text-[#ffcc00] shadow-lg backdrop-blur-md pointer-events-none z-0 hidden lg:flex items-center justify-center"
      >
        <Nut className="w-5 h-5 text-[#ffcc00]" />
      </motion.div>

      {/* 4. Organic Sparkles Icon - Middle Right Surroundings */}
      <motion.div
        animate={{ y: [0, -14, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-40 right-12 sm:right-28 bg-[#480000]/80 border border-[#ffcc00]/40 p-3 rounded-full text-[#ffcc00] shadow-lg backdrop-blur-md pointer-events-none z-0 hidden lg:flex items-center justify-center"
      >
        <Sparkles className="w-5 h-5 text-[#ffcc00]" />
      </motion.div>

      {/* 5. Golden Star Icon - Mid Center Background Accent */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-1/2 left-6 sm:left-16 bg-[#480000]/60 border border-[#ffcc00]/30 p-2.5 rounded-full text-[#ffcc00] shadow-md backdrop-blur-sm pointer-events-none z-0 hidden xl:flex items-center justify-center"
      >
        <Star className="w-4 h-4 text-[#ffcc00]" />
      </motion.div>


      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="max-w-[1150px] mx-auto space-y-10 relative z-10">
        
        {/* Top Newsletter Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#480000] border border-[#8B0000]/60 rounded-3xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden"
        >
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
              Subscribe to our newsletter
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              Get instant updates on fresh organic stocks & exclusive discounts
            </p>

            {/* Newsletter Input Box */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex flex-col sm:flex-row items-center gap-2 bg-[#350000] p-1.5 sm:rounded-full rounded-2xl border border-[#8B0000] shadow-inner"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full bg-transparent px-4 py-3 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none text-center sm:text-left"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#a30000] text-white px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full text-xs font-bold tracking-wide shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Middle Info Highlights Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-[#8B0000]/40 text-center md:text-left"
        >
          {footerContactData.map((item, index) => {
            const IconComponent = iconMapping[item.iconName] || Phone;
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row md:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 text-center sm:text-left"
              >
                <div className="w-12 h-12 bg-[#480000] border border-[#8B0000] rounded-full flex items-center justify-center text-[#ffcc00] shrink-0 shadow-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffcc00] mb-0.5">
                    {item.title}
                  </h4>
                  {item.lines.map((line, idx) => (
                    <p key={idx} className="text-xs text-gray-300">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Main Footer Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left"
        >
          {/* Brand Info with Properly Fit Animated Logo */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer inline-block"
            >
              {/* Rotating Golden Glow Ring */}
              <motion.div 
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ffcc00] via-[#fff099] to-[#ff9900] opacity-80 blur-[3px]"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.06, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                }}
              />

              {/* Logo Circle Wrapper */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-20 h-20 bg-transparent rounded-full flex items-center justify-center shadow-2xl border-2 border-[#ffcc00] overflow-hidden z-10"
              >
                <motion.img
                  src="/images/favicon.png"
                  alt="Naimat Bazaar Logo"
                  className="w-full h-full object-contain"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            <p className="text-[11px] text-gray-300 leading-relaxed">
              100% Pure Organic Foods, Premium Talbina, Dry Fruits & Natural
              Herbal Wellness Products.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#480000] border border-[#8B0000] rounded-full text-[10px] text-[#ffcc00] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Guaranteed Pure & Fresh</span>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-[#ffcc00] text-xs font-bold uppercase tracking-wider mb-3">
              Product Categories
            </h4>
            <ul className="space-y-2 text-[11px]">
              {productCategoriesData.map((cat, idx) => (
                <li key={idx}>
                  <a
                    href={cat.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[#ffcc00] text-xs font-bold uppercase tracking-wider mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-[11px]">
              {customerCareData.map((care, idx) => (
                <li key={idx}>
                  <a
                    href={care.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {care.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 flex flex-col items-center sm:items-start">
            <h4 className="text-[#ffcc00] text-xs font-bold uppercase tracking-wider">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {paymentMethodsData.map((method, idx) => (
                <span
                  key={idx}
                  className={`bg-white font-extrabold text-[10px] px-2.5 py-1 rounded shadow-sm ${method.textColor}`}
                >
                  {method.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-[#8B0000]/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-center text-[10px] text-gray-400 gap-2">
          <p>© 2026 Naimat Bazaar. All Rights Reserved.</p>
          <p className="text-[#ffcc00] font-medium">
            Delivering Pure Organic Health Across Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}