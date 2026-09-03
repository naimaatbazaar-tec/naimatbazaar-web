'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Adjust path if your AuthContext is located elsewhere

export default function CartDrawer({ isOpen, setIsOpen, cart = [], updateQty }) {
  const router = useRouter();
  const { user } = useAuth(); // Retrieve current logged-in user state

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.variant?.price || item.price || 0;
    return acc + price * item.qty;
  }, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsOpen(false);

    if (!user) {
      // Redirect to login page if user is not authenticated
      router.push('/login?redirect=/checkout');
    } else {
      // Proceed directly to checkout if authenticated
      router.push('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex justify-between items-center">
          <h2 className="text-lg font-bold">Shopping Cart ({cart.length})</h2>
          <button onClick={() => setIsOpen(false)} className="text-2xl hover:opacity-80">
            &times;
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 my-8">Your cart is currently empty.</p>
          ) : (
            cart.map((item, index) => {
              const itemKey = item.product?._id 
                ? `${item.product._id}-${item.variant?.grammage || index}`
                : item.id || index;
              
              const title = item.product?.title || item.title || 'Product';
              const grammage = item.variant?.grammage || item.grammage;
              const price = item.variant?.price || item.price || 0;

              return (
                <div key={itemKey} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    {grammage && <p className="text-xs text-gray-500">Grammage: {grammage}</p>}
                    <p className="text-sm font-bold text-emerald-700">Rs. {price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQty(itemKey, item.qty - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(itemKey, item.qty + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => updateQty(itemKey, 0)}
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
              <span className="text-emerald-800">Rs. {subtotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="block w-full text-center py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}