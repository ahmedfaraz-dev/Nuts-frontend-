import React from 'react'
import Hero from "../Components/Hero";
import ProductList from "../Components/Products";
import DealsSection from "../Components/DealsSection";
import Testmonial from '../Components/Testmonial';
import VideoSection from '../Components/VideoSection';
import productData from '../Components/Ui/utils/cardsProducts.json'
import BestProducts from '../Components/Ui/BestProducts'

import CategoryBanners from '../Components/CategoryBanners'
import Contact from '../Components/Contact';
import { Crown } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryBanners />
      <ProductList />
      <DealsSection />

      {/* ── Best Products ── */}
      <section className="w-full bg-[#fafafa]">
        <div className="w-full px-4 md:px-8 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto">

            {/* Section header — matching site theme */}
            <h2 className="text-2xl font-semibold mb-8">Best Products</h2>

            {/* Cards row */}
            <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
              {productData?.map((item) => (
                <BestProducts
                  key={item.id}
                  heading={item.title}
                  subheading={item.description}
                  imageSrc={item.sideImage}
                />
              ))}
            </div>

          </div>
        </div>
      </section>



      <Testmonial />
      <VideoSection />
      <Contact />
    </div>
  )
}

export default Home
