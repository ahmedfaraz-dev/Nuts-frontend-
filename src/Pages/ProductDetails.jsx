import React, { useState, useEffect } from 'react'
import Button from '../Components/Ui/Button.jsx'
import { ChevronUp, ChevronDown, X, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import imgFour from '../assets/ProductImages/shbackgound.png'
import Testmonial from '../Components/Testmonial.jsx'
import VideoSection from '../Components/VideoSection.jsx'
import { useCurrency } from '../contexts/CurrencyContext.jsx';
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from '../contexts/CartContext.jsx';
import { userApi } from '../Api/userApi.js';
import { ratingApi } from '../Api/ratingApi.js';
import { SkeletonImage, SkeletonText, SkeletonButton } from '../Components/Ui/Skeletons';
import { getProductRatingSummary } from '../utils/ratingUtils.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const navigate = useNavigate();
    const { addToCart, cartItems, totalItems } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await userApi.getProductById(id);
                if (response.success) {
                    setProduct(response.product || response.data);
                } else {
                    setError(response.message || 'Product not found');
                }
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const response = await ratingApi.getProductReviews(id);
                if (response.success) {
                    setReviews(response.reviews || []);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchProduct();
        fetchReviews();

        const handleRatingSubmitted = (e) => {
            if (e.detail?.productId === id) {
                fetchProduct();
                fetchReviews();
            }
        };
        window.addEventListener('rating-submitted', handleRatingSubmitted);
        return () => window.removeEventListener('rating-submitted', handleRatingSubmitted);
    }, [id]);
    
    // Derived values - defined before helpers for safety
    const rawImages = product?.images || [];
    const images = [
        rawImages[0] || '/images/placeholder.png',
        rawImages[1] || rawImages[0] || '/images/placeholder.png',
        rawImages[2] || rawImages[0] || '/images/placeholder.png',
    ];
    const description = product?.discription || product?.description || '';
    const maxQty = product?.stock ? Math.min(product.stock, 10) : 10;
    const ratingSummary = getProductRatingSummary(product);
    const canRateHint = Boolean(user);

    const getFinalPrice = () => {
        if (!product) return 0;
        return product.activeDeal 
            ? product.price * (1 - product.activeDeal.discount / 100)
            : product.price;
    };

    function handleIncrement() {
        setQuantity((prev) => prev < maxQty ? prev + 1 : prev);
    }

    function handleDecrement() {
        setQuantity((prev) => prev > 1 ? prev - 1 : prev);
    }


    function handleCustomerDetails() {
        if (!product) return;
        addToCart({
            id: product._id || product.id,
            name: product.name,
            price: getFinalPrice(),
            image: images[0],
            quantity
        });
        navigate('/customer-details');
    }

    function handleAddToCart() {
        if (!product) return;
        addToCart({
            id: product._id || product.id,
            name: product.name,
            price: getFinalPrice(),
            image: images[0],
            quantity
        });
        setCartModalOpen(true);
    }

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <section className="w-full">
                <div className="max-w-[1280px] mx-auto px-16 sm:px-6 lg:px-8 py-6">

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 py-4 text-sm text-gray-500 hover:text-[#F59115] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </button>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-[160px_474px_482px] gap-3 h-[550px]">
                        {loading ? (
                            <>
                                {/* COLUMN 1: Thumbnails */}
                                <div className="flex flex-col gap-6 h-full overflow-y-auto">
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <SkeletonImage key={idx} className="w-full h-[170px] rounded-xl" />
                                    ))}
                                </div>

                                {/* COLUMN 2: Main Image */}
                                <div className="h-full">
                                    <SkeletonImage className="w-full h-full rounded-xl" />
                                </div>

                                {/* COLUMN 3: Product Details */}
                                <div className="flex flex-col h-full pl-5 gap-4">
                                    <SkeletonText className="h-6 w-3/4" />
                                    <SkeletonText className="h-5 w-1/2" />
                                    <SkeletonText className="h-32 w-full" />
                                    <SkeletonText className="h-10 w-40 rounded-lg" />
                                    <div className="mt-auto flex gap-4">
                                        <SkeletonButton className="h-12 w-full rounded-xl" />
                                        <SkeletonButton className="h-12 w-full rounded-xl" />
                                    </div>
                                </div>
                            </>
                        ) : error || !product ? (
                            <div className="col-span-3 flex flex-col items-center justify-center text-gray-500 gap-2">
                                <p>{error || 'Product not found.'}</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 text-sm text-[#F59115] hover:underline font-semibold"
                                >
                                    <ArrowLeft size={16} />
                                    Back to home
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* COLUMN 1: Thumbnails */}
                                <div className="flex flex-col gap-6 h-full overflow-y-auto">
                                    {images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${product.name} view ${idx + 1}`}
                                            onClick={() => setSelectedImage(idx)}
                                            onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                                            className={`w-full h-[170px] object-cover rounded-xl cursor-pointer transition-all duration-200 ${selectedImage === idx
                                                ? 'ring-2 ring-[#F59115] opacity-100'
                                                : 'opacity-60 hover:opacity-80'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* COLUMN 2: Main Image */}
                                <div className="h-full ">
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                                        className="w-full h-full object-cover rounded-xl transition-all duration-300"
                                    />
                                </div>

                                {/* COLUMN 3: Product Details */}
                                <div className="flex flex-col h-full pl-5">

                                    <h1 className="flex-1 text-[20px] font-medium pr-10">{product.name}</h1>

                                    {product?.activeDeal && (
                                        <p className="py-5 text-[#F59B2B] font-medium flex items-center gap-2">
                                            Special Price: {product.activeDeal.discount}% OFF
                                        </p>
                                    )}

                                    <div className="flex items-baseline gap-3">
                                        <h3 className="text-[20px] font-bold text-[#F59115]">
                                            {formatPrice(getFinalPrice())}
                                        </h3>
                                        {product?.activeDeal && (
                                            <span className="text-gray-400 line-through text-sm">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                        <span className="text-sm font-medium text-gray-500">per item</span>
                                    </div>
                                    {(ratingSummary.count > 0 || reviews.length > 0) && (
                                        <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span>
                                                {ratingSummary.count > 0
                                                    ? `${ratingSummary.average.toFixed(1)} average (${ratingSummary.count} review${ratingSummary.count > 1 ? "s" : ""})`
                                                    : `${reviews.length} review${reviews.length > 1 ? "s" : ""}`}
                                            </span>
                                        </div>
                                    )}

                                    <h3 className="py-5 text-[20px] text-[#F59B2B]">Description</h3>

                                    <p className="flex-1 text-gray-600 text-sm leading-relaxed">
                                        {description || 'Premium quality dry fruit for health and wellness.'}
                                    </p>

                                    {/* Quantity Control */}
                                    <div className="py-2 flex border-gray-200 border px-5 items-center w-fit gap-3 rounded">
                                        <p className="text-sm font-medium text-gray-700">Quantity</p>
                                        <button
                                            className="w-7 h-7 rounded-full bg-[#F59115] flex items-center justify-center disabled:bg-gray-200 cursor-pointer"
                                            onClick={handleDecrement}
                                            disabled={quantity === 1}
                                        >
                                            <ChevronDown className="w-4 h-4 text-white" />
                                        </button>
                                        <span className="text-base font-semibold w-5 text-center">{quantity}</span>
                                        <button
                                            className="w-7 h-7 rounded-full bg-[#F59115] flex items-center justify-center disabled:bg-gray-200 cursor-pointer"
                                            onClick={handleIncrement}
                                            disabled={quantity === maxQty}
                                        >
                                            <ChevronUp className="w-4 h-4 text-white" />
                                        </button>
                                    </div>

                                    <div className="flex-1 text-[20px] py-8">
                                        <p className="text-sm text-gray-500">Usually deliver in 3 days</p>
                                    </div>

                                    <div className="flex gap-4 mt-auto">
                                        <Button onClick={handleAddToCart}>Add to Cart</Button>
                                        <Button onClick={handleCustomerDetails}>Buy Now</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Product Details Section */}
            {loading ? (
                <section className="w-full">
                    <div className="max-w-[1280px] mx-auto px-16 py-10">
                        <SkeletonText className="h-6 w-1/3 mb-4" />
                        <SkeletonImage className="h-[500px] w-full rounded-xl" />
                    </div>
                </section>
            ) : !error && product ? (
                <section className="w-full">
                    <div className="max-w-[1280px] mx-auto px-16 py-10">
                        <h3 className="text-[20px] font-medium mb-4">
                            Product Details of {product.name}
                        </h3>

                        <div className="rounded-xl shadow-md shadow-black/10 overflow-hidden bg-white">

                            {/* IMAGE SECTION */}
                            <div
                                className="h-[500px] bg-cover bg-center"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,1) 100%),
                                        url(${images[0]})
                                    `,
                                }}
                            />

                            {/* COLLAPSIBLE DETAILS */}
                            <div
                                className={`
                                    overflow-hidden
                                    transition-[max-height,opacity] duration-500 ease-in-out
                                    ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
                                `}
                            >
                                <div className="p-6 space-y-6">

                                    <div className="text-gray-700">
                                        <h1 className="text-2xl font-medium mb-2">
                                            Products Details Of {product.name}
                                        </h1>
                                        <ul className="flex flex-wrap gap-4 list-disc list-inside marker:text-orange-500">
                                            <li>High Quality</li>
                                            <li>Fresh</li>
                                            <li>Imported</li>
                                            <li>Original</li>
                                            <li>Hand Made</li>
                                        </ul>
                                    </div>

                                    <div className="text-gray-700">
                                        <h1 className="text-2xl font-medium mb-2">
                                            Product Description
                                        </h1>
                                        <p className="text-gray-600 leading-relaxed">
                                            {description || 'Our premium dry food is made from high-quality ingredients, ensuring you get the best nutrition and taste.'}
                                        </p>
                                    </div>

                                    <div className="text-gray-700">
                                        <h1 className="text-2xl font-medium mb-2">
                                            Specification Of {product.name}
                                        </h1>
                                        <ul className="flex gap-4 list-disc list-inside marker:text-orange-500">
                                            <li>Hunza Organics</li>
                                            <li>Stock: {product.stock} units</li>
                                        </ul>
                                    </div>
                                    <div className="text-gray-700">
                                        <h1 className="text-2xl font-medium mb-2">
                                            Customer Ratings & Reviews
                                        </h1>
                                        {(ratingSummary.count > 0 || reviews.length > 0) && (
                                            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-6">
                                                {/* Left: Average + Stars + Count */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-5xl font-bold text-gray-800">
                                                            {ratingSummary.average.toFixed(1)}
                                                        </span>
                                                        <span className="text-lg font-medium text-gray-400">/5</span>
                                                    </div>
                                                    <div className="flex items-center gap-0.5">
                                                        {[1,2,3,4,5].map(star => (
                                                            <Star
                                                                key={star}
                                                                size={22}
                                                                className={star <= Math.round(ratingSummary.average)
                                                                    ? "text-amber-400 fill-amber-400"
                                                                    : "text-gray-300"
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        {ratingSummary.count} Rating{ratingSummary.count > 1 ? "s" : ""}
                                                    </p>
                                                </div>

                                                {/* Right: Star Distribution */}
                                                {reviews.length > 0 && (
                                                    <div className="space-y-2 w-fit">
                                                        {[5,4,3,2,1].map(star => {
                                                            const count = reviews.filter(r => Math.round(Number(r.rating)) === star).length;
                                                            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                            return (
                                                                <div key={star} className="flex items-center gap-3 text-xs">
                                                                    <div className="flex items-center gap-0.5 shrink-0">
                                                                        {[1,2,3,4,5].map(s => (
                                                                            <Star
                                                                                key={s}
                                                                                size={12}
                                                                                className={s <= star
                                                                                    ? "text-amber-400 fill-amber-400"
                                                                                    : "text-gray-300"
                                                                                }
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0">
                                                                        <div
                                                                            className="h-full bg-amber-400 rounded-full"
                                                                            style={{ width: `${pct}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="w-8 text-gray-600 text-right shrink-0 font-medium">{count}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {reviewsLoading ? (
                                            <div className="space-y-3">
                                                {Array.from({ length: 3 }).map((_, idx) => (
                                                    <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                                                        <SkeletonText className="h-4 w-1/3 mb-2" />
                                                        <SkeletonText className="h-3 w-full" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : reviews.length > 0 ? (
                                            <div className="space-y-3">
                                                {reviews.map((review) => (
                                                    <div key={review._id || review.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[#F59115]">
                                                                    {(review.userId?.name || "U").charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-sm text-gray-800">{review.userId?.name || "Verified Buyer"}</p>
                                                                    <p className="text-[10px] text-gray-400">
                                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="inline-flex items-center gap-1 text-xs text-gray-600">
                                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                                {Number(review.rating || 0).toFixed(1)}
                                                            </div>
                                                        </div>
                                                        <p className="font-semibold text-sm text-gray-800 mt-2">{review.title || "Customer review"}</p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {review.comment || "No comment provided."}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">
                                                Delivered buyers can submit the first review.
                                            </p>
                                        )}
                                        {!canRateHint && (
                                            <p className="text-xs text-gray-500 mt-3">
                                                Login required to submit a rating.
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* BUTTON */}
                            <div className="flex justify-center py-6">
                                <Button onClick={() => setOpen(prev => !prev)}>
                                    {open ? "Hide Details" : "See more Details"}
                                </Button>
                            </div>

                        </div>
                    </div>
                </section>
            ) : null}

            <section>
                <Testmonial />
                <VideoSection />
            </section>

            {/* ── CART MODAL ── */}
            {cartModalOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40"
                        onClick={() => setCartModalOpen(false)}
                    />

                    {/* Slide-in drawer from the right */}
                    <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-[#F59115]" />
                                <h2 className="text-lg font-semibold text-[#272727]">Cart
                                    {totalItems > 0 && (
                                        <span className="ml-2 text-sm font-normal text-gray-400">({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                                    )}
                                </h2>
                            </div>
                            <button
                                onClick={() => setCartModalOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-400 mt-10">Your cart is empty.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#272727] truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-[#F59115] shrink-0">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Total</span>
                                <span className="text-xl font-bold text-[#272727]">{formatPrice(cartTotal)}</span>
                            </div>

                            <button
                                onClick={() => { setCartModalOpen(false); navigate('/cart'); }}
                                className="w-full py-2.5 border border-[#F59115] text-[#F59115] rounded-xl font-medium hover:bg-orange-50 transition text-sm cursor-pointer"
                            >
                                View Cart
                            </button>
                            <button
                                onClick={() => { setCartModalOpen(false); navigate('/customer-details'); }}
                                className="w-full py-2.5 bg-[#F59115] hover:bg-orange-600 text-white rounded-xl font-semibold transition text-sm cursor-pointer"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ProductDetails
