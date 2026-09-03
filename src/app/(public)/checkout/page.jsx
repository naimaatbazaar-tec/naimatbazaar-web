'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useShop();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: 'Lahore',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // 'ONLINE' or 'COD'
  const [onlineProvider, setOnlineProvider] = useState('jazzcash');
  const [shippingFee] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.variant?.price || item.price || 0;
    const qty = item.qty || item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const finalShipping = subtotal > 3000 ? 0 : shippingFee;
  const grandTotal = subtotal + finalShipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmitOrder = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    const orderNumber = 'NB-' + Math.floor(100000 + Math.random() * 900000);

    const orderPayload = {
      orderNumber,
      user: user?._id || null,

// Inside handleSubmitOrder items map:
items: cart.map((item) => {
  const productId =
    item._id ||
    item.productId ||
    item.product?._id ||
    (typeof item.product === 'string' ? item.product : null);

  return {
    productId: productId, // 👈 Matches backend server-side loop: item.productId
    product: productId,   // 👈 Backup field
    title: item.title || item.product?.title || 'Product',
    grammage: item.grammage || item.variant?.grammage || '',
    price: Number(item.price || item.variant?.price || 0),
    qty: Number(item.qty || item.quantity || 1),
  };
}),
user: user?._id || user?.id || JSON.parse(localStorage.getItem('user') || '{}')?._id || null,

      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      subtotal,
      deliveryFee: finalShipping,
      total: grandTotal,
      paymentMethod: paymentMethod === 'COD' ? 'cod' : 'card',
      paymentStatus: 'pending',
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(orderPayload),
    });

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await res.text();
      throw new Error('Server returned an invalid response.');
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to place order.');
    }

    if (clearCart) clearCart();
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');

    const createdOrderNum = data.orderNumber || data.order?.orderNumber || orderNumber;
    router.push(`/order-success?orderId=${createdOrderNum}`);
  } catch (err) {
    console.error('Order Submission Error:', err);
    setError(err.message || 'Something went wrong while placing your order.');
  } finally {
    setIsSubmitting(false);
  }
};

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="px-8 py-3.5 bg-[#5c0000] text-white font-bold rounded-xl hover:bg-[#420000] transition shadow-md"
        >
          Browse Products
        </motion.button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 text-center tracking-tight"
        >
          Secure Checkout
        </motion.h1>

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-100 border border-red-300 text-red-700 font-medium text-sm rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Address Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl space-y-5">
              <h2 className="text-xl font-black text-gray-900 border-b pb-3 flex items-center space-x-2">
                <span className="bg-[#5c0000] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Shipping Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                    placeholder="e.g. Ahmad Khan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                    placeholder="03XXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                  placeholder="ahmad@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Complete Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                  placeholder="House/Plot #, Street, Block, Area"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code (Optional)</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] focus:border-[#5c0000] outline-none transition"
                  placeholder="Instructions for courier..."
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl space-y-5">
              <h2 className="text-xl font-black text-gray-900 border-b pb-3 flex items-center space-x-2">
                <span className="bg-[#5c0000] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Online Payment Option */}
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex flex-col justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${
                    paymentMethod === 'ONLINE'
                      ? 'border-[#5c0000] bg-[#5c0000]/5 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <span className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    ★ Recommended
                  </span>
                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      type="radio"
                      name="payment"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="accent-[#5c0000] w-4 h-4"
                    />
                    <span className="font-extrabold text-gray-900 text-sm">Pay Online</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-7">JazzCash, EasyPaisa, or Direct Bank Transfer.</p>
                </motion.label>

                {/* Cash on Delivery Option */}
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex flex-col justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-[#5c0000] bg-[#5c0000]/5 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <span className="absolute -top-3 right-4 bg-[#5c0000] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Popular
                  </span>
                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-[#5c0000] w-4 h-4"
                    />
                    <span className="font-extrabold text-gray-900 text-sm">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-7">Pay cash upon delivery at your doorstep.</p>
                </motion.label>
              </div>

              {/* Expandable Online Transfer Details */}
              <AnimatePresence>
                {paymentMethod === 'ONLINE' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t space-y-4 overflow-hidden"
                  >
                    <p className="text-xs font-bold text-gray-700">Choose Online Payment Service:</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setOnlineProvider('jazzcash')}
                        className={`py-3 px-2 text-xs font-bold rounded-xl border transition ${
                          onlineProvider === 'jazzcash'
                            ? 'bg-[#5c0000] text-white border-[#5c0000] shadow-md'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        JazzCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlineProvider('easypaisa')}
                        className={`py-3 px-2 text-xs font-bold rounded-xl border transition ${
                          onlineProvider === 'easypaisa'
                            ? 'bg-[#5c0000] text-white border-[#5c0000] shadow-md'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        EasyPaisa
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlineProvider('bank')}
                        className={`py-3 px-2 text-xs font-bold rounded-xl border transition ${
                          onlineProvider === 'bank'
                            ? 'bg-[#5c0000] text-white border-[#5c0000] shadow-md'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Bank Transfer
                      </button>
                    </div>

                    <div className="bg-[#5c0000]/5 border border-[#5c0000]/20 rounded-2xl p-4 text-xs space-y-1 text-gray-900">
                      {onlineProvider === 'jazzcash' && (
                        <>
                          <p className="font-bold text-sm text-[#5c0000]">JazzCash Details:</p>
                          <p>Account Number: <span className="font-mono font-bold text-[#5c0000]">03258060699</span></p>
                          <p>Account Title: <span className="font-semibold">Naimat Bazaar</span></p>
                        </>
                      )}
                      {onlineProvider === 'easypaisa' && (
                        <>
                          <p className="font-bold text-sm text-[#5c0000]">EasyPaisa Details:</p>
                          <p>Account Number: <span className="font-mono font-bold text-[#5c0000]">03258060699</span></p>
                          <p>Account Title: <span className="font-semibold">Naimat Bazaar</span></p>
                        </>
                      )}
                      {onlineProvider === 'bank' && (
                        <>
                          <p className="font-bold text-sm text-[#5c0000]">Meezan Bank Details:</p>
                          <p>Account Number: <span className="font-mono font-bold text-[#5c0000]">01020109283741</span></p>
                          <p>Account Title: <span className="font-semibold">Naimat Bazaar Official</span></p>
                        </>
                      )}
                      <p className="text-[11px] text-gray-500 pt-1 border-t mt-2">
                        * Please share payment receipt on WhatsApp (03258060699) after placing order.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl sticky top-8 space-y-6">
              <h2 className="text-xl font-black text-gray-900 border-b pb-3">Order Summary</h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const title = item.product?.title || item.title || 'Product';
                  const price = item.variant?.price || item.price || 0;
                  const qty = item.qty || item.quantity || 1;
                  const grammage = item.variant?.grammage || item.grammage;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center text-sm border-b pb-3"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{title}</p>
                        {grammage && <p className="text-xs text-gray-500">Weight: {grammage}</p>}
                        <p className="text-xs text-gray-500">
                          Rs. {price} × {qty}
                        </p>
                      </div>
                      <p className="font-extrabold text-[#5c0000]">Rs. {(price * qty).toLocaleString()}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t pt-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {finalShipping === 0 ? (
                      <span className="text-[#5c0000] font-bold">FREE</span>
                    ) : (
                      `Rs. ${finalShipping}`
                    )}
                  </span>
                </div>
                {subtotal <= 3000 && (
                  <p className="text-[11px] text-amber-800 font-medium">
                    Add Rs. {3000 - subtotal} more to get Free Delivery!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-300 pt-4 flex justify-between font-black text-xl text-gray-900">
                <span>Total Amount</span>
                <span className="text-[#5c0000]">Rs. {grandTotal.toLocaleString()}</span>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#5c0000] text-white font-bold rounded-2xl hover:bg-[#420000] transition shadow-xl disabled:bg-gray-400"
              >
                {isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}