import React from 'react'
import Hero from "../Components/Hero";
import ProductList from "../Components/Products";
import DealsSection from "../Components/DealsSection";
import Testmonial from '../Components/Testmonial';
import VideoSection from '../Components/VideoSection';
import productData from '../Components/Ui/utils/cardsProducts.json'
import BestProducts from '../Components/Ui/BestProducts'
import NewArrivals from '../Components/NewArrivals'
import Contact from '../Components/Contact';



const Home = () => {
  const productsDetails = productData || [];
  return (
    <div>
      <Hero />
      <ProductList />
      <DealsSection />

      <section className="w-full bg-white">
        <div className="w-full px-4 md:px-8 lg:px-16 py-7">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl font-medium">Best Products</h1>
            <div className="mt-4 flex gap-6 max-w-full overflow-x-auto overflow-y-hidden no-scrollbar">
              {productData?.map((items) => (
                <BestProducts
                  key={items?.id}
                  heading={items?.title}
                  subheading={items?.description}
                  imageSrc={items?.sideImage}
                  left={items?.left}
                  top={items?.top}
                  width={items?.width}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <NewArrivals />

      <Testmonial />
      <VideoSection />
      <Contact />
    
    </div>
  )

}

export default Home
