'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import api from '@/lib/api';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);

  // 1. Fetch reviews hook
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews');
        if (data.success) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error('Failed to load store reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 2. Responsive layout configuration hook
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

  const maxIndex = reviews.length > 0 ? reviews.length - 1 : 0;

  // 3. Infinite sliding auto effect hook
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex, reviews.length]);

  // ALL HOOKS ARE DECLARED ABOVE. Now safe to do conditional returns.
  if (loading || reviews.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const getVisibleCards = () => {
    const cards = [];
    const count = itemsPerPage;
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % reviews.length;
      cards.push({ ...reviews[index], originalIndex: index });
    }
    return cards;
  };

  const visibleReviews = getVisibleCards();

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-16 overflow-visible" id="reviews">
      <div className="text-center space-y-4 mb-12">
        
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 bg-[#FDFBF7] text-[#8B0000] px-5 py-1.5 rounded-full text-xs font-bold border border-[#E6D5C3] shadow-xs"
        >
          <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
          <span>10,000+ SATISFIED FAMILIES</span>
        </motion.div>

        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl font-black text-[#8B0000] tracking-tight uppercase"
        >
          Satisfied Customer Reviews
        </motion.h2>
      </div>

      {/* Carousel Track Wrapper */}
      <div className="relative px-6 sm:px-12 lg:px-16 py-8">
        
        {/* Navigation Left Arrow */}
        <motion.button 
          whileHover={{ scale: 1.15, backgroundColor: "#8B0000", color: "#ffffff" }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute -left-2 sm:left-1 lg:-left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 bg-white border border-gray-200 text-[#8B0000] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-colors duration-300"
          aria-label="Previous Review"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Viewport Track */}
        <div className="overflow-visible py-6">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="flex gap-6 items-center justify-center w-full"
          >
            {visibleReviews.map((r, localIdx) => {
              const isCenter = Math.floor(itemsPerPage / 2) === localIdx;

              return (
                <motion.div 
                  key={`${r._id || r.originalIndex}-${localIdx}`}
                  style={{ width: `calc(${100 / itemsPerPage}% - ${(gap => gap * (itemsPerPage - 1) / itemsPerPage)(24)}px)` }}
                  animate={{
                    scale: isCenter ? 1.08 : 0.94,
                    y: isCenter ? -12 : 0,
                    opacity: isCenter ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-colors duration-500 relative shrink-0 ${
                    isCenter 
                      ? "bg-gradient-to-b from-white to-[#FFFDF9] border-2 border-[#8B0000] shadow-2xl shadow-[#8B0000]/15 z-20" 
                      : "bg-white border border-gray-200/80 shadow-md opacity-75 z-10"
                  }`}
                >
                  {isCenter && (
                    <div className="absolute -top-3.5 right-6 bg-[#8B0000] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-30">
                      FEATURED REVIEW
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1 text-[#FFD700] mb-4">
                      {[...Array(r.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      ))}
                    </div>

                    <p className={`text-xs md:text-sm leading-relaxed font-medium mb-6 italic transition-colors duration-300 ${
                      isCenter ? "text-gray-900 font-semibold" : "text-gray-600"
                    }`}>
                      "{r.text}"
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#8B0000]">
                        {r.author}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {r.location}
                      </p>
                    </div>
                    {isCenter && (
                      <span className="w-2 h-2 rounded-full bg-[#8B0000] animate-ping" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation Right Arrow */}
        <motion.button 
          whileHover={{ scale: 1.15, backgroundColor: "#8B0000", color: "#ffffff" }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute -right-2 sm:right-1 lg:-right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 bg-white border border-gray-200 text-[#8B0000] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-colors duration-300"
          aria-label="Next Review"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === index ? "w-8 bg-[#8B0000]" : "w-2 bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}