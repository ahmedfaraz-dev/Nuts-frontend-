import React from "react";

const Testmonial = () => {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-4 md:px-8 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">

        {/* ================= LEFT ================= */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">

          {/* big image */}
          <img
            src="/public/images/nuts1.png"
            alt=""
            className="w-full h-64 object-cover rounded-2xl"
          />

          {/* two small images */}
          <div className="flex gap-4">
            <img
              src="/public/images/nuts2.png"
              alt=""
              className="w-1/2 h-48 object-cover rounded-2xl"
            />

            <img
              src="/public/images/nuts3.png"
              alt=""
              className="w-1/2 h-48 object-cover rounded-2xl"
            />
          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">

          <p className="text-orange-500 font-medium">
            What They Say
          </p>

          <h2 className="text-4xl font-bold text-gray-900 leading-snug">
            What Our Customer’s <br />
            Say About Us
          </h2>

          {/* testimonial cards */}
          <div className="flex flex-col md:flex-row gap-6 mt-6">

            {/* card 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm max-w-md">
              <p className="text-gray-600 leading-relaxed mb-6">
                I'm absolutely in love with @Gather_place. It's the first video
                calling software built for people who meet to get work done.
                Feeling whole lot productive.
              </p>

              <div className="flex items-center gap-4">
                <img
                  src="/public/images/avaster.png"
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h4 className="text-orange-500 font-semibold">
                    Andrew Jones
                  </h4>
                  <p className="text-sm text-gray-500">
                    Product Developer At Webflow
                  </p>
                </div>
              </div>
            </div>

            {/* card 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm max-w-md">
              <p className="text-gray-600 leading-relaxed mb-6">
                I'm absolutely in love with @Gather_place. It's the first video
                calling software built for people who meet to get work done.
                Feeling whole lot productive.
              </p>

              <div className="flex items-center gap-4">
                <img
                  src="/public/images/avaster.png"
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h4 className="text-orange-500 font-semibold">
                    Andrew Jones
                  </h4>
                  <p className="text-sm text-gray-500">
                    Product Developer At Webflow
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
    </section>
  );
};

export default Testmonial;

