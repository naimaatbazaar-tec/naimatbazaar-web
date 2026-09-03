'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') || 'NB-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 text-center space-y-8 relative overflow-hidden"
      >
        {/* Top Decorative Background Banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-[#5c0000]" />

        {/* Animated Checkmark Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 bg-[#5c0000]/10 text-[#5c0000] rounded-full flex items-center justify-center mx-auto shadow-inner"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-12 h-12 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>

        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Your order has been placed successfully. We are preparing your organic items for dispatch.
          </p>
        </motion.div>

        {/* Order Reference Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#5c0000]/5 border border-[#5c0000]/20 rounded-2xl p-6 text-left space-y-3"
        >
          <div className="flex justify-between items-center border-b border-[#5c0000]/10 pb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Reference ID</span>
            <span className="text-base font-black text-[#5c0000]">#{orderId}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 pt-1">
            <div>
              <p className="font-bold text-gray-800">Status</p>
              <p className="text-emerald-700 font-semibold flex items-center space-x-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                <span>Processing</span>
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Estimated Delivery</p>
              <p className="text-gray-700 font-medium mt-0.5">2 - 4 Business Days</p>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Verification Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left flex items-start space-x-3"
        >
          <span className="text-xl">💬</span>
          <div className="text-xs text-emerald-950 space-y-0.5">
            <p className="font-bold">Have questions or Online Payment Receipt?</p>
            <p className="text-emerald-800">
              Share your payment screenshot or order ID with us on WhatsApp at{' '}
              <a href="https://wa.me/923258060699" target="_blank" rel="noreferrer" className="font-bold underline">
                +92 325 8060699
              </a>.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="flex-1 py-4 bg-[#5c0000] text-white font-bold rounded-2xl hover:bg-[#420000] transition shadow-lg text-sm"
          >
            Continue Shopping
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="py-4 px-6 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition text-sm"
          >
            Print Receipt
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading Order Confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}