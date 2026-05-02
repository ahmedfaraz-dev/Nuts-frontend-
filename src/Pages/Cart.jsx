import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext.jsx';
import Button from '../Components/Ui/Button.jsx';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = cartItems.length > 0 ? 250 : 0; // consistent with backend
    const total = subTotal + delivery;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
                <ShoppingBag className="w-20 h-20 text-gray-200" />
                <h2 className="text-2xl font-semibold text-[#272727]">Your cart is empty</h2>
                <p className="text-gray-400 text-sm">Add something delicious from our store!</p>
                <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">

                {/* Page Heading */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold text-[#272727]">Your Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" /> Clear Cart
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── LEFT: Item List ── */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-5 bg-[#FDFDFD] rounded-2xl border border-gray-100 shadow-sm p-4"
                            >
                                {/* Product Image */}
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-orange-50">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name & Price */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[#272727] truncate">{item.name}</p>
                                    <p className="text-[#F59115] font-semibold mt-1">
                                        {formatPrice(item.price)} <span className="text-gray-400 text-xs font-normal">/ item</span>
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition cursor-pointer"
                                    >
                                        <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="w-5 text-center text-sm font-medium text-[#272727]">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= 10}
                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                </div>

                                <p className="text-base font-bold text-[#272727] w-24 text-right shrink-0">
                                    {formatPrice(item.price * item.quantity)}
                                </p>

                                {/* Remove */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 rounded-full hover:bg-red-50 transition shrink-0 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ── RIGHT: Order Summary ── */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-[#FDFDFD] rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-[#272727] mb-6">Order Summary</h2>

                            <div className="space-y-3 text-sm text-gray-500 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[#272727]">{formatPrice(subTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="font-medium text-[#272727]">{formatPrice(delivery)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                                <span className="text-base font-medium text-[#272727]">Total</span>
                                <span className="text-2xl font-bold text-[#272727]">{formatPrice(total)}</span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    className="w-full justify-center"
                                    onClick={() => navigate('/customer-details')}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
