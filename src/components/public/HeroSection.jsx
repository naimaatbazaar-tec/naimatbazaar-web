"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, PackageCheck, Flame, ArrowRight, MessageCircle } from "lucide-react";
import { heroData } from "@/data/HeroSectionData";
import HeroProduct from './HeroProduct';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF9] py-12 md:py-16 px-4 border-b border-gray-100" id="home">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 text-left space-y-6">
          
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-200/60 shadow-sm"
          >
            <span className="text-emerald-600">★</span> {heroData.badge}
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#1E1E1E] font-black tracking-tight leading-[1.15]">
            {heroData.headingMain}{" "}
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[#8B0000] inline-block"
            >
              {heroData.headingHighlight}
            </motion.span>
          </h1>

          {/* Product Badges / Pills Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap gap-2 max-w-[620px]">
              {heroData.productTags.map((tag, idx) => (
                <span 
                  key={idx}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border shadow-sm ${tag.bg}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-700 font-medium pt-1">
              {heroData.deliveryNote}
            </p>
          </motion.div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap gap-y-2 gap-x-6 pt-1 text-sm text-gray-700 font-medium">
            {heroData.trustPoints.map((point, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
                {point}
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <motion.a 
              href={heroData.primaryCta.href} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-[#8B0000] text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-red-900/20 hover:bg-[#700000] transition-colors"
            >
              {heroData.primaryCta.text} <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a 
              href={heroData.whatsappCta.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 border border-emerald-300 px-7 py-3.5 rounded-full font-bold text-sm shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" /> {heroData.whatsappCta.text}
            </motion.a>
          </motion.div>

          {/* Rating Section */}
          <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-200">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              <strong className="text-gray-900 font-bold">{heroData.rating.score}</strong> {heroData.rating.reviewText}
            </p>
          </div>
        </div>

        {/* Right Column: Floating Product Visuals */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]">
          
          <motion.div
            animate={{ y: [-12, 12, -12], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 left-6 text-2xl opacity-60 z-0 pointer-events-none select-none"
          >
            🌾
          </motion.div>

          <motion.div
            animate={{ y: [10, -14, 10], rotate: [-10, 5, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-6 right-8 text-2xl opacity-50 z-0 pointer-events-none select-none"
          >
            🌿
          </motion.div>

          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/2 right-2 text-xl z-0 pointer-events-none select-none"
          >
            ✨
          </motion.div>

          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 left-2 text-xl opacity-45 z-0 pointer-events-none select-none"
          >
            ⭐
          </motion.div>

          <HeroProduct />

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [-15, 5, -15], x: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-2 left-0 sm:-left-2 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-gray-900">{heroData.floatingBadges.khalis.title}</h4>
              <p className="text-[10px] text-gray-500">{heroData.floatingBadges.khalis.subtitle}</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [5, -12, 5], x: [5, -3, 5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-2 right-0 sm:-right-2 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold shadow-inner">
              <PackageCheck className="w-5 h-5 text-red-800" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-gray-900">{heroData.floatingBadges.openParcel.title}</h4>
              <p className="text-[10px] text-gray-500">{heroData.floatingBadges.openParcel.subtitle}</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -8, 10], x: [-3, 3, -3] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-0 left-2 sm:left-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-gray-900">{heroData.floatingBadges.sales.title}</h4>
              <p className="text-[10px] text-gray-500">{heroData.floatingBadges.sales.subtitle}</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}