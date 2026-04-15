import { Link } from "react-router-dom";
import { Clock, ShoppingBag, Flame } from "lucide-react";

const Product = ({ item }) => {
  const deal = item.activeDeal;
  const hasDeal = deal && deal.discount > 0;

  const dealPrice = hasDeal
    ? Math.round(item.price - (item.price * deal.discount) / 100)
    : null;

  const formatEndDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isOutOfStock = item.stock === 0;
  const isLowStock = !isOutOfStock && item.stock > 0 && item.stock <= 5;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 flex flex-col h-full border border-gray-100/80">

      {/* ── Image Area ── */}
      <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 shrink-0">

        {/* Image */}
        <img
          src={item.image || "/images/placeholder.png"}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = "/images/placeholder.png";
            e.target.className = "absolute inset-0 w-full h-full object-contain p-8 opacity-40";
          }}
        />

        {/* Bottom fade into card body */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />

        {/* Deal Badge */}
        {hasDeal && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#F59115] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-lg shadow-orange-200/60">
            <Flame size={10} className="shrink-0" />
            {deal.discount}% OFF
          </div>
        )}

        {/* Out of Stock badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 z-10 bg-gray-800/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Sold Out
          </div>
        )}

        {/* Low stock chip */}
        {isLowStock && (
          <div className="absolute top-3 right-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Only {item.stock} left
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-grow px-4 pt-3 pb-4 gap-2">

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 capitalize group-hover:text-[#F59115] transition-colors duration-200 leading-tight">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {item.desc || "Premium quality dry fruit for health and wellness."}
        </p>

        {/* Deal End Date */}
        {hasDeal && deal.endDate && (
          <div className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-semibold bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full w-fit">
            <Clock size={9} />
            Deal ends {formatEndDate(deal.endDate)}
          </div>
        )}

        {/* ── Price + CTA ── */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">

          {/* Price */}
          <div className="flex flex-col leading-none">
            {hasDeal ? (
              <>
                <span className="text-base font-extrabold text-[#F59115]">
                  Rs. {dealPrice?.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 line-through mt-0.5">
                  Rs. {item.price?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-base font-extrabold text-gray-800">
                Rs. {item.price?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Buy Now Button */}
          <Link to={`/product/${item.id}`} tabIndex={isOutOfStock ? -1 : 0}>
            <button
              disabled={isOutOfStock}
              className="inline-flex items-center gap-1.5 bg-[#F59115] hover:bg-[#d87d12] active:scale-95 disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-400 text-[11px] font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-orange-200/70 hover:shadow-lg whitespace-nowrap"
            >
              <ShoppingBag size={12} className="shrink-0" />
              {isOutOfStock ? "Sold Out" : "Buy Now"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
