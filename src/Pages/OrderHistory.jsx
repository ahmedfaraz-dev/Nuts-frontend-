import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, ChevronRight, ShoppingBag, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { paymentApi } from '../Api/paymentApi';
import { useCurrency } from '../contexts/CurrencyContext';
import Button from '../Components/Ui/Button';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const fetchOrders = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await paymentApi.getMyOrders();
            // Ensure we handle both { orders: [] } and direct array responses
            const orderData = response.data?.orders || (Array.isArray(response.data) ? response.data : []);
            setOrders(orderData);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium font-sans">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
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
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3">
                        <XCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                        <p className="text-gray-400 mt-2 mb-6 text-xs">Your purchase history will appear here once you place an order.</p>
                        <Button onClick={() => navigate('/all-products')}>Start Shopping</Button>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="min-w-[900px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-[2.5fr_1fr_0.5fr_1.2fr_1.2fr] px-6 mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F59115]">Product details</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">Price</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">Qty</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">Est. Delivery</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-right">Order Status</span>
                            </div>

                            {/* Order Items Rows */}
                            <div className="space-y-3">
                                {orders.flatMap(order => 
                                    order.items.map(item => ({ ...item, createdAt: order.createdAt, orderStatus: order.orderStatus }))
                                ).map((item, idx) => {
                                    // Calculate delivery date (3 days after order)
                                    const deliveryDate = new Date(item.createdAt || new Date());
                                    deliveryDate.setDate(deliveryDate.getDate() + 3);
                                    
                                    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    });

                                    return (
                                        <div
                                            key={`${item.id}-${idx}`}
                                            className="grid grid-cols-[2.5fr_1fr_0.5fr_1.2fr_1.2fr] items-center bg-white border border-gray-100 rounded-2xl p-3 px-6 transition-all hover:border-orange-200 shadow-sm hover:shadow-md group"
                                        >
                                            {/* Product Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1.5 shrink-0 group-hover:scale-105 transition-transform">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Package className="w-full h-full text-gray-200 p-1.5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 pr-4">
                                                    <h3 className="text-[14px] font-bold text-[#272727] mb-0.5 truncate">{item.name || 'Dry Fruit Product'}</h3>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Ordered: {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-center font-medium">
                                                <span className="text-[14px] text-gray-900 border-b border-orange-100 pb-0.5">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>

                                            {/* Quantity */}
                                            <div className="text-center">
                                                <span className="text-[14px] font-bold text-[#F59115] bg-orange-50/50 w-7 h-7 flex items-center justify-center rounded-lg mx-auto">
                                                    {item.quantity}
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
                                                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${getStatusClass(item.orderStatus)}`}>
                                                    <span className="shrink-0 scale-90">{getStatusIcon(item.orderStatus)}</span>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                        {item.orderStatus || 'Processing'}
                                                    </span>
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
    );
};

export default OrderHistory;
