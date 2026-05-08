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

    const visibleOrders = (orders || []).filter(order => {
        const status = order?.orderStatus?.toLowerCase();
        if (status === 'delivered' || status === 'cancelled') {
            if (!order?.createdAt) return true; // keep it visible if createdAt is missing
            const createdMs = new Date(order.createdAt).getTime();
            return createdMs >= sevenDaysAgoMs;
        }
        return true;
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
                    <div className="mb-8 bg-orange-50 border border-orange-100 rounded-2xl p-4 sm:p-5">
                        <p className="text-sm text-orange-700 font-semibold mb-3">
                            Your delivered orders are eligible for rating.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pendingRatings.slice(0, 4).map((item) => (
                                <button
                                    key={item.productId}
                                    onClick={() => openRatingModal(item)}
                                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors cursor-pointer"
                                >
                                    <Star className="w-3.5 h-3.5" />
                                    Rate {item.productName}
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
                                            {String(order.orderStatus || '').toLowerCase() === 'delivered' && (
                                                <div className="px-4 py-3 rounded-xl border border-orange-100 bg-orange-50/70 flex flex-wrap items-center justify-between gap-2">
                                                    <p className="text-xs text-orange-700 font-medium">
                                                        Delivery completed. Please rate your product{orderItems.length > 1 ? 's' : ''}.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {orderItems.map((item, itemIdx) => {
                                                            const productId = getOrderItemProductId(item);
                                                            if (!productId) return null;
                                                            const isPending = pendingRatings.some((entry) => entry.productId === productId);

                                                            return (
                                                                <button
                                                                    key={`${productId}-${itemIdx}`}
                                                                    disabled={!isPending}
                                                                    onClick={() =>
                                                                        openRatingModal({
                                                                            productId,
                                                                            orderId: order?._id || null,
                                                                            productName: item?.name || item?.title || 'Product',
                                                                            image: item?.image || '',
                                                                        })
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-orange-700 disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
                                                                >
                                                                    <Star className="w-3.5 h-3.5" />
                                                                    {isPending ? `Rate ${item?.name || 'Product'}` : `${item?.name || 'Product'} rated`}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        {ratingModalOpen && selectedRatingItem && (
            <>
                <div className="fixed inset-0 z-40 bg-black/40" onClick={closeRatingModal} />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Rate {selectedRatingItem.productName}</h3>
                            <button onClick={closeRatingModal} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitRating} className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Your rating</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRatingValue(value)}
                                            className="p-1 cursor-pointer"
                                        >
                                            <Star className={`w-6 h-6 ${value <= ratingValue ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Title</label>
                                <input
                                    value={ratingTitle}
                                    onChange={(e) => setRatingTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
                                    placeholder="Amazing product"
                                    maxLength={80}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Comment</label>
                                <textarea
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 min-h-24 resize-y"
                                    placeholder="Very good quality"
                                    maxLength={500}
                                />
                            </div>
                            {ratingFeedback && (
                                <p className={`text-sm ${ratingFeedback.includes('Thanks') ? 'text-green-600' : 'text-red-500'}`}>
                                    {ratingFeedback}
                                </p>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeRatingModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl cursor-pointer">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ratingSubmitting}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-[#F59115] hover:bg-orange-600 rounded-xl disabled:opacity-60 cursor-pointer"
                                >
                                    {ratingSubmitting ? 'Submitting...' : 'Submit rating'}
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
