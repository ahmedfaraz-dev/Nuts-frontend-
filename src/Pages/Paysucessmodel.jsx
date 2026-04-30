import React from 'react';
import PaymentImg from "../assets/payment.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext.jsx';

const Paysucessmodel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  // Get dynamic data from location state, with fallbacks for manual testing
  const { 
    amount = 2500, 
    paymentType = "Net Banking", 
    bankName = "HBL Bank" 
  } = location.state || {};

  function handleBackToHome() {
    navigate('/');
  }

  const paymentDetails = [
    { label: "Payment Type", value: paymentType },
    { label: "Bank Name", value: bankName },
    { label: "Amount Paid", value: formatPrice(amount) },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-white font-['Nunito_Sans']">
      {/* Card Container - Matching Image Shadow and Padding */}
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 md:p-14 w-full max-w-lg text-center border border-gray-50 mx-4">

        {/* Illustration - Sized to match reference */}
        <div className="flex justify-center mb-8">
          <img
            src={PaymentImg}
            alt="Payment Success"
            className="w-64 h-auto object-contain"
          />
        </div>

        {/* Title - Color and spacing matched to image */}
        <h2 className="text-3xl md:text-4xl font-medium text-[#F59B2B] mb-12">
          Payment Successfully
        </h2>

        {/* Details Table - Precise alignment and coloring */}
        <div className="space-y-6 mb-12 px-2">
          {paymentDetails.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-lg md:text-xl">
              <span className="text-[#555555] font-normal">{item.label}</span>
              <span className="text-[#454545] font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Action Button - Brand color and rounded corners matched */}
        <button
          className="w-full bg-[#F59115] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] text-lg"
          onClick={handleBackToHome}
        >
          Back To Home
        </button>
      </div>
    </div>
  );
};

export default Paysucessmodel;