import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import ProductForm from "./ProductForm";
import { adminApi } from "../../Api/adminApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel fetch for better performance
      const [productsData, categoriesData] = await Promise.all([
        adminApi.getAllProducts(),
        adminApi.getCategories().catch(() => ({ success: true, data: [] })) // Fallback if route missing
      ]);

      if (productsData.success) setProducts(productsData.data?.products || []);
      if (categoriesData.success) setCategories(categoriesData.data || []);

      setError(null);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c._id === catId);
    return cat ? cat.name : "—";
  };

  const getDealDiscount = (dealId) => {
    // In a real API, deal info might be populated or we fetch separately
    // For now, checking if product has a deal
    const deal = deals.find((d) => d._id === dealId);
    return deal ? `${deal.discount}%` : "—";
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = async (productData, dealData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        // Edit existing
        const res = await adminApi.editProduct(editingProduct._id, productData);
        if (res.success) {
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data : p));
        }
      } else {
        // Create new
        const res = await adminApi.createProduct(productData);
        if (res.success) {
          const newProduct = res.data;

          // If there's deal data, create the deal for this new product
          if (dealData) {
            try {
              await adminApi.createDeal(newProduct._id, dealData);
              // Refresh everything to get final state with deal
              await fetchData();
            } catch (err) {
              console.error("Failed to create deal:", err);
              setProducts(prev => [...prev, newProduct]);
            }
          } else {
            setProducts(prev => [...prev, newProduct]);
          }
        }
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setActionLoading(true);
    try {
      await adminApi.deleteProduct(productId);

      // Update the local state directly for an immediate UI response
      setProducts((prev) => prev.filter((p) => p._id !== productId));

      // Close the confirmation modal
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#F59115]" />
        <p className="text-sm">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-lg border border-red-100 p-6">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-sm font-medium">{error}</p>
        <button onClick={fetchData} className="mt-4 text-sm text-[#F59115] hover:underline font-semibold">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{products.length} products</p>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Table */}
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
                <td className="px-5 py-3 text-gray-600">Rs. {product.price}</td>
                <td className="px-5 py-3 text-gray-600">{product.stock}</td>
                <td className="px-5 py-3 text-gray-600">{getCategoryName(product.category)}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${product.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{getDealDiscount(product.activeDeal)}</td>
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
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                  No products found. Add your first product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
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