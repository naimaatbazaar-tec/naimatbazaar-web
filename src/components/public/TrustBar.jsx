export default function TrustBar() {
  return (
    <div className="bg-white border-y border-gray-200 py-4 mt-5 shadow-sm">
      <div className="max-w-[1100px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-800"><span>🌿</span> 100% Organic & Pure</div>
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-800"><span>🚚</span> Cash On Delivery</div>
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-800"><span>📦</span> Open Parcel Allowed</div>
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-800"><span>💯</span> Quality Guarantee</div>
      </div>
    </div>
  );
}