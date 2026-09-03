'use client';

import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 bg-[#5c0000] text-white flex justify-between items-center">
          <h2 className="text-lg font-bold">Shopping Cart ({cart.length})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-2xl hover:opacity-80"
          >
            &times;
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 my-8">
              Your cart is currently empty.
            </p>
          ) : (
            cart.map((item, index) => {
              // Resolve properties safely regardless of cart structure
              const title = item.title || item.product?.title || 'Product';
              const grammage = item.grammage || item.variant?.grammage || '';
              const price = item.price || item.variant?.price || 0;
              const itemKey = item.product?._id
                ? `${item.product._id}-${grammage || index}`
                : item._id || index;

              return (
                <div
                  key={itemKey}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    {grammage && (
                      <p className="text-xs text-gray-500">
                        Grammage: {grammage}
                      </p>
                    )}
                    <p className="text-sm font-bold text-[#5c0000]">
                      Rs. {price}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQty(index, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(index, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => updateQty(index, 0)}
                      className="text-red-500 text-xs ml-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal:</span>
              <span className="text-[#5c0000]">
                Rs. {subtotal || cart.reduce((acc, i) => acc + (i.price || 0) * i.qty, 0)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center py-3 bg-[#5c0000] text-white font-semibold rounded-md hover:bg-[#400000] transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}