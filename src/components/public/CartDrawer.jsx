'use client';

import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    subtotal,
    clearCart,
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50"
        />

        {/* Drawer Sliding Animation */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full flex flex-col shadow-xl z-10"
        >
          {/* Header */}
          <div className="p-4 bg-[#5c0000] text-white flex justify-between items-center shadow-md">
            <h2 className="text-lg font-bold">Shopping Cart ({cart.reduce((acc, item) => acc + item.qty, 0)})</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-2xl hover:opacity-80 transition-opacity cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-500 my-16 space-y-2"
              >
                <p className="text-4xl">🛒</p>
                <p className="text-sm font-semibold">Your cart is currently empty.</p>
              </motion.div>
            ) : (
              cart.map((item, index) => {
                const title = item.title || item.product?.title || 'Product';
                const grammage = item.grammage || item.variant?.grammage || '';
                const price = item.price || item.variant?.price || 0;
                const image = item.image || item.product?.image || '/placeholder.png';
                
                const itemKey = item.product?._id
                  ? `${item.product._id}-${grammage || index}`
                  : item._id || index;

                return (
                  <motion.div
                    key={itemKey}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between border-b pb-3 gap-3 bg-gray-50/50 p-2.5 rounded-lg border-gray-100 shadow-2xs"
                  >
                    {/* Product Image & Details */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={image} 
                        alt={title} 
                        className="w-14 h-14 object-cover rounded-md border border-gray-200 bg-white shadow-2xs shrink-0" 
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-xs line-clamp-1">{title}</h4>
                        {grammage && (
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Grammage: {grammage}
                          </p>
                        )}
                        <p className="text-xs font-black text-[#5c0000] mt-1">
                          Rs. {price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col items-end justify-between h-full gap-2">
                      <button
                        onClick={() => updateQty(itemKey, -item.qty)}
                        className="text-gray-400 hover:text-red-500 text-[10px] transition-colors cursor-pointer"
                      >
                        Remove
                      </button>

                      <div className="flex items-center space-x-1.5 bg-white border border-gray-200 rounded px-1.5 py-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQty(itemKey, -1)}
                          className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 font-bold text-xs text-gray-700 cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold text-xs w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(itemKey, 1)}
                          className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 font-bold text-xs text-gray-700 cursor-pointer transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t bg-gray-50 space-y-3 shadow-inner">
              <div className="flex justify-between font-bold text-base">
                <span>Subtotal:</span>
                <span className="text-[#5c0000]">
                  Rs. {(subtotal || cart.reduce((acc, i) => acc + (i.price || 0) * i.qty, 0)).toLocaleString()}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full text-center py-3 bg-[#5c0000] text-white font-semibold rounded-md hover:bg-[#400000] transition shadow-sm text-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}