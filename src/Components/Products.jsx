import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { userApi } from "../Api/userApi";
import Product from "./Ui/Product";
import { SearchX, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductList = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q")?.trim() || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const currentPage = pageParam < 1 ? 1 : pageParam;
  const itemsPerPage = 8;

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

  // ---------- search & pagination logic ----------
  const lowerQ = query.toLowerCase();

  const displayProducts = useMemo(() => {
    if (!query) return products;

    // Matched first, then the rest
    const matched = products.filter((p) => p.title?.toLowerCase().includes(lowerQ));
    const rest = products.filter((p) => !p.title?.toLowerCase().includes(lowerQ));
    return [...matched, ...rest];
  }, [products, lowerQ, query]);

  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  // Slice for current page (or show first few if limit is provided)
  const paginatedProducts = limit
    ? displayProducts.slice(0, limit)
    : displayProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const noMatch = query && !products.some(p => p.title?.toLowerCase().includes(lowerQ));

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Reset to last available page if current page becomes empty due to filtering/search
    if (totalPages > 0 && currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [totalPages, currentPage]);
  // ----------------------------------

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

  return (
    <div className="w-full bg-white">
      <div className="w-full py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">

          {/* Section Heading */}
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl lg:text-3xl">
            {query ? (
              <>
                Search results for{" "}
                <span className="text-[#F59115]">"{query}"</span>
              </>
            ) : (
              "Our Products"
            )}
          </h2>

          {/* "Not found" banner — shown when query exists but no match */}
          {noMatch && (
            <div className="mt-6 flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4">
              <SearchX className="w-5 h-5 text-[#F59115] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  No products found for{" "}
                  <span className="text-[#F59115] font-semibold">"{query}"</span>.
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing all available products instead.
                </p>
              </div>
            </div>
          )}

          {/* Products grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {paginatedProducts.map((item) => (
                <Product key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-8">
              <p className="text-gray-500 font-medium">No products available at the moment.</p>
            </div>
          )}


          {/* Action Footer (See All or Pagination) */}
          {limit ? (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => navigate('/all-products')}
                className="group relative flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-[#F59115] transition-all duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(245,145,21,0.2)] hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">See All Products</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500 ease-out" />

                {/* Subtle sheen effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          ) : (
            totalPages > 1 && (
              <div className="mt-20 flex flex-col items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#F59115] hover:text-[#F59115] hover:bg-orange-50 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:hover:bg-white transition-all duration-300 active:scale-90"
                    aria-label="Previous page"
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
                          className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 active:scale-90 ${isActive
                              ? "bg-[#F59115] text-white shadow-[0_8px_16px_rgba(245,145,21,0.25)] scale-110"
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
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#F59115] hover:text-[#F59115] hover:bg-orange-50 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:hover:bg-white transition-all duration-300 active:scale-90"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                  <p className="text-[13px] text-gray-500 font-medium">
                    Showing <span className="text-gray-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, displayProducts.length)}</span> of <span className="text-gray-900 font-bold">{displayProducts.length}</span> Products
                  </p>
                </div>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductList;
