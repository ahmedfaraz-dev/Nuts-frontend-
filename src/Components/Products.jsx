import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { userApi } from "../Api/userApi";
import Product from "./Ui/Product";
import { SearchX } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

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

  // ---------- search logic ----------
  const lowerQ = query.toLowerCase();

  // Products whose name contains the query
  const matched = query
    ? products.filter((p) => p.title?.toLowerCase().includes(lowerQ))
    : [];

  // Products whose name does NOT contain the query
  const rest = query
    ? products.filter((p) => !p.title?.toLowerCase().includes(lowerQ))
    : products;

  const noMatch = query && matched.length === 0;

  // Final ordered list: matched first, then the rest
  const displayProducts = query ? [...matched, ...rest] : products;
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

          {/* Matched products (only rendered when there are matches) */}
          {query && matched.length > 0 && (
            <>
              <p className="mt-4 text-sm text-gray-500">
                {matched.length} product{matched.length !== 1 ? "s" : ""} matched your search
              </p>
              <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {matched.map((item) => (
                  <Product key={item.id} item={item} />
                ))}
              </div>

              {/* Divider before "other products" */}
              {rest.length > 0 && (
                <div className="mt-12 mb-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-sm text-gray-400 whitespace-nowrap">Other Products</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              )}
            </>
          )}

          {/* Rest / default grid */}
          {displayProducts.length > 0 ? (
            !query || noMatch ? (
              // No query OR no match → show all
              <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {displayProducts.map((item) => (
                  <Product key={item.id} item={item} />
                ))}
              </div>
            ) : (
              // Has matches + has rest
              rest.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                  {rest.map((item) => (
                    <Product key={item.id} item={item} />
                  ))}
                </div>
              )
            )
          ) : (
            <div className="text-center py-10 text-gray-500">
              No products available at the moment.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductList;
