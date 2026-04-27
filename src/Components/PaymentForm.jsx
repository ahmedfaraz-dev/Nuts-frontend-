import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircle2 } from "lucide-react";

const PaymentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardholderName, setCardholderName] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: '"Nunito Sans", sans-serif',
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      return;
    }

    if (!id) {
      setError("Product ID not found in URL");
      return;
    }

    setLoading(true);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
          }),
        }
      );

      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error(data.message || "Payment failed");
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: cardholderName,
            },
          },
        });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        navigate("/payment-success");
      } else {
        setError("Payment not completed");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] font-['Nunito_Sans'] p-4">
      <div className="w-full max-w-[500px] bg-white border border-gray-100 rounded-lg shadow-sm p-8 md:p-12">
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">
              {error}
            </div>
          )}

          {/* Card Number */}
          <div className="space-y-2">
            <label className="block text-[#333] text-lg font-medium">Card Number</label>
            <div className="border border-gray-200 rounded-md p-4 bg-white focus-within:border-orange-400 transition-colors">
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          {/* Name On Card */}
          <div className="space-y-2">
            <label className="block text-[#333] text-lg font-medium">Name On Card</label>
            <input
              type="text"
              placeholder="Kamran Jan"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-4 bg-white focus:outline-none focus:border-orange-400 transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Exp Date & Cvv */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[#333] text-lg font-medium">Exp Date</label>
              <div className="border border-gray-200 rounded-md p-4 bg-white focus-within:border-orange-400 transition-colors">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[#333] text-lg font-medium">Cvv</label>
              <div className="border border-gray-200 rounded-md p-4 bg-white focus-within:border-orange-400 transition-colors">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          {/* Save Card */}
          <div className="flex items-start gap-4 pt-2">
            <div 
              onClick={() => setSaveCard(!saveCard)}
              className="cursor-pointer mt-0.5"
            >
              {saveCard ? (
                <div className="w-6 h-6 rounded-full bg-[#f7941d] flex items-center justify-center border border-[#f7941d] shadow-sm">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-3.5 h-3.5 text-white"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
              )}
            </div>
            <div className="space-y-1">
              <label 
                className="block text-[#333] text-lg font-medium leading-none cursor-pointer" 
                onClick={() => setSaveCard(!saveCard)}
              >
                Save Card
              </label>
              <p className="text-gray-400 text-sm font-normal">
                That My Card Information Is Saved In My Hunza Naturals Account
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f7941d] hover:bg-[#e68415] text-white font-bold py-4 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Processing..." : "Payment Now"}
          </button>
          </form>
      </div>
    </div>
  );
};

export default PaymentForm;