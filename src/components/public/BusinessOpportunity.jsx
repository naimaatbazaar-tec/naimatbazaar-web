'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  Package, 
  CheckCircle2,
  Briefcase,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

export default function BusinessOpportunity() {
  // Official WhatsApp number update karein (without +)
  const whatsappNumber = "923000000000"; 
  const message = encodeURIComponent("Hello Naimat Bazaar! Main apna home business shuru karne ke baaray mein consultation lena chahta/chahti hoon.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-y border-gray-100 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Live Status Indicator */}
        <div className="flex items-center justify-center sm:justify-start mb-6">
          <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Now Onboarding New Business Partners Across Pakistan
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Core Business Pitch */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles size={14} /> Ghar Baithy Business
              </span>
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <TrendingUp size={14} /> High Profit Margin
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={14} /> Zero Risk Model
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Apna Organic Wellness Brand Shuru Karein!
            </h2>

            <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed">
              Sourcing, production aur testing ki tension chhodain! Raw material se lekar complete branding guidance tak—sab Naimat Bazaar Wholesale Program ke tehat hum aap tak pohnchayein ge.
            </p>

            {/* Bullet Points Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  <span className="text-gray-900 font-extrabold">First 6 Months Pure Wholesale Pricing:</span> Har product par maximum profit margin aap ka.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  <span className="text-gray-900 font-extrabold">Complete Supply Chain:</span> Verified organic raw materials aur trusted sourcing ki direct access.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  <span className="text-gray-900 font-extrabold">Doorstep Pakistan Delivery:</span> Raw material se packaging tak sab direct aap ke address par.
                </p>
              </div>
            </div>

            {/* Call To Action Button */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-xl transition-all cursor-pointer"
              >
                <MessageCircle size={22} className="fill-current" />
                <span>Get Free Business Consultation</span>
                <ArrowRight size={18} />
              </motion.a>
            </div>

            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              ⚡ Direct Advisory Chat with Naimat Bazaar Wholesale Team
            </p>

          </div>

          {/* Right Column: High-Impact Partner Program Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white via-gray-50 to-primary/5 p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">Partner Program</h3>
                    <p className="text-xs text-gray-500 font-medium">Naimat Bazaar Wholesale</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-md">
                  ACTIVE
                </span>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-primary mb-1">
                    <Percent size={20} />
                  </div>
                  <div className="text-xl font-black text-gray-900">Up to 50%</div>
                  <div className="text-xs text-gray-500 font-semibold mt-0.5">Profit Margins</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-emerald-600 mb-1">
                    <Package size={20} />
                  </div>
                  <div className="text-xl font-black text-gray-900">Low MOQ</div>
                  <div className="text-xs text-gray-500 font-semibold mt-0.5">Small Orders Allowed</div>
                </div>
              </div>

              {/* Progress/Guarantee Bars */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Business Setup Guidance</span>
                  <span className="text-emerald-600 font-black">100% Free</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full rounded-full" />
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-gray-700 pt-1">
                  <span>Wholesale Rate Guarantee</span>
                  <span className="text-primary font-black">Direct Source</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full rounded-full" />
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Start your organic product brand today with minimal investment and zero risk.
                </p>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
