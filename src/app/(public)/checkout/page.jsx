'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PAYMENT_METHODS, SUPPORT_WHATSAPP } from '@/data/paymentDetails';

// Cloudinary upload helper function
const uploadReceiptToCloudinary = async (file) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }
    
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useShop();
  const { user } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    postalCode: '',
    notes: '',
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [onlineProvider, setOnlineProvider] = useState('jazzcash');
  
  const [hasPaidConfirmed, setHasPaidConfirmed] = useState(false);
  const [paymentReceiptFile, setPaymentReceiptFile] = useState(null);

  const [baseShippingFee] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    try {
      const localSaved = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
      if (localSaved.length > 0) {
        setSavedAddresses(localSaved);
      } else {
        const sampleAddresses = [
          {
            fullName: 'Ahmad Khan',
            phone: '03014150287',
            addressLine: 'House 123, Street 4, Phase 2, DHA',
            city: 'Lahore',
            postalCode: '54792'
          },
          {
            fullName: 'Ahmad Khan',
            phone: '03014150287',
            addressLine: 'Office 45, Main Boulevard, Gulberg III',
            city: 'Lahore',
            postalCode: '54660'
          }
        ];
        setSavedAddresses(sampleAddresses);
      }
    } catch (e) {
      console.error('Failed to load saved addresses', e);
    }
  }, []);

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

  if (!isMounted) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto pb-16 text-center">
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => {
    const price = item.variant?.price || item.price || 0;
    const qty = item.qty || item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const standardShipping = subtotal > 3000 ? 0 : baseShippingFee;
  const finalShipping = paymentMethod === 'COD' ? standardShipping + 300 : standardShipping;
  const grandTotal = subtotal + finalShipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (addr, idx) => {
    setSelectedAddressIndex(idx);
    setFormData((prev) => ({
      ...prev,
      fullName: addr.fullName || prev.fullName,
      phone: addr.phone || prev.phone,
      email: addr.email || prev.email,
      address: addr.addressLine || '',
      city: addr.city || 'Lahore',
      postalCode: addr.postalCode || '',
    }));
  };

  const handleAddNewAddressOption = () => {
    setSelectedAddressIndex(null);
    setFormData((prev) => ({
      ...prev,
      address: '',
      postalCode: '',
    }));
  };

  const isFormValid = paymentMethod === 'COD' || hasPaidConfirmed;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'ONLINE' && (!hasPaidConfirmed || !paymentReceiptFile)) {
      setError('Please confirm your payment and upload your payment receipt/screenshot to proceed.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = null;

      if (paymentReceiptFile) {
        imageUrl = await uploadReceiptToCloudinary(paymentReceiptFile);
        if (!imageUrl) {
          setIsSubmitting(false);
          setError('Failed to upload payment receipt image to Cloudinary.');
          return;
        }
      }

      await saveOrderAndRedirect(imageUrl);
    } catch (err) {
      console.error('Order Submission Error:', err);
      setError(err.message || 'Something went wrong while placing your order.');
      setIsSubmitting(false);
    }
  };

  const saveOrderAndRedirect = async (receiptUrl) => {
    try {
      const token = localStorage.getItem('token');
      const orderNumber = 'NB-' + Math.floor(100000 + Math.random() * 900000);

      const currentShippingInfo = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
        const isDuplicate = existing.some(
          (addr) => addr.addressLine === currentShippingInfo.addressLine && addr.city === currentShippingInfo.city
        );
        if (!isDuplicate && currentShippingInfo.addressLine) {
          const updated = [currentShippingInfo, ...existing].slice(0, 3);
          localStorage.setItem('saved_addresses', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Error saving address locally', err);
      }

      const orderPayload = {
        orderNumber,
        items: cart.map((item) => {
          const resolvedProductId =
            item?.productId ||
            item?._id ||
            item?.product?._id ||
            (typeof item?.product === 'string' ? item?.product : null);

          return {
            product: resolvedProductId,
            title: item.title || item.product?.title || 'Product',
            image: item.image || item.imageUrl || item.img || item.product?.image || '',
            grammage: item.grammage || item.variant?.grammage || '',
            price: Number(item.variant?.price || item.price || 0),
            qty: Number(item.qty || item.quantity || 1),
          };
        }),
        user: user?._id || user?.id || JSON.parse(localStorage.getItem('user') || '{}')?._id || null,
        shippingInfo: currentShippingInfo,
        subtotal,
        deliveryFee: finalShipping,
        total: grandTotal,
        paymentMethod: paymentMethod === 'COD' ? 'cod' : 'online',
        paymentStatus: paymentMethod === 'ONLINE' ? 'verification_pending' : 'pending',
        paymentReceipt: receiptUrl || '',
      };

      const localReceiptSummary = {
        orderNumber,
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        shippingAddress: `${formData.address}, ${formData.city}`,
        paymentMethod: paymentMethod === 'ONLINE' ? `Online Payment (${onlineProvider.toUpperCase()})` : 'Cash on Delivery',
        items: cart.map((item) => ({
          name: item.title || item.product?.title || 'Product',
          quantity: item.qty || item.quantity || 1,
          price: Number(item.variant?.price || item.price || 0),
        })),
        shippingFee: finalShipping,
        paymentReceiptUrl: receiptUrl,
      };

      localStorage.setItem('latestOrder', JSON.stringify(localReceiptSummary));

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

  const currentDetails = PAYMENT_METHODS[onlineProvider];

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
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-7 space-y-6">
            
            {/* Shipping Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl space-y-5">
              <h2 className="text-xl font-black text-gray-900 border-b pb-3 flex items-center space-x-2">
                <span className="bg-[#5c0000] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">1</span>
                <span>Shipping Details</span>
              </h2>

              {savedAddresses.length > 0 && (
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      Select Saved Address ({savedAddresses.length})
                    </label>
                    {selectedAddressIndex !== null && (
                      <button
                        type="button"
                        onClick={handleAddNewAddressOption}
                        className="text-xs font-bold text-[#5c0000] hover:underline"
                      >
                        + Add New Address Instead
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr, idx) => {
                      const isSelected = selectedAddressIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectAddress(addr, idx)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#5c0000] bg-[#5c0000]/5 shadow-sm'
                              : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-xs text-gray-900">{addr.fullName || formData.fullName}</span>
                              {isSelected && (
                                <span className="bg-[#5c0000] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Selected</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{addr.addressLine}, {addr.city}</p>
                            <p className="text-[11px] text-gray-500 mt-1">{addr.phone}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" placeholder="e.g. Ahmad Khan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" placeholder="03XXXXXXXXX" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" placeholder="ahmad@gmail.com" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Complete Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" placeholder="House/Plot #, Street, Block, Area" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code (Optional)</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#5c0000] outline-none" placeholder="Instructions for courier..." />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl space-y-5">
              <h2 className="text-xl font-black text-gray-900 border-b pb-3 flex items-center space-x-2">
                <span className="bg-[#5c0000] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">2</span>
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.label whileHover={{ scale: 1.02 }} className={`relative flex flex-col justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'ONLINE' ? 'border-[#5c0000] bg-[#5c0000]/5 shadow-md' : 'border-gray-200'}`}>
                  <span className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">★ Recommended</span>
                  <div className="flex items-center space-x-3 mb-2">
                    <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => { setPaymentMethod('ONLINE'); setHasPaidConfirmed(false); }} className="accent-[#5c0000] w-4 h-4" />
                    <span className="font-extrabold text-gray-900 text-sm">Pay Online</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-7">JazzCash, EasyPaisa, or Direct Bank Transfer.</p>
                </motion.label>

                <motion.label whileHover={{ scale: 1.02 }} className={`relative flex flex-col justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-[#5c0000] bg-[#5c0000]/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-[#5c0000] w-4 h-4" />
                    <span className="font-extrabold text-gray-900 text-sm">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-7">Pay cash upon delivery (+Rs. 300 COD service fee).</p>
                </motion.label>
              </div>

              <AnimatePresence>
                {paymentMethod === 'ONLINE' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t space-y-4 overflow-hidden">
                    <p className="text-xs font-bold text-gray-700">Choose Online Payment Service:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['jazzcash', 'easypaisa', 'bank'].map((provider) => (
                        <button
                          key={provider}
                          type="button"
                          onClick={() => setOnlineProvider(provider)}
                          className={`py-3 px-2 text-xs font-bold rounded-xl border capitalize transition ${
                            onlineProvider === provider
                              ? 'bg-[#5c0000] text-white border-[#5c0000] shadow-md'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {provider === 'bank' ? 'Bank Transfer' : provider}
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#5c0000]/5 border border-[#5c0000]/20 rounded-2xl p-4 text-xs space-y-1 text-gray-900">
                      <p className="font-bold text-sm text-[#5c0000]">{currentDetails?.title}</p>
                      <p>Account Number: <span className="font-mono font-bold text-[#5c0000]">{currentDetails?.accountNumber}</span></p>
                      <p>Account Title: <span className="font-semibold">{currentDetails?.accountTitle}</span></p>
                      <p className="text-[11px] text-gray-500 pt-1 border-t mt-2">
                        * Please share payment receipt on WhatsApp ({SUPPORT_WHATSAPP}) or upload below.
                      </p>
                    </div>

                    {/* Receipt Upload Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">Upload Payment Receipt / Screenshot *</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setPaymentReceiptFile(e.target.files[0])}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#5c0000]/10 file:text-[#5c0000] hover:file:bg-[#5c0000]/20 cursor-pointer"
                      />
                    </div>

                    {/* Security Checkbox Validation Block */}
                    <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 space-y-2">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPaidConfirmed}
                          onChange={(e) => setHasPaidConfirmed(e.target.checked)}
                          className="mt-0.5 accent-[#5c0000] w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-xs font-extrabold text-amber-900 leading-relaxed">
                          I confirm that I have transferred Rs. {grandTotal.toLocaleString()} to the account above and have uploaded the receipt.
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: Order Summary Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl sticky top-8 space-y-6">
              <h2 className="text-xl font-black text-gray-900 border-b pb-3">Order Summary</h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const title = item.product?.title || item.title || 'Product';
                  const price = item.variant?.price || item.price || 0;
                  const qty = item.qty || item.quantity || 1;
                  const grammage = item.variant?.grammage || item.grammage;

                  return (
                    <div key={idx} className="flex justify-between items-center text-sm border-b pb-3">
                      <div>
                        <p className="font-bold text-gray-800">{title}</p>
                        {grammage && <p className="text-xs text-gray-500">Weight: {grammage}</p>}
                        <p className="text-xs text-gray-500">Rs. {price} × {qty}</p>
                      </div>
                      <p className="font-extrabold text-[#5c0000]">Rs. {(price * qty).toLocaleString()}</p>
                    </div>
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
                    {finalShipping === 0 ? <span className="text-[#5c0000] font-bold">FREE</span> : `Rs. ${finalShipping}`}
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
                disabled={isSubmitting || !isFormValid}
                whileHover={isFormValid ? { scale: 1.02 } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                className={`w-full py-4 text-white font-bold rounded-2xl transition shadow-xl ${
                  isFormValid 
                    ? 'bg-[#5c0000] hover:bg-[#420000] cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isSubmitting 
                  ? 'Processing Order...' 
                  : paymentMethod === 'ONLINE' && !hasPaidConfirmed 
                    ? 'Check Payment Confirmation Box to Proceed' 
                    : 'Confirm & Place Order'}
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}