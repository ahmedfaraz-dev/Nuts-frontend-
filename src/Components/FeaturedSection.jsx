import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedCard = ({ title, highlight, offer, image }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate('/all-products');
  };

  return (
    <div 
      className="relative h-[280px] overflow-hidden group cursor-pointer bg-neutral-900 shadow-xl border border-neutral-800"
      onClick={handleBuyNow}
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[#FACC15] font-black text-xl leading-none uppercase tracking-tighter mb-1">{highlight}</span>
            <h3 className="text-white font-black text-3xl leading-none uppercase tracking-tighter">{title}</h3>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Enjoy</span>
            <span className="text-[#FACC15] font-black text-3xl leading-none uppercase">{offer}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <button 
            className="bg-[#F59115] text-white font-extrabold text-[12px] px-8 py-3 uppercase tracking-tighter hover:bg-[#d87d12] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-orange-200/50 hover:shadow-xl cursor-pointer rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow();
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedSection = () => {
  const cards = [
    {
      title: "Best Selling",
      highlight: "Premium",
      offer: "50% OFF",
      image: "/images/nuts1.png"
    },
    {
      title: "New Arrival",
      highlight: "Get Extra",
      offer: "30% OFF",
      image: "/images/nuts2.png"
    },
    {
      title: "Recommended",
      highlight: "Hnaturals",
      offer: "40% OFF",
      image: "/images/nuts3.png"
    }
  ];

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading - Seamless with site style */}
        <div className="mb-8 text-left">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl lg:text-3xl">
            Our Special Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <FeaturedCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
