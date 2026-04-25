import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ productId from URL

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardholderName, setCardholderName] = useState("");

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
      const cardElement = elements.getElement(CardNumberElement);

      // 1️⃣ Create Payment Intent
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id, // ✅ ONLY THIS
          }),
        }
      );

      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error(data.message || "Payment failed");
      }

      // 2️⃣ Confirm Payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handlePaymentSubmit} className="w-full max-w-md p-6">

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <CardNumberElement className="border p-3 rounded mb-4" />

        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full border p-3 mb-4 rounded"
        />

        <CardExpiryElement className="border p-3 rounded mb-4" />

        <CardCvcElement className="border p-3 rounded mb-4" />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </form>
    </div>
  );
};

export default PaymentForm;