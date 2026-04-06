import { Link } from "react-router-dom";
import { Tag, Clock } from "lucide-react";

const Product = ({ item }) => {
  const deal = item.activeDeal;
  const hasDeal = deal && deal.discount > 0;

  // Calculate deal price: price - (price * discount / 100)
  const dealPrice = hasDeal
    ? Math.round(item.price - (item.price * deal.discount) / 100)
    : null;

  // Format end date nicely
  const formatEndDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOutOfStock = item.stock === 0;

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col h-full">

      {/* Deal Badge */}
      {hasDeal && (
        <div className="absolute top-3 left-3 z-10 bg-[#F59115] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          {deal.discount}% OFF
        </div>
      )}

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          Out of Stock
        </div>
      )}

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img
          src={item.image || "/images/placeholder.png"}
          alt={item.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "/images/placeholder.png"; }}
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-grow p-4">

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 capitalize group-hover:text-[#F59115] transition-colors duration-200 mb-1">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {item.desc || "Premium quality dry fruit for health and wellness."}
        </p>

        {/* Deal End Date */}
        {hasDeal && deal.endDate && (
          <div className="flex items-center gap-1 text-[10px] text-orange-500 font-medium mb-3">
            <Clock size={10} />
            <span>Deal ends {formatEndDate(deal.endDate)}</span>
          </div>
        )}

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDeal ? (
              <>
                {/* Deal Price */}
                <span className="text-base font-bold text-[#F59115]">
                  Rs. {dealPrice}
                </span>
                {/* Original Price — strikethrough */}
                <span className="text-xs text-gray-400 line-through">
                  Rs. {item.price}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-800">
                Rs. {item.price}
              </span>
            )}
          </div>

          <Link to={`/product/${item.id}`}>
            <button
              disabled={isOutOfStock}
              className="bg-[#F59115] hover:bg-[#d87d12] disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              {isOutOfStock ? "Sold Out" : "Buy Now"}
            </button>
          </Link>
        </div>

        {/* Low stock warning */}
        {!isOutOfStock && item.stock <= 5 && item.stock > 0 && (
          <p className="text-[10px] text-orange-500 font-medium mt-2 flex items-center gap-1">
            <Tag size={9} /> Only {item.stock} left!
          </p>
        )}
      </div>
    </div>
  );
};

export default Product;
