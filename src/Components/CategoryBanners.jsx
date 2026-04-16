import React from 'react';
import productOne from '../assets/ProductImages/productOne.png';
import productTwo from '../assets/ProductImages/productTwo.png';
import productThree from '../assets/ProductImages/productThree.png';
import Button from './Ui/Button';

const banners = [
  {
    id: 1,
    title: "TOP RATED",
    subtitle: "PREMIUM SELECTION",
    offer: "ENJOY 20% OFF",
    image: productOne,
    buttonText: "BUY NOW",
    bgColor: "bg-[#1a1a1a]",
    textColor: "text-[#F59115]",
  },
  {
    id: 2,
    title: "BEST SELLING",
    subtitle: "CUSTOMER'S CHOICE",
    offer: "EXTR 15% OFF",
    image: productTwo,
    buttonText: "SHOP NOW",
    bgColor: "bg-[#2d1a12]",
    textColor: "text-[#F59115]",
  },
  {
    id: 3,
    title: "NEW ARRIVAL",
    subtitle: "FRESHLY HARVESTED",
    offer: "EXCLUSIVE",
    image: productThree,
    buttonText: "GET NOW",
    bgColor: "bg-[#333333]",
    textColor: "text-[#F59115]",
  }
];

const CategoryBanners = () => {
  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 lg:px-16 mt-[-10px] relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative h-[250px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
          >
            {/* Background Image with Overlay */}
            <div className={`absolute inset-0 ${banner.bgColor}`}>
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase mb-1 block">
                    {banner.subtitle}
                  </span>
                  <h3 className={`text-2xl font-extrabold ${banner.textColor} leading-tight drop-shadow-sm`}>
                    {banner.title}
                  </h3>
                </div>
                <div className="bg-[#F59115] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                  {banner.offer}
                </div>
              </div>

              <div className="mt-auto">
                <Button className="!py-2 !px-5 !text-xs !rounded-xl active:scale-95 shadow-lg">
                  {banner.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryBanners;
