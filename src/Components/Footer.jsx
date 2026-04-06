import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F1F1F1] flex justify-center items-center">
      <div className="w-full max-w-[1440px] box-border px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 md:py-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-0 font-sans text-center md:text-left">

        {/* Navigation Links Wrapper */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 md:gap-24 w-full md:w-auto items-center md:items-start">
          
          {/* Company Column */}
          <div className="flex flex-col gap-2 min-w-[120px] items-center md:items-start">
            <h4 className="font-bold text-[#1A1A1A] mb-2 text-lg">Company</h4>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">About Us</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Why Choose us</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Pricing</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Testimonial</a>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-2 min-w-[120px] items-center md:items-start">
            <h4 className="font-bold text-[#1A1A1A] mb-2 text-lg">Resources</h4>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Privacy Policy</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Terms and Condition</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Blog</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Contact Us</a>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-2 min-w-[120px] items-center md:items-start">
            <h4 className="font-bold text-[#1A1A1A] mb-2 text-lg">Product</h4>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Project management</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Time tracker</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Time schedule</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Lead generate</a>
            <a href="#" className="text-[#4B5563] hover:text-black text-sm">Remote Collaboration</a>
          </div>

        </div>

        {/* Brand & Socials Section */}
        <div className="flex flex-col items-center md:items-start min-w-[220px] max-w-full mt-8 md:mt-0">
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-serif text-[#F97316] mb-4 sm:mb-6 lowercase"
            style={{ fontFamily: "serif" }}
          >
            hunza naturals
          </h2>

          <p className="font-bold text-[#1A1A1A] mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
            Subscribe to our Newsletter
          </p>

          <div className="flex gap-4">
            <FaFacebook className="text-[#4B5563] cursor-pointer hover:text-black" size={24} />
            <FaTwitter className="text-[#4B5563] cursor-pointer hover:text-black" size={24} />
            <FaInstagram className="text-[#4B5563] cursor-pointer hover:text-black" size={24} />
            <FaLinkedin className="text-[#4B5563] cursor-pointer hover:text-black" size={24} />
          </div>
        </div>

      </div>
    </footer>
  );
}
