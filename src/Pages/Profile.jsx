import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { User, Mail, Phone, MapPin, Camera, Lock, LogOut, Check, ShoppingBag, ChevronRight } from 'lucide-react';
import { userApi } from '../Api/userApi.js';

const Profile = () => {
    const { user, setUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        contactNumber: user?.contactNumber || '',
        city: user?.addresses?.[0]?.city || '',
        country: user?.addresses?.[0]?.country || '',
        zip: user?.addresses?.[0]?.zip || '',
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // These would be real API calls later
            console.log("Updating profile with:", form);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // For now, just update local state to reflect changes
            const updatedUser = {
                ...user,
                name: form.name,
                contactNumber: form.contactNumber,
                addresses: [{
                    city: form.city,
                    country: form.country,
                    zip: parseInt(form.zip, 10) || 0
                }]
            };
            setUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }
        setLoading(true);
        try {
            console.log("Updating password...");
            await new Promise(resolve => setTimeout(resolve, 800));
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update password.' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // In a real app, you'd upload this to the server
                // and update the user state with the new URL
                setUser({ ...user, avatar: { url: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) return <div className="p-10 text-center">Please log in to view your profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' && <Check className="w-5 h-5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 rounded-full border-4 border-orange-50 bg-gray-100 flex items-center justify-center overflow-hidden mx-auto">
                                    {user.avatar?.url ? (
                                        <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-[#F59115] uppercase">
                                            {user.name?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-[#F59115] p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                                    <Camera className="w-5 h-5 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500 mt-1 capitalize">{user.role}</p>

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition-all font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="text-gray-900 font-medium">April 2026</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Account status</span>
                                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Verified
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <button
                                    onClick={() => (window.location.href = "/order-history")}
                                    className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all font-bold text-sm group"
                                >
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4" />
                                        Order History
                                    </div>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Information Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={form.email}
                                                disabled
                                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 ml-1">Email cannot be changed</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                value={form.contactNumber}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                placeholder="+92 300 1234567"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                placeholder="Gilgit"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="country"
                                                value={form.country}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                placeholder="Pakistan"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="zip"
                                                value={form.zip}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                placeholder="15100"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#F59115] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                            </div>
                            <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={passwordForm.oldPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
