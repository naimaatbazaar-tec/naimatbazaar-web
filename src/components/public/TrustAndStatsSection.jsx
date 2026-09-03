'use client';

import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck, Heart, Users, Star } from 'lucide-react';
import { featureCardsData, statsData } from '@/data/TrustAndStatsSectionData';

// Map icon string names to actual Lucide components
const iconMapping = {
  Leaf: Leaf,
  ShieldCheck: ShieldCheck,
  Truck: Truck,
  Heart: Heart,
  Users: Users,
  Star: Star,
};

export default function TrustAndStatsSection() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8 lg:space-y-10" id="trust-features">
      
      {/* Top 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {featureCardsData.map((card, index) => {
          const IconComponent = iconMapping[card.iconName] || Leaf;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 35px -10px rgba(139, 0, 0, 0.15)"
              }}
              className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center shadow-md flex flex-col items-center justify-between group cursor-pointer transition-all duration-300"
            >
              {/* Animated Icon Container with On-Hover Dark Red State */}
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FDFBF7] group-hover:bg-[#8B0000] text-[#8B0000] group-hover:text-white rounded-full flex items-center justify-center mb-4 sm:mb-5 border border-[#E6D5C3]/40 group-hover:border-[#8B0000] shadow-xs transition-colors duration-300"
              >
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300" />
              </motion.div>

              {/* Text Information */}
              <div className="space-y-1.5 sm:space-y-2 w-full">
                <h3 className="text-sm sm:text-base font-black text-[#1E1E1E] group-hover:text-[#8B0000] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              {/* Decorative bottom active line accent */}
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: "40px" }}
                className="h-0.5 bg-[#8B0000] mt-4 sm:mt-5 rounded-full transition-all duration-300"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Red Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#8B0000] rounded-2xl md:rounded-3xl py-8 px-4 sm:px-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-white/20"
      >
        
        {statsData.map((stat, index) => {
          const StatIcon = iconMapping[stat.iconName] || Users;
          return (
            <div key={stat.id} className="flex items-center justify-center gap-4 py-4 md:py-0 first:pt-0 last:pb-0 md:first:pt-0 md:last:pb-0">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
                className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center border border-white/25 shrink-0 shadow-inner"
              >
                <StatIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.hasStarIcon ? 'fill-white text-white' : 'text-white'}`} />
              </motion.div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">{stat.value}</h4>
                  {stat.hasStarIcon && <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />}
                </div>
                <p className="text-[11px] sm:text-xs text-white/80 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}

      </motion.div>

    </section>
  );
}