import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { userApi } from "../Api/userApi";
import Product from "./Ui/Product";
import { SearchX, ChevronLeft, ChevronRight, ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../contexts/CurrencyContext";

const ProductList = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [activeDiscount, setActiveDiscount] = useState(null);

  const query = limit ? "" : (searchParams.get("q")?.trim() || "");
  const categoryParam = searchParams.get("category");
  const discountParam = searchParams.get("discount");
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const currentPage = pageParam < 1 ? 1 : pageParam;
  const itemsPerPage = 6;

  const categories = ["All", "Cashews", "Almonds", "Walnuts", "Pistachios", "Dates", "Mix Dry Fruits"];
  const discounts = [
    { label: "10% Off or more", value: 10 },
    { label: "20% Off or more", value: 20 },
    { label: "30% Off or more", value: 30 },
    { label: "50% Off or more", value: 50 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await userApi.getAllProducts();

        if (response.success) {
          const rawProducts = response.data || [];

          const mappedProducts = rawProducts.map((item) => ({
            id: item._id || item.id,
            title: item.name,
            desc: item.discription || item.description,
            price: item.price,
            image: item.images?.[0] || "/images/placeholder.png",
            activeDeal: item.activeDeal || null,
            stock: item.stock,
          }));

          setProducts(mappedProducts);
        } else {
          setError(response.message || "Failed to fetch products");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const lowerQ = query.toLowerCase();

  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Apply Search Query Filter
    if (query) {
      result = result.filter((p) => 
        p.title?.toLowerCase().includes(lowerQ) ||
        p.desc?.toLowerCase().includes(lowerQ)
      );
    }

    // 2. Apply Category Filter
    if (activeCategory !== "All") {
      result = result.filter((p) => {
        const matchesCategory = 
          p.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          (p.desc && p.desc.toLowerCase().includes(activeCategory.toLowerCase()));
        return matchesCategory;
      });
    }

    // 3. Apply Discount Filter
    if (activeDiscount !== null) {
      result = result.filter((p) => {
        const discount = p.activeDeal ? p.activeDeal.discount : 0;
        return discount >= activeDiscount;
      });
    }

    // 4. Apply Price Range Filter
    result = result.filter((p) => p.price <= priceRange[1]);

    return result;
  }, [products, query, lowerQ, activeCategory, activeDiscount, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const noMatch = (query || activeCategory !== "All" || activeDiscount !== null) && filteredProducts.length === 0;

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [totalPages, currentPage]);

  // Auto-apply filters based on search query or URL params
  useEffect(() => {
    if (products.length > 0) {
      // Priority 1: Handle explicit URL parameters
      if (categoryParam) {
        const validCat = categories.find(c => c.toLowerCase() === categoryParam.toLowerCase());
        if (validCat) setActiveCategory(validCat);
      }
      
      if (discountParam) {
        const dVal = parseInt(discountParam);
        if (!isNaN(dVal)) setActiveDiscount(dVal);
      }

      // Priority 2: If searching, try to auto-detect category/discount from the query
      if (query && !categoryParam) {
        const lowerQ = query.toLowerCase();

        // Improved category matching (handles singular/plural and containing strings)
        const matchedCategory = categories.find(
          (cat) => 
            cat !== "All" && 
            (lowerQ.includes(cat.toLowerCase().replace(/s$/, '')) || 
             cat.toLowerCase().includes(lowerQ))
        );

        if (matchedCategory) {
          setActiveCategory(matchedCategory);
        }

        // Find matches for discount
        const matchedProduct = products.find((p) =>
          p.title?.toLowerCase().includes(lowerQ)
        );

        if (matchedProduct && matchedProduct.activeDeal?.discount && !discountParam) {
          const discountVal = matchedProduct.activeDeal.discount;
          const bestDiscount = [...discounts]
            .sort((a, b) => b.value - a.value)
            .find((d) => discountVal >= d.value);

          if (bestDiscount) {
            setActiveDiscount(bestDiscount.value);
          }
        }
      }
    }
  }, [query, products, categoryParam, discountParam]);

  if (loading)
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59115]"></div>
      </div>
    );

  if (error)
    return (
      <div className="w-full h-96 flex items-center justify-center text-red-500 bg-red-50 p-6 rounded-xl border border-red-100">
        <p className="font-medium text-center">{error}</p>
      </div>
    );

  const FilterContent = () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          Categories
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59115]"></span>
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                ? "bg-[#F59115] text-white shadow-lg shadow-orange-200"
                : "text-gray-500 hover:bg-orange-50 hover:text-[#F59115]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          Price Range
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59115]"></span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400">
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(5000)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#F59115]"
          />
          <div className="flex items-center justify-between">
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700">
              Up to {formatPrice(priceRange[1])}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          Discount
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59115]"></span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {discounts.map((d) => (
            <button
              key={d.value}
              onClick={() => setActiveDiscount(activeDiscount === d.value ? null : d.value)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold border-2 transition-all duration-300 ${activeDiscount === d.value
                ? "bg-[#F59115] border-[#F59115] text-white shadow-md shadow-orange-100"
                : "border-gray-100 text-gray-500 hover:border-orange-200 hover:text-[#F59115]"
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setActiveCategory("All");
          setPriceRange([0, 5000]);
          setActiveDiscount(null);
          setSearchParams({}); // Clears q, category, and discount from the URL
        }}
        className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-400 hover:border-[#F59115] hover:text-[#F59115] transition-all duration-300"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <div className="w-full py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 md:text-3xl tracking-tight">
                {query && !limit ? (
                  <>
                    Search results for{" "}
                    <span className="text-[#F59115]">"{query}"</span>
                  </>
                ) : (
                  limit ? "Our Products" : "Explore Premium Nuts"
                )}
              </h2>
              <p className="text-gray-400 text-sm mt-2 font-medium">
                {limit
                  ? "Discover our selection of premium quality dry fruits."
                  : "Handpicked quality dry fruits from around the world."}
              </p>
            </div>

            {!limit && (
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#F59115] transition-all duration-300"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {!limit && (
              <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-fit">
                <div className="bg-white rounded-3xl p-8 border border-gray-100/50">
                  <FilterContent />
                </div>
              </aside>
            )}

            <div className="flex-1">
              {noMatch && (
                <div className="mb-8 flex items-start gap-4 bg-orange-50 border border-orange-200/50 rounded-2xl p-5 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <SearchX className="w-6 h-6 text-[#F59115]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">No matches found</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      We couldn't find any products matching your current filters. Try adjusting your search or resetting filters.
                    </p>
                  </div>
                </div>
              )}

              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {paginatedProducts.map((item) => (
                    <Product key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                !noMatch && (
                  <div className="text-center py-32 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-lg">No products available at the moment.</p>
                  </div>
                )
              )}

              {limit ? (
                <div className="mt-16 flex justify-center">
                  <button
                    onClick={() => navigate('/all-products')}
                    className="group relative flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-[#F59115] transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(245,145,21,0.3)] hover:-translate-y-1 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10">See All Products</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>
              ) : (
                totalPages > 1 && (
                  <div className="mt-24 flex flex-col items-center justify-center gap-10">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-14 h-14 rounded-2xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#F59115] hover:text-[#F59115] hover:bg-orange-50 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:hover:bg-white transition-all duration-300 shadow-sm active:scale-90"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          const isActive = currentPage === pageNum;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-14 h-14 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-90 ${isActive
                                ? "bg-[#F59115] text-white shadow-xl shadow-orange-200 scale-110"
                                : "bg-white border-2 border-gray-100 text-gray-500 hover:border-orange-200 hover:text-[#F59115] hover:bg-orange-50"
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-14 h-14 rounded-2xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#F59115] hover:text-[#F59115] hover:bg-orange-50 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:hover:bg-white transition-all duration-300 shadow-sm active:scale-90"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="px-6 py-3 bg-gray-50/80 backdrop-blur-sm rounded-full border border-gray-100/50 shadow-sm">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Showing <span className="text-[#F59115]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#F59115]">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="text-gray-900">{filteredProducts.length}</span> Products
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <FilterContent />
            </div>
            <div className="p-6 border-t border-gray-50">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-4 bg-[#F59115] text-white font-bold rounded-2xl shadow-lg shadow-orange-100"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
