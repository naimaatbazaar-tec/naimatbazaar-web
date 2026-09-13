'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Printer } from 'lucide-react';
import { PrintableReceipt } from '@/components/public/PrintableReceipt';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        let fetchedSuccessfully = false;

        if (orderId) {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
          const endpoint = API_BASE.includes('/api') ? `${API_BASE}/orders/${orderId}` : `${API_BASE}/api/orders/${orderId}`;

          const res = await fetch(endpoint);
          if (res.ok) {
            const responseJson = await res.json();
            const data = responseJson.data || responseJson;

            setOrder({
              orderNumber: data.orderNumber,
              customerName: data.shippingInfo?.fullName,
              phone: data.shippingInfo?.phone,
              email: data.shippingInfo?.email,
              shippingAddress: `${data.shippingInfo?.addressLine}, ${data.shippingInfo?.city}`,
              paymentMethod: data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
              items: data.items?.map(item => ({
                name: item.title || item.name,
                quantity: item.qty || item.quantity,
                price: item.price,
                image: item.image || item.imageUrl || item.productImage || item.product?.image || ''
              })),
              shippingFee: data.deliveryFee,
              subtotal: data.subtotal,
              total: data.total,
              paymentReceiptUrl: data.paymentReceipt
            });
            fetchedSuccessfully = true;
          }
        }

        if (!fetchedSuccessfully) {
          const localData = localStorage.getItem('latestOrder');
          if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.orderNumber === orderId || !orderId) {
              setOrder({
                ...parsed,
                items: parsed.items?.map(item => ({
                  ...item,
                  image: item.image || item.imageUrl || item.productImage || item.product?.image || ''
                }))
              });
            }
          }
        }
      } catch (err) {
        console.error('Error loading order receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-gray-600 font-bold text-sm">Loading receipt...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-bold text-gray-600 hover:text-[#5c0000] bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm transition"
          >
            ← Back to Store
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 text-xs font-extrabold text-white bg-[#5c0000] hover:bg-[#420000] px-5 py-2.5 rounded-2xl shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div id="printable-receipt-container" className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          <PrintableReceipt order={order} ref={receiptRef} />
        </div>

        <div className="print:hidden">
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-[#5c0000] text-white font-bold rounded-2xl hover:bg-[#420000] transition shadow-lg flex items-center justify-center space-x-2 text-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-gray-600 font-bold text-sm">Loading order...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}