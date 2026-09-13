import React from 'react';

export const PrintableReceipt = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  // Safe fallback calculation if subtotal or total are missing
  const itemsSubtotal = order.items?.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || item.qty || 1);
  }, 0) || 0;

  const subtotal = Number(order.subtotal) || itemsSubtotal;
  const shippingFee = Number(order.shippingFee) || 0;
  const total = Number(order.total) || (subtotal + shippingFee);

  return (
    <div ref={ref} className="bg-white text-black p-8 max-w-2xl mx-auto font-sans print:p-0 print:w-full">
      {/* Receipt Top Header */}
      <div className="text-center space-y-2 border-b-2 border-gray-900 pb-6 mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
          Naimat Bazaar | Har Dana Shifa Ka Khazana
        </span>
        <h1 className="text-2xl font-black text-gray-900 mt-2">OFFICIAL ORDER RECEIPT</h1>
        <p className="text-xs text-gray-500">Thank you for your purchase! Transaction verified successfully.</p>
        
        <div className="pt-2">
          <span className="text-xs font-mono font-bold bg-gray-50 border border-gray-300 px-3 py-1 rounded-md text-[#5c0000]">
            Order ID: {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <p className="font-bold text-gray-400 uppercase">Payment Status</p>
          <p className="font-extrabold text-emerald-600">Verified / Processing</p>
        </div>
        <div>
          <p className="font-bold text-gray-400 uppercase">Payment Method</p>
          <p className="font-extrabold text-gray-900">{order.paymentMethod}</p>
        </div>
      </div>

      {/* Customer & Address */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs border border-gray-200 p-4 rounded-xl">
        <div className="space-y-1">
          <p className="font-bold text-[#5c0000] uppercase">Customer Details</p>
          <p className="font-extrabold text-gray-900 text-sm">{order.customerName}</p>
          <p className="text-gray-600">Phone: {order.phone}</p>
          {order.email && <p className="text-gray-600">Email: {order.email}</p>}
        </div>
        <div className="space-y-1">
          <p className="font-bold text-[#5c0000] uppercase">Shipping Address</p>
          <p className="text-gray-700 leading-snug">{order.shippingAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 space-y-2">
        <p className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b pb-1">Ordered Items</p>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-300 text-gray-500">
              <th className="pb-2 font-bold">Product</th>
              <th className="pb-2 text-center font-bold">Qty</th>
              <th className="pb-2 text-right font-bold">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td className="py-2.5 font-semibold text-gray-900">
                    <span>{item.name || item.title}</span>
                  </td>
                  <td className="py-2.5 text-center text-gray-600">{item.quantity || item.qty}</td>
                  <td className="py-2.5 text-right font-bold text-[#5c0000]">
                    Rs. {((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Breakdown */}
      <div className="border-t border-gray-300 pt-4 mb-6 space-y-2 text-xs max-w-xs ml-auto">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping Fee</span>
          <span className="font-semibold">{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee.toLocaleString()}`}</span>
        </div>
        <div className="border-t border-gray-900 pt-2 flex justify-between text-sm font-black text-gray-900">
          <span>Total Amount</span>
          <span className="text-[#5c0000]">Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Screenshot Proof (Centered) */}
      {order.paymentReceiptUrl && (
        <div className="border-t border-gray-200 pt-4 mb-6 text-center">
          <p className="text-xs font-bold text-gray-900 uppercase mb-2">Attached Payment Proof</p>
          <div className="flex justify-center">
            <img 
              src={order.paymentReceiptUrl} 
              alt="Payment Proof" 
              className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm" 
            />
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="border-t border-gray-200 pt-4 text-center text-[10px] text-gray-400">
        <p>This is a computer-generated receipt from Naimat Bazaar Official System.</p>
        <p>For support, email info@naimatbazaar.com or call 0325-8060699.</p>
      </div>
    </div>
  );
});

PrintableReceipt.displayName = 'PrintableReceipt';