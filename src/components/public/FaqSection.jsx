'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, HelpCircle } from 'lucide-react';
import api from '@/lib/api'; // Ensure this points to your configured axios instance

export default function FaqSection() {
  const [faqsList, setFaqsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0); // Set default open index (0)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await api.get('/faqs');
        if (data.success) {
          // Map backend schema (question, answer) to match your UI template keys (q, a)
          const formattedFaqs = data.data.map(item => ({
            q: item.question,
            a: item.answer,
            category: item.category
          }));
          setFaqsList(formattedFaqs);
        }
      } catch (err) {
        console.error('Failed to load store FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // If loading or empty, you can return a placeholder or hidden section
  if (loading || faqsList.length === 0) {
    return null; 
  }

  return (
    <section className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-12 md:py-16" id="faq">
      
      {/* Top Badge & Heading */}
      <div className="text-center mb-8 md:mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FDFBF7] border border-[#E6D5C3]/60 text-[#8B0000] text-xs font-bold tracking-wider uppercase shadow-xs"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Got Questions?</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-[#8B0000] tracking-tight font-serif"
        >
          Frequently Asked Questions
        </motion.h2>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {faqsList.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-sm overflow-hidden border ${
                isOpen 
                  ? 'bg-white border-[#8B0000] shadow-md ring-2 ring-[#8B0000]/10' 
                  : 'bg-white border-gray-200/80 hover:border-gray-300'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full p-4 sm:p-5 md:p-6 flex justify-between items-center text-left focus:outline-none cursor-pointer group"
              >
                <span className={`text-sm sm:text-base md:text-lg font-bold transition-colors duration-300 ${
                  isOpen ? 'text-[#8B0000]' : 'text-[#1E1E1E] group-hover:text-[#8B0000]'
                }`}>
                  {faq.q}
                </span>

                {/* Animated Icon Container */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isOpen 
                      ? 'bg-[#8B0000] text-white' 
                      : 'bg-gray-100 text-gray-700 group-hover:bg-[#8B0000]/10 group-hover:text-[#8B0000]'
                  }`}
                >
                  {isOpen ? (
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </motion.div>
              </button>

              {/* Animated Expandable Answer Section */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-4 sm:px-5 md:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100/80 font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}