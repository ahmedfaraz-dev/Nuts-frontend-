import React, { useState } from "react";
import dryfruit from "../assets/dryfruitplate.png";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

const REQUIRED_FIELDS = ["email", "firstName", "lastName", "address", "city", "postalCode", "phone"];

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { formatPrice } = useCurrency();

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cartItems.length > 0 ? 500 : 0; // consistent with Cart.jsx
  const discount = 0; // Logic for discount to be added later if needed
  const total = subTotal + delivery - discount;

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",   // optional
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    saveInfo: false,
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";

    if (!form.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{4,10}$/.test(form.postalCode.trim())) {
      newErrors.postalCode = "Enter a valid postal code";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }

    return newErrors;
  }

  function handleContinue() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const productId = cartItems[0]?.id || "";
    navigate(`/payment-form/${productId}`, { state: { customerData: form } });
  }

  const inputClass = (field) =>
    `w-full p-3 border rounded-md outline-none transition-colors ${errors[field]
      ? "border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50"
      : "border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
    }`;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col lg:flex-row mx-auto w-full max-w-[95vw] md:max-w-3xl lg:max-w-6xl xl:max-w-7xl min-h-[80vh]">

        {/* Left Section: Form */}
        <div className="flex-1 py-6 md:py-12 lg:pr-20 px-4 sm:px-8">
          <div className="max-w-xl w-full mx-auto">

            <h2 className="text-lg font-medium mb-4 text-[#272727]">Contact Information</h2>

            {/* Email */}
            <div className="mb-8">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-5">

              {/* First & Last Name */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-[#272727] block mb-1">First Name <span className="text-red-500">*</span></label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputClass("firstName")}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <label className="text-sm text-[#272727] block mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputClass("lastName")}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Company (optional) */}
              <div>
                <label className="text-sm text-[#272727] block mb-1">Company (Optional)</label>
                <input
                  name="company"
                  type="text"
                  placeholder="Company name"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-sm text-[#272727] block mb-1">Address <span className="text-red-500">*</span></label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass("address")}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City & Postal Code */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-[#272727] block mb-1">City <span className="text-red-500">*</span></label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass("city")}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div className="flex-1">
                  <label className="text-sm text-[#272727] block mb-1">Postal Code <span className="text-red-500">*</span></label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={handleChange}
                    className={inputClass("postalCode")}
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-[#272727] block mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="e.g. 03001234567"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-6">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer w-full md:w-auto">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={form.saveInfo}
                  onChange={handleChange}
                  className="mr-2 accent-orange-500 h-4 w-4"
                />
                Save This Information For Next Time
              </label>
              <button
                onClick={handleContinue}
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-10 rounded-lg transition-transform active:scale-95"
              >
                Continue To Shipping
              </button>
            </div>

          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className="w-full sm:w-[90vw] md:w-[70vw] lg:w-112.5 bg-[#FDFDFD] py-6 px-4 sm:px-8 md:py-12 shrink-0 mx-auto mt-8 lg:mt-0 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-8 text-[#272727]">Your Order</h2>

          <div className="flex flex-col gap-4 mb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-lg shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#272727] font-medium text-sm line-clamp-1">{item.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-bold text-[#F59115]">{formatPrice(item.price)}</p>
                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
            {cartItems.length === 0 && (
              <p className="text-center py-10 text-gray-400 text-sm italic">Cart is empty</p>
            )}
          </div>

          <div className="border-t border-orange-200 pt-6 space-y-3">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatPrice(subTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Delivery</span>
              <span className="font-semibold text-gray-900">{formatPrice(delivery)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>Discount</span>
                <span className="font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-medium">Total</span>
              <span className="text-3xl font-black text-[#272727]">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDetails;
