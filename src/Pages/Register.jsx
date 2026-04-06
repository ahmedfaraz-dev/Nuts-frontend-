import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { httpClient } from '../Api/axiosInstance.js';

const initialForm = {
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    // address (backend expects addresses array min 1)
    city: '',
    country: '',
    zip: '',
};

const Register = () => {
    // const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        setServerError('');
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim() || form.name.trim().length < 2)
            errs.name = 'Name must be at least 2 characters long';
        if (!form.email) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = 'Please provide a valid email address';
        if (!form.password || form.password.length < 8)
            errs.password = 'Password must be at least 8 characters long';
        if (!form.contactNumber.trim())
            errs.contactNumber = 'Contact number is required';
        if (!form.city.trim() || form.city.trim().length < 2)
            errs.city = 'City must be at least 2 characters';
        if (!form.country.trim() || form.country.trim().length < 2)
            errs.country = 'Country must be at least 2 characters';
        if (!form.zip) errs.zip = 'ZIP code is required';
        else if (isNaN(Number(form.zip)) || !Number.isInteger(Number(form.zip)))
            errs.zip = 'ZIP must be a valid integer number';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                contactNumber: form.contactNumber.trim(),
                addresses: [{
                    city: form.city.trim(),
                    country: form.country.trim(),
                    zip: parseInt(form.zip, 10),   // backend expects a number
                }],
            };
            // const res = await register(payload);
            const response = await httpClient.post("/user/register", payload);
            console.log("Registration response:", response);
            setSuccess(response.message || 'Registered! Please check your email to verify your account.');
            setForm(initialForm);
        } catch (err) {
            console.error("Registration error:", err);
            setServerError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── If registered successfully, show email-check message ──
    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center bg-orange-50 border border-orange-200 rounded-2xl p-10 shadow-sm">
                    <div className="text-5xl mb-4">📬</div>
                    <h2 className="text-2xl font-bold text-[#272727] mb-3">Check your email!</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{success}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-8 w-full bg-[#F59115] hover:bg-[#e0800f] text-white font-semibold py-3 rounded-lg transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#272727]">Create an account</h1>
                    <p className="text-gray-400 text-sm mt-2">Join Hunza Naturals today</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    {/* Server error */}
                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                            {serverError}
                        </div>
                    )}

                    {/* ── Personal Info Section ── */}
                    <div>
                        <p className="text-xs font-semibold text-[#F59B2B] uppercase tracking-wider mb-3">
                            Personal Information
                        </p>
                        <div className="space-y-4">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-name">
                                    Full Name
                                </label>
                                <input
                                    id="reg-name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Ahmed Faraz"
                                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                        focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                        ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-email">
                                    Email Address
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                        focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                        ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-password">
                                    Password
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                        focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                        ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-contact">
                                    Contact Number
                                </label>
                                <input
                                    id="reg-contact"
                                    type="tel"
                                    name="contactNumber"
                                    value={form.contactNumber}
                                    onChange={handleChange}
                                    placeholder="03001234567"
                                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                        focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                        ${errors.contactNumber ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Address Section ── */}
                    <div>
                        <p className="text-xs font-semibold text-[#F59B2B] uppercase tracking-wider mb-3">
                            Address
                        </p>
                        <div className="space-y-4">

                            {/* City + Country */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-city">
                                        City
                                    </label>
                                    <input
                                        id="reg-city"
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Gilgit"
                                        className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                            focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                            ${errors.city ? 'border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-country">
                                        Country
                                    </label>
                                    <input
                                        id="reg-country"
                                        type="text"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        placeholder="Pakistan"
                                        className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                            focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                            ${errors.country ? 'border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>

                            {/* ZIP */}
                            <div>
                                <label className="block text-sm font-medium text-[#272727] mb-1" htmlFor="reg-zip">
                                    ZIP / Postal Code
                                </label>
                                <input
                                    id="reg-zip"
                                    type="number"
                                    name="zip"
                                    value={form.zip}
                                    onChange={handleChange}
                                    placeholder="15100"
                                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition
                                        focus:ring-2 focus:ring-[#F59115] focus:border-[#F59115]
                                        ${errors.zip ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#F59115] hover:bg-[#e0800f] active:scale-[0.98] disabled:opacity-60
                                   text-white font-semibold py-3 rounded-lg transition-all duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating account…
                            </span>
                        ) : 'Create Account'}
                    </button>

                    {/* Login link */}
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#F59115] font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Register;
