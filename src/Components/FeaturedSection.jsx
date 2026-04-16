import React from 'react';

const FeaturedCard = ({ title, highlight, offer, image, layout }) => {
  const commonButton = (
    <button className="bg-[#F59115] text-white font-extrabold text-[12px] px-8 py-3 uppercase tracking-tighter hover:bg-orange-600 transition-all transform active:scale-95 shadow-lg cursor-pointer">
      Buy Now
    </button>
  );

  return (
    <div className="relative h-[280px] overflow-hidden group cursor-pointer bg-neutral-900 shadow-xl border border-neutral-800">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/70"></div>
      </div>

      {/* Content based on layout */}
      <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
        
        {layout === 'left' && (
          <>
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
              {commonButton}
            </div>
          </>
        )}

        {layout === 'center' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-white font-black text-xs uppercase tracking-[0.3em] mb-3 opacity-60">{highlight}</span>
            <div className="relative mb-2">
              <span className="text-[#FACC15] font-black text-5xl leading-none uppercase">{offer}</span>
              <div className="bg-[#FACC15] text-black px-2 py-0.5 text-[9px] font-black uppercase absolute -right-6 top-2 rotate-12 shadow-xl border-2 border-black/10">Special</div>
            </div>
            <h3 className="text-white font-black text-3xl leading-none uppercase tracking-tighter mb-6">{title}</h3>
            {commonButton}
          </div>
        )}

        {layout === 'right' && (
          <>
            <div className="flex justify-between items-start">
               <span className="text-white font-black text-sm uppercase tracking-widest">
                 <span className="opacity-40">By</span> {highlight}
               </span>
               <div className="w-16 h-16 rounded-full bg-[#FACC15] border-4 border-black/30 flex flex-col items-center justify-center text-center p-1 shadow-2xl">
                 <span className="text-black font-black text-[14px] leading-none">{offer}</span>
                 <span className="text-black font-black text-[9px] uppercase">Off</span>
               </div>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow">
               <h3 className="text-white font-black text-3xl leading-none uppercase tracking-tighter mb-6 text-center">{title}</h3>
               {commonButton}
            </div>
          </>
        )}
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
      image: "/images/nuts1.png",
      layout: "left"
    },
    {
      title: "New Arrival",
      highlight: "Get Extra",
      offer: "30% OFF",
      image: "/images/nuts2.png",
      layout: "center"
    },
    {
      title: "Recommended",
      highlight: "Hnaturals",
      offer: "40%",
      image: "/images/nuts3.png",
      layout: "right"
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
