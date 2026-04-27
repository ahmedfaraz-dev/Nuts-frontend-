import { useNavigate } from "react-router-dom";
import Button from "./Ui/Button";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white">
      <div className="w-full py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col-reverse gap-10 items-center justify-between md:gap-12 lg:flex-row">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272727] leading-tight">
            Eat Healthy Every Day <br />
            Hunza Naturals
          </h1>

          <p className="my-6 text-[#696969] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Lorem Ipsum Dolor Sit Amet Consectetur. Euismod Quam
            Varius Duis Proin Viverra Quis. Pellentesque Turpis Et
            Ultricies Platea Proin Fringilla Non.
          </p>

          <div className="flex justify-center lg:justify-start">
            <Button onClick={() => navigate("/all-products")}>Order Now</Button>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="w-full lg:w-1/2 lg:flex lg:justify-end">
          {/* <lg: responsive layout */}
          <div className="w-full lg:hidden">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="/images/hero2.svg"
                  alt="Dry fruits"
                  className="w-full h-auto aspect-4/5 object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col gap-4">
                <img
                  src="/images/hero1.svg"
                  alt="Dry fruits"
                  className="w-full h-auto aspect-16/10 object-cover rounded-md"
                />
                <img
                  src="/images/hero3.svg"
                  alt="Dry fruits"
                  className="w-full h-auto aspect-16/10 object-cover rounded-md"
                />
              </div>
            </div>
          </div>

          {/* lg+: original (unchanged) layout */}
          <div className="hidden lg:flex h-[550px] w-full max-w-[530px] gap-4">
            <div className="flex w-full justify-center items-center h-full">
              <img
                src="/images/hero2.svg"
                alt="Dry fruits"
                className="w-full h-3/4 object-cover rounded-md"
              />
            </div>
            <div className="flex w-full flex-col justify-start gap-4 h-full">
              <img
                src="/images/hero1.svg"
                alt="Dry fruits"
                className="w-full h-1/2 object-cover rounded-md"
              />
              <img
                src="/images/hero3.svg"
                alt="Dry fruits"
                className="w-full h-1/2 object-cover rounded-md"
              />
            </div>
          </div>
        </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
