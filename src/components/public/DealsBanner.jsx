import { Flame, Truck, Gift, Tag } from "lucide-react";

export default function DealsBanner() {
  return (
    <section className="max-w-[1100px] mx-auto px-4 mt-6" id="deals">
      <div className="bg-[#5c0000] text-white rounded-xl p-5 text-center shadow-lg border border-[#8B0000]/50">
        
        {/* Title with Flame Icons */}
        <div className="text-base sm:text-lg font-black text-[#ffcc00] mb-3 inline-flex items-center justify-center gap-2 tracking-wide uppercase">
          <Flame className="w-5 h-5 text-[#ffcc00] fill-[#ffcc00] shrink-0" />
          <span>SPECIAL BUNDLE OFFER</span>
          <Flame className="w-5 h-5 text-[#ffcc00] fill-[#ffcc00] shrink-0" />
        </div>

        {/* Content List with Clear Bullet Icons */}
        <ul className="text-xs sm:text-sm text-gray-100 space-y-2 max-w-2xl mx-auto font-medium">
          <li className="flex items-center justify-center gap-2 flex-wrap">
            <Truck className="w-4 h-4 text-[#ffcc00] shrink-0" />
            <span><strong className="text-white">Free Delivery:</strong> All Over Pakistan, Rs. 5000 Purchase per Hasil kreen.</span>
          </li>
          <li className="flex items-center justify-center gap-2 flex-wrap">
            <Gift className="w-4 h-4 text-[#ffcc00] shrink-0" />
            <span><strong className="text-white">Free Gift:</strong> Kisi bhi (03) Product ko Purchase kreen.</span>
          </li>
          <li className="flex items-center justify-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-[#ffcc00] shrink-0" />
            <span><strong className="text-white">Wholesale Rates:</strong> 5kg product quantity ky sath.</span>
          </li>
        </ul>

      </div>
    </section>
  );
}