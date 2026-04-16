import React from 'react';
import PaymentImg from "../assets/payment.png";
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext.jsx';



const Paysucessmodel = () => {

  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  function handleBackToHome() {
    navigate('/');
  }
  const paymentDetails = [
    { label: "Payment Type", value: "Net Banking" },
    { label: "Bank Name", value: "HBL Bank" },
    { label: "Amount Paid", value: formatPrice(2500) }, // Example total
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100">

        {/* Illustration Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* You can replace this div with your actual <img> tag */}
            <img
              src={PaymentImg}
              alt="Payment Success Illustration"
              className="w-48 h-auto object-contain"
            />
          </div>
        </div>

        {/* Success Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#F59B2B] mb-8">
          Payment Successfully
        </h2>

        {/* Data Table */}
        <div className="space-y-4 mb-10 text-left">
          {paymentDetails.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm md:text-base">
              <span className="text-[#454545]">{item.label}</span>
              <span className="text-[#454545]">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          className="w-full bg-[#F59115] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md active:scale-[0.98]"
          onClick={handleBackToHome}
        >
          Back To Home
        </button>
      </div>
    </div>
  );
};

export default Paysucessmodel;