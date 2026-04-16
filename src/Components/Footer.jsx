import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { ShieldCheck, Truck, Sprout, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F1F1F1] text-[#1A1A1A] pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* COLUMN 1: Brand & About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-[#F59115] lowercase tracking-tight">
              hunza naturals
            </h2>
            <p className="text-[#4B5563] text-sm leading-relaxed max-w-xs">
              Bringing you the purest, hand-picked dry fruits and nuts straight from the heart of Hunza Valley.
            </p>
            <div className="flex gap-4">
              <FaFacebook className="text-[#4B5563] cursor-pointer hover:text-[#F59115] transition-colors" size={18} />
              <FaTwitter className="text-[#4B5563] cursor-pointer hover:text-[#F59115] transition-colors" size={18} />
              <FaInstagram className="text-[#4B5563] cursor-pointer hover:text-[#F59115] transition-colors" size={18} />
              <FaLinkedin className="text-[#4B5563] cursor-pointer hover:text-[#F59115] transition-colors" size={18} />
            </div>
          </div>

          {/* COLUMN 2: Shop Categories */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-4 text-base">Our Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Premium Walnuts</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Organic Apricots</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Roasted Almonds</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Special Pine Nuts</a></li>
            </ul>
          </div>

          {/* COLUMN 3: Customer Support */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-4 text-base">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Track Your Order</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#F59115] text-sm transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#1A1A1A] text-base">Stay Updated</h4>
            <form className="relative mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F59115] transition-all pr-10"
              />
              <button className="absolute right-1.5 top-1.5 p-1 bg-[#F59115] rounded-md hover:bg-orange-600 transition-colors">
                <Send size={14} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* TRUST BADGES - More Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Sprout className="text-[#F59115]" size={20} />
            <div>
              <p className="text-xs font-bold">100% Organic</p>
              <p className="text-[10px] text-gray-500">Purely Natural</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="text-[#F59115]" size={20} />
            <div>
              <p className="text-xs font-bold">Fast Delivery</p>
              <p className="text-[10px] text-gray-500">Nationwide</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#F59115]" size={20} />
            <div>
              <p className="text-xs font-bold">Secure Payment</p>
              <p className="text-[10px] text-gray-500">100% Protected</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-400 text-[10px]">
            © {currentYear} <span className="text-[#F59115]">Hunza Naturals</span>. All rights reserved.
          </p>
          <div className="flex gap-4 text-[10px] text-gray-400">
            <a href="#" className="hover:text-black">Sitemap</a>
            <a href="#" className="hover:text-black">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
