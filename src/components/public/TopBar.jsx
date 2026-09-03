"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export default function TopBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-[#350000] via-[#480000] to-[#350000] text-gray-200 py-2 px-4 sm:px-6 text-xs border-b border-[#8B0000]/40 shadow-md relative z-50 overflow-hidden"
    >
      <div className="max-w-[1150px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        
        {/* Left Information Items with Entry Slide */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6"
        >
          {/* Delivery Info */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-1.5 text-gray-200 font-medium cursor-default"
          >
            <Truck className="w-3.5 h-3.5 text-[#ffcc00] animate-pulse" />
            <span>Fast Cash On Delivery Across Pakistan</span>
          </motion.div>

          {/* WhatsApp Contact with Original Full-Color WhatsApp Icon */}
          <motion.a
            href="https://wa.me/923258060699"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, color: "#ffcc00" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-gray-200 hover:text-[#ffcc00] transition-colors font-medium cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.104 1.516 5.828L.505 23.495l5.834-1.011C8.04 23.447 9.972 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              <path fill="#FFF" d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.445-.521.149-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            <span>WhatsApp: 03258060699</span>
          </motion.a>
        </motion.div>

        {/* Right Social Links with Smooth Hover Animations & Original Full-Color Icons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 text-gray-300 font-medium"
        >
          {/* Facebook Link */}
          <motion.a
            href="https://www.facebook.com/share/16hGh1KoLD/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 hover:text-[#ffcc00] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </motion.a>

          <span className="text-[#8B0000]">|</span>

          {/* Instagram Link */}
          <motion.a
            href="https://www.instagram.com/naimat.bazaar"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 hover:text-[#ffcc00] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fdf497" />
                  <stop offset="5%" stopColor="#fdf497" />
                  <stop offset="45%" stopColor="#fd5949" />
                  <stop offset="60%" stopColor="#d6249f" />
                  <stop offset="90%" stopColor="#285AEB" />
                </linearGradient>
              </defs>
              <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </motion.a>
        </motion.div>

      </div>
    </motion.div>
  );
}