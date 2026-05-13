import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, ArrowLeft, Clock, CheckCircle, XCircle, Star, X } from 'lucide-react';
import { paymentApi } from '../Api/paymentApi';
import { useCurrency } from '../contexts/CurrencyContext';
import Button from '../Components/Ui/Button';
import { SkeletonImage, SkeletonText, SkeletonButton } from '../Components/Ui/Skeletons';
import { useAuth } from '../contexts/AuthContext';
import { ratingApi } from '../Api/ratingApi';
import { getOrderItemProductId, getPendingRatingItems } from '../utils/ratingUtils';
import { userApi } from '../Api/userApi';
import Cookies from 'js-cookie';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingRatings, setPendingRatings] = useState([]);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedRatingItem, setSelectedRatingItem] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [ratingTitle, setRatingTitle] = useState('');
    const [ratingComment, setRatingComment] = useState('');
    const [ratingSubmitting, setRatingSubmitting] = useState(false);
    const [ratingFeedback, setRatingFeedback] = useState('');
    const [fallbackUserId, setFallbackUserId] = useState('');
    const [toast, setToast] = useState(null);
    const { formatPrice } = useCurrency();
    const { user } = useAuth();
    const navigate = useNavigate();
    // API doesn't provide deliveredAt/cancelledAt, so we approximate the 7-day archive
    // window using the order's createdAt (same timestamp you already display).
    const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const fetchOrders = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await paymentApi.getMyOrders();
            // Ensure we handle both { orders: [] } and direct array responses
            const orderData = response.data?.orders || (Array.isArray(response.data) ? response.data : []);
            setOrders(orderData);
            const orderLinkedUserId =
                orderData.find((order) =>
                    order?.user ||
                    order?.userId ||
                    order?.customerInfo?.userId
                )?.user?._id ||
                orderData.find((order) =>
                    order?.user ||
                    order?.userId ||
                    order?.customerInfo?.userId
                )?.user?.id ||
                orderData.find((order) =>
                    order?.user ||
                    order?.userId ||
                    order?.customerInfo?.userId
                )?.user ||
                orderData.find((order) =>
                    order?.user ||
                    order?.userId ||
                    order?.customerInfo?.userId
                )?.userId ||
                orderData.find((order) =>
                    order?.user ||
                    order?.userId ||
                    order?.customerInfo?.userId
                )?.customerInfo?.userId ||
                '';
            setFallbackUserId(orderLinkedUserId || '');

            const ratedProductIds = JSON.parse(localStorage.getItem('ratedProductIds') || '[]');
            const pending = getPendingRatingItems(orderData, ratedProductIds);
            setPendingRatings(pending);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load your order history. Please try again later.");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Auto-refresh every 30 seconds if page is active
        const interval = setInterval(() => fetchOrders(false), 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const openRatingModal = (item) => {
        setSelectedRatingItem(item);
        setRatingValue(5);
        setRatingTitle('');
        setRatingComment('');
        setRatingFeedback('');
        setRatingModalOpen(true);
    };

    const closeRatingModal = () => {
        setRatingModalOpen(false);
        setSelectedRatingItem(null);
    };

    const resolveCurrentUserId = async () => {
        const immediateUserId =
            user?._id ||
            user?.id ||
            user?.userId ||
            user?.user?._id ||
            user?.user?.id;

        if (immediateUserId) return immediateUserId;
        if (fallbackUserId) return fallbackUserId;

        // Decode JWT payload as another fallback when user object is partial.
        try {
            const token = Cookies.get("token") || localStorage.getItem("token");
            if (token) {
                const payloadBase64 = token.split('.')[1];
                if (payloadBase64) {
                    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
                    const decoded = JSON.parse(atob(normalized));
                    const tokenUserId = decoded?._id || decoded?.id || decoded?.userId || decoded?.sub;
                    if (tokenUserId) return tokenUserId;
                }
            }
        } catch (err) {
            // no-op, continue to profile fallback
        }

        try {
            const profileRes = await userApi.getCurrentUser();
            const profileUser = profileRes?.user || profileRes?.data || profileRes;
            return (
                profileUser?._id ||
                profileUser?.id ||
                profileUser?.userId ||
                profileUser?.user?._id ||
                profileUser?.user?.id ||
                null
            );
        } catch (err) {
            return null;
        }
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        setRatingFeedback('');

        try {
            setRatingSubmitting(true);
            const userId = await resolveCurrentUserId();
            const rawProductId =
                selectedRatingItem?.productId?._id ||
                selectedRatingItem?.productId?.id ||
                selectedRatingItem?.productId;
            const productId = rawProductId ? String(rawProductId) : '';

            if (!productId) {
                setRatingFeedback('Product not found for this order item.');
                return;
            }

            if (!userId) {
                setRatingFeedback('Please login again to submit your rating.');
                return;
            }

            await ratingApi.submitProductRating({
                userId,
                productId,
                rating: Number(ratingValue),
                title: ratingTitle.trim() || 'Product rating',
                comment: ratingComment.trim() || 'Rated by verified buyer',
            });

            const ratedProductIds = JSON.parse(localStorage.getItem('ratedProductIds') || '[]');
            if (!ratedProductIds.includes(productId)) {
                localStorage.setItem('ratedProductIds', JSON.stringify([...ratedProductIds, productId]));
            }

            setRatingFeedback('Thanks! Your rating has been submitted.');
            setPendingRatings((prev) => prev.filter((entry) => entry.productId !== productId));
            setToast({ type: 'success', message: 'Rating submitted successfully!' });

            // Invalidate stale product data on other pages
            window.dispatchEvent(new CustomEvent('rating-submitted', { detail: { productId } }));

            // Refresh orders from server to stay in sync with backend state
            fetchOrders(false);

            setTimeout(() => {
                closeRatingModal();
            }, 700);
        } catch (err) {
            const data = err?.response?.data;
            console.error("[OrderHistory] Rating submit error:", JSON.stringify(data, null, 2));
            const validationErrors = data?.errors
                ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join("; ")
                : "";
            const apiMessage =
                validationErrors ||
                data?.message ||
                data?.error ||
                err?.message;
            setRatingFeedback(apiMessage || 'Unable to submit rating. Please try again.');
        } finally {
            setRatingSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'delivered':
            case 'confirmed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'failed':
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-orange-500" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'delivered':
            case 'confirmed':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'failed':
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-orange-50 text-orange-700 border-orange-100';
        }
    };

    const visibleOrders = (orders || [])
        .filter(order => {
            const status = order?.orderStatus?.toLowerCase();
            if (status === 'delivered' || status === 'cancelled') {
                if (!order?.createdAt) return true;
                const createdMs = new Date(order.createdAt).getTime();
                return createdMs >= sevenDaysAgoMs;
            }
            return true;
        })
        .sort((a, b) => {
            const aStatus = String(a?.orderStatus || '').toLowerCase();
            const bStatus = String(b?.orderStatus || '').toLowerCase();
            const aItems = Array.isArray(a?.items) ? a.items : [];
            const bItems = Array.isArray(b?.items) ? b.items : [];
            const aHasPending = aStatus === 'delivered' && aItems.some((item) => {
                const pid = getOrderItemProductId(item);
                return pid && pendingRatings.some((p) => p.productId === pid);
            });
            const bHasPending = bStatus === 'delivered' && bItems.some((item) => {
                const pid = getOrderItemProductId(item);
                return pid && pendingRatings.some((p) => p.productId === pid);
            });
            if (aHasPending && !bHasPending) return -1;
            if (!aHasPending && bHasPending) return 1;
            const aDate = new Date(a?.createdAt || 0).getTime();
            const bDate = new Date(b?.createdAt || 0).getTime();
            return bDate - aDate;
        });

    return (
        <>
        <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-[1100px] mx-auto bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
                
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-600 transition-colors mb-10 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="flex items-center justify-between mb-16">
                    <h1 className="text-3xl font-bold text-[#272727]">Order History</h1>
                    {pendingRatings.length > 0 && (
                        <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold">
                            {pendingRatings.length} product{pendingRatings.length > 1 ? 's are' : ' is'} ready for rating
                        </div>
                    )}
                </div>

                {pendingRatings.length > 0 && (
                    <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50/60 border border-orange-100 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#F59115] flex items-center justify-center">
                                    <Star className="w-3 h-3 text-white fill-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Rate your purchases</p>
                                    <p className="text-[10px] text-gray-500">
                                        {pendingRatings.length} product{pendingRatings.length > 1 ? 's' : ''} waiting
                                    </p>
                                </div>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#F59115] bg-white px-2 py-0.5 rounded-md border border-orange-100">
                                Pending
                            </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-0.5">
                            {pendingRatings.map((item) => (
                                <button
                                    key={item.productId}
                                    onClick={() => openRatingModal(item)}
                                    className="flex-shrink-0 flex flex-col items-center gap-1 text-center p-1.5 rounded-lg bg-white border border-orange-100 hover:border-[#F59115] hover:shadow-sm transition-all cursor-pointer w-[68px]"
                                >
                                    <div className="w-9 h-9 rounded-md bg-gray-50 border border-gray-100 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.productName} className="w-full h-full object-contain p-0.5" />
                                        ) : (
                                            <Package className="w-full h-full text-gray-300 p-1" />
                                        )}
                                    </div>
                                    <p className="text-[8px] font-semibold text-gray-700 leading-tight line-clamp-2">{item.productName}</p>
                                    <span className="text-[8px] font-bold text-[#F59115] bg-orange-50 px-1.5 py-0.5 rounded-full">Rate</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3">
                        <XCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="min-w-[900px]">
                            <div className="grid grid-cols-[2.5fr_1fr_0.5fr_1.2fr_1.2fr] px-6 mb-4">
                                <SkeletonText className="h-3 w-24" />
                                <SkeletonText className="h-3 w-12 mx-auto" />
                                <SkeletonText className="h-3 w-12 mx-auto" />
                                <SkeletonText className="h-3 w-20 mx-auto" />
                                <SkeletonText className="h-3 w-20 ml-auto" />
                            </div>
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-[2.5fr_1fr_0.5fr_1.2fr_1.2fr] items-center bg-white border border-gray-100 rounded-2xl p-3 px-6 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <SkeletonImage className="w-12 h-12 rounded-xl shrink-0" />
                                            <div className="min-w-0 pr-4 space-y-2 w-full">
                                                <SkeletonText className="h-4 w-40 rounded-lg" />
                                                <SkeletonText className="h-3 w-28 rounded-lg" />
                                                <SkeletonText className="h-3 w-56 rounded-lg" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <SkeletonText className="h-5 w-20 rounded-lg mx-auto" />
                                        </div>
                                        <div className="text-center">
                                            <SkeletonText className="h-7 w-7 rounded-lg mx-auto" />
                                        </div>
                                        <div className="text-center">
                                            <SkeletonText className="h-4 w-24 rounded-lg mx-auto" />
                                        </div>
                                        <div className="flex justify-end">
                                            <SkeletonButton className="h-8 w-28 rounded-xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                        <p className="text-gray-400 mt-2 mb-6 text-xs">Your purchase history will appear here once you place an order.</p>
                        <Button onClick={() => navigate('/all-products')}>Start Shopping</Button>
                    </div>
                ) : visibleOrders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No recent orders to show</h3>
                        <p className="text-gray-400 mt-2 mb-6 text-xs">Delivered and cancelled orders are shown for 7 days.</p>
                        <Button onClick={() => navigate('/all-products')}>Start Shopping</Button>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="min-w-[900px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-[2.5fr_1fr_0.5fr_1.2fr_1.2fr] px-6 mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F59115]">Order details</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">Price</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">Items</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">Est. Delivery</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-right">Order Status</span>
                            </div>

                            {/* Order Rows */}
                            <div className="space-y-3">
                                {visibleOrders.map((order, idx) => {
                                    const orderItems = Array.isArray(order.items) ? order.items : [];
                                    const firstItem = orderItems[0] || {};
                                    const previewItems = orderItems.slice(0, 2);
                                    const extraCount = Math.max(0, orderItems.length - previewItems.length);

                                    // Calculate delivery date (3 days after order)
                                    const deliveryDate = new Date(order.createdAt || new Date());
                                    deliveryDate.setDate(deliveryDate.getDate() + 3);
                                    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    });

                                    // Prefer backend totalAmount, fall back to sum of items.
                                    const totalAmount =
                                        typeof order.totalAmount === 'number'
                                            ? order.totalAmount
                                            : orderItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

                                    return (
                                        <div key={order._id || idx} className="space-y-2">
                                            <div className="grid grid-cols-[2.5fr_1fr_0.5fr_1.2fr_1.2fr] items-center bg-white border border-gray-100 rounded-2xl p-3 px-6 transition-all hover:border-orange-200 shadow-sm hover:shadow-md group">
                                            {/* Order Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1.5 shrink-0 group-hover:scale-105 transition-transform">
                                                    {firstItem?.image ? (
                                                        <img src={firstItem.image} alt={firstItem.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Package className="w-full h-full text-gray-200 p-1.5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 pr-4">
                                                    <h3 className="text-[14px] font-bold text-[#272727] mb-0.5 truncate">
                                                        {order._id ? `Order #${order._id.slice(-8).toUpperCase()}` : 'Order'}
                                                    </h3>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <p className="text-[9px] text-gray-700 font-bold truncate">
                                                            {previewItems.map((it, pIdx) => (
                                                                <span key={it.id || pIdx}>
                                                                    {pIdx > 0 ? ', ' : ''}
                                                                    {it.name ? `${it.name}` : 'Item'} x{it.quantity || 1}
                                                                </span>
                                                            ))}
                                                        </p>
                                                        {extraCount > 0 && (
                                                            <span className="text-[9px] font-bold text-[#F59115] whitespace-nowrap">
                                                                +{extraCount} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-center font-medium">
                                                <span className="text-[14px] text-gray-900 border-b border-orange-100 pb-0.5">
                                                    {formatPrice(totalAmount)}
                                                </span>
                                            </div>

                                            {/* Items Count */}
                                            <div className="text-center">
                                                <span className="text-[14px] font-bold text-[#F59115] bg-orange-50/50 w-7 h-7 flex items-center justify-center rounded-lg mx-auto">
                                                    {orderItems.length}
                                                </span>
                                            </div>

                                            {/* Delivery Date */}
                                            <div className="text-center">
                                                <span className="text-[12px] font-medium text-gray-600">
                                                    {formattedDeliveryDate}
                                                </span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex justify-end">
                                                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${getStatusClass(order.orderStatus)}`}>
                                                    <span className="shrink-0 scale-90">{getStatusIcon(order.orderStatus)}</span>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                        {order.orderStatus || 'Processing'}
                                                    </span>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        {/* Toast */}
        {toast && (
            <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold shadow-lg animate-[fadeIn_0.3s_ease-out]">
                <CheckCircle className="w-4 h-4" />
                {toast.message}
            </div>
        )}

        {ratingModalOpen && selectedRatingItem && (
            <>
                <div className="fixed inset-0 z-40 bg-black/40" onClick={closeRatingModal} />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Modal header with product image */}
                        <div className="relative bg-gradient-to-r from-orange-50 to-amber-50/60 px-6 py-5 border-b border-orange-100">
                            <button
                                onClick={closeRatingModal}
                                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white border border-orange-100 cursor-pointer transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white border border-orange-100 overflow-hidden shrink-0 shadow-sm">
                                    {selectedRatingItem.image ? (
                                        <img src={selectedRatingItem.image} alt={selectedRatingItem.productName} className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Package className="w-full h-full text-gray-300 p-2" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Rate this product</h3>
                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{selectedRatingItem.productName}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitRating} className="p-6 space-y-5">
                            {/* Stars */}
                            <div className="text-center">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">How would you rate it?</label>
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRatingValue(value)}
                                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-8 h-8 transition-colors ${value <= ratingValue ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-medium">
                                    {ratingValue === 5 ? 'Excellent!' : ratingValue === 4 ? 'Very Good' : ratingValue === 3 ? 'Good' : ratingValue === 2 ? 'Fair' : 'Poor'}
                                </p>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Review title</label>
                                <input
                                    value={ratingTitle}
                                    onChange={(e) => setRatingTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F59115] focus:ring-2 focus:ring-orange-100 text-sm transition-all"
                                    placeholder="e.g., Amazing quality!"
                                    maxLength={80}
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Your experience</label>
                                <textarea
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F59115] focus:ring-2 focus:ring-orange-100 min-h-24 resize-y text-sm transition-all"
                                    placeholder="Tell us about the freshness, packaging, taste..."
                                    maxLength={500}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 text-right">{ratingComment.length}/500</p>
                            </div>

                            {/* Feedback */}
                            {ratingFeedback && (
                                <div className={`text-sm px-3 py-2 rounded-lg ${ratingFeedback.includes('Thanks') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                    {ratingFeedback}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={closeRatingModal}
                                    className="px-4 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ratingSubmitting}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#F59115] hover:bg-orange-600 rounded-xl disabled:opacity-50 disabled:hover:bg-[#F59115] cursor-pointer transition-colors shadow-sm"
                                >
                                    {ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )}
        </>
    );
};

export default OrderHistory;
