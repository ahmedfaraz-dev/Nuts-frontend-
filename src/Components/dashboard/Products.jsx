import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Image as ImageIcon, Search } from "lucide-react";
import ProductForm from "./ProductForm";
import Pagination from "./Pagination";
import { adminApi } from "../../Api/adminApi";
import { SkeletonTableRow } from "../../Components/Ui/Skeletons";
import { useCurrency } from "../../contexts/CurrencyContext";

const extractProduct = (res) => res?.data?.product ?? res?.data ?? res?.product ?? null;

export default function Products() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage === 1) return;
    setCurrentPage(1);
  }, [debouncedSearch]);

  const applyProductsResponse = useCallback((productsData) => {
    if (!productsData?.success) return;
    setProducts(productsData.data?.products || []);
    setTotalItems(productsData.meta?.totalProducts || 0);
    setTotalPages(productsData.meta?.totalPages || 1);
    setError(null);
  }, []);

  const fetchData = useCallback(
    async (isRefresh = false, signal) => {
      if (!isRefresh) setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          adminApi.getAllProducts(currentPage, itemsPerPage, debouncedSearch, signal),
          adminApi.getCategories({ signal }).catch(() => ({ success: true, data: [] })),
        ]);

        if (signal?.aborted || !mountedRef.current) return;

        applyProductsResponse(productsData);
        if (categoriesData.success) setCategories(categoriesData.data || []);
      } catch (err) {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
        if (!mountedRef.current) return;
        console.error("Error fetching admin data:", err);
        setError("Failed to load products. Please check your connection.");
      } finally {
        if (!signal?.aborted && mountedRef.current && !isRefresh) setLoading(false);
      }
    },
    [currentPage, debouncedSearch, itemsPerPage, applyProductsResponse]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(false, controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const refreshProducts = async () => {
    try {
      const productsData = await adminApi.getAllProducts(
        currentPage,
        itemsPerPage,
        debouncedSearch
      );
      if (!mountedRef.current) return;
      applyProductsResponse(productsData);
    } catch (err) {
      if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
      console.error("Error refreshing products:", err);
    }
  };

  const getCategoryName = (catId) => {
    if (!catId) return "";
    const cat = categories.find((c) => c._id === catId);
    return cat ? cat.name : "";
  };

  const getProductCategoryLabel = (product) => {
    const c = product?.category;
    if (c && typeof c === "object" && c.name) return c.name;
    const id = typeof c === "string" ? c : product?.categoryId;
    return getCategoryName(id) || "—";
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = async (productData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        const res = await adminApi.editProduct(editingProduct._id, productData);
        if (res.success) {
          const updated = extractProduct(res);
          if (updated) {
            setProducts((prev) =>
              prev.map((p) => (p._id === editingProduct._id ? { ...p, ...updated } : p))
            );
          }
          await refreshProducts();
        }
      } else {
        const res = await adminApi.createProduct(productData);
        if (res.success) {
          if (currentPage !== 1) {
            setCurrentPage(1);
          } else {
            await refreshProducts();
          }
        }
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save product");
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setActionLoading(true);
    try {
      await adminApi.deleteProduct(productId);
      if (!mountedRef.current) return;

      setDeleteConfirm(null);
      await refreshProducts();
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Delete error:", err);
      alert(err?.response?.data?.message || "Failed to delete product");
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] focus:ring-1 focus:ring-[#F59115]"
            />
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {searchTerm ? `${totalItems} found` : `${totalItems} products`}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Deal</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-lg border border-red-100 p-6">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">{error}</p>
                    <button
                      onClick={() => fetchData()}
                      className="mt-4 text-sm text-[#F59115] hover:underline font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate" title={product.discription}>
                      {product.discription || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3 text-gray-600">{product.stock}</td>
                    <td className="px-5 py-3 text-gray-600">{getProductCategoryLabel(product)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          product.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {product?.activeDeal?.discount !== undefined
                        ? `${product.activeDeal.discount}%`
                        : "No Deals"}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-[#F59115] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">
                      No products found. Add your first product.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        label="Total Products"
      />

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          isLoading={actionLoading}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
