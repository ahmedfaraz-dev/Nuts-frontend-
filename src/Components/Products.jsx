import { useEffect, useState } from "react";
import { userApi } from "../Api/userApi";
import Product from "./Ui/Product";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            Our Products
          </h2>

          {/* Products Grid — 1 col mobile | 2 col tablet | 4 col laptop */}
          <div className="grid grid-cols-1 gap-6 mt-6 md:mt-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {products.map((item) => (
              <Product key={item.id} item={item} />
            ))}
          </div>

          {products.length === 0 && (
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
