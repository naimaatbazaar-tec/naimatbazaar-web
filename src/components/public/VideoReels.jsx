'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X, Star, Sparkles } from 'lucide-react';

const reelsData = [
  {
    id: 1,
    customerName: "Sara Khan",
    city: "Lahore",
    productName: "Rustom Power Talbina",
    caption: "Unboxing & Taste Test",
    rating: 5,
    videoUrl: "/videos/reel1.mp4", // public/videos/ folder path
    thumbnail: "/images/reel1-thumb.jpg" // Thumbnail image path
  },
  {
    id: 2,
    customerName: "Tariq Mahmood",
    city: "Karachi",
    productName: "Organic Oats with Nuts",
    caption: "Real Family Breakfast Review",
    rating: 5,
    videoUrl: "/videos/reel2.mp4",
    thumbnail: "/images/reel2-thumb.jpg"
  },
  {
    id: 3,
    customerName: "Mrs. Bilal",
    city: "Islamabad",
    productName: "Multicare Dermix",
    caption: "Skin Care Result & Packaging",
    rating: 5,
    videoUrl: "/videos/reel3.mp4",
    thumbnail: "/images/reel3-thumb.jpg"
  },
  {
    id: 4,
    customerName: "Usman Ali",
    city: "Multan",
    productName: "Pure Shilajit Resin",
    caption: "Purity Check & Unboxing",
    rating: 5,
    videoUrl: "/videos/reel4.mp4",
    thumbnail: "/images/reel4-thumb.jpg"
  }
];

export default function VideoReels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [activeModalVideo, setActiveModalVideo] = useState(null);

  // Responsive breakpoints matching ReviewsSection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reelsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reelsData.length - 1 ? 0 : prev + 1));
  };

  const getVisibleReels = () => {
    const visible = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % reelsData.length;
      visible.push({ 
        ...reelsData[index], 
        isCenter: i === Math.floor(itemsPerPage / 2) || itemsPerPage === 1 
      });
    }
    return visible;
  };

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Gold Pill Badge */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          <Sparkles size={14} className="text-amber-500 fill-amber-500" />
          Real Video Reviews
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#800000] tracking-wide uppercase mb-12">
          CUSTOMER UNBOXING REELS
        </h2>

        {/* Slider Controls & Carousel Grid */}
        <div className="relative flex items-center justify-center">
          
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:left-2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#800000] transition-all cursor-pointer"
            aria-label="Previous Reel"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center w-full max-w-5xl px-8">
            {getVisibleReels().map((reel, idx) => {
              const isFeatured = reel.isCenter && itemsPerPage === 3;

              return (
                <motion.div
                  key={`${reel.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: isFeatured ? 1.05 : 0.98 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveModalVideo(reel)}
                  className={`relative rounded-3xl overflow-hidden aspect-[9/16] max-h-[460px] mx-auto w-full cursor-pointer group transition-all bg-gray-900 ${
                    isFeatured
                      ? 'border-4 border-[#800000] shadow-2xl z-10'
                      : 'border border-gray-200 shadow-sm opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Background Thumbnail Image / Placeholder */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${reel.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
                  </div>

                  {/* Top Badge for Featured Reel */}
                  {isFeatured && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#800000] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-10">
                      LIVE UNBOXING
                    </div>
                  )}

                  {/* Center Animated Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#800000] transition-all duration-300 shadow-lg">
                      <Play size={26} className="fill-current ml-1" />
                    </div>
                  </div>

                  {/* Bottom Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 text-left text-white space-y-2">
                    
                    {/* Tagged Product Pill */}
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                      📦 {reel.productName}
                    </span>

                    {/* Caption */}
                    <p className="text-sm font-extrabold line-clamp-2 leading-snug">
                      "{reel.caption}"
                    </p>

                    {/* Star Rating & Customer Details */}
                    <div className="pt-1 border-t border-white/20 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black">{reel.customerName}</div>
                        <div className="text-[10px] text-gray-300 font-medium">{reel.city}</div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(reel.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 sm:right-2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#800000] transition-all cursor-pointer"
            aria-label="Next Reel"
          >
            <ChevronRight size={22} />
          </button>

        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reelsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-[#800000]'
                  : 'w-2 h-2 bg-gray-300'
              }`}
              aria-label={`Go to reel ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Video Popup Modal */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-black rounded-3xl overflow-hidden max-w-sm w-full aspect-[9/16] shadow-2xl border border-gray-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalVideo(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#800000] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Video Player */}
              <video
                src={activeModalVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
