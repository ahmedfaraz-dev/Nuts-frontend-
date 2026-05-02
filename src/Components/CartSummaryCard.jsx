import React from "react";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

const CartSummaryCard = () => {
  const { formatPrice } = useCurrency();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      {/* CART CARD */}
      <div
        className="
          w-[725px]
          h-[387px]
          bg-white
          rounded-[4px]
          shadow-md
          flex
          px-10
          py-6
        "
      >
        {/* LEFT SECTION */}
        <div className="flex-1 flex flex-col items-center">
          
          {/* HEADING (CENTERED) */}
          <h2 className="text-xl font-semibold mb-6 text-center">
            Hunza Dry Food Salad
          </h2>

          {/* IMAGE (CENTERED) */}
          <div className="mb-4">
            <img
              src="/public/images/cartsummary.png"
              alt="Hunza Dry Food Salad"
              className="w-[200px] h-[160px] object-cover rounded-md"
            />
          </div>

          {/* PARAGRAPH (CENTERED) */}
          <p className="text-sm text-gray-500 leading-relaxed text-center max-w-[260px]">
            Lorem ipsum dolor sit amet consectetur. Lacus sed faucibus penatibus
            netus velit tortor. Ultrices risus sed mus suscipit.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-[260px] flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-1">
            Your Total Price
          </p>

          <p className="text-2xl font-semibold text-orange-500 mb-6">
            {formatPrice(1000)}
          </p>

          {/* BUTTONS */}
          <div className="w-full flex flex-col gap-3">
            <button className="w-full py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 transition">
              Continue Shopping
            </button>

            <button className="w-full py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 transition">
              View Cart here
            </button>

            <button className="w-full py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transitio">
              Proceed Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryCard;
