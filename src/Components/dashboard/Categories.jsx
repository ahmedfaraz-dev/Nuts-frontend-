import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { adminApi } from "../../Api/adminApi";
import CategoryForm from "./CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getAllProducts().catch(() => ({ success: true, data: { products: [] } }))
      ]);

      if (catRes.success) setCategories(catRes.data || []);
      if (prodRes.success) setProducts(prodRes.data?.products || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getParentName = (parentId) => {
    const parent = categories.find((c) => c._id === parentId);
    return parent ? parent.name : "—";
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSave = async (categoryData) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        const res = await adminApi.editCategory(editingCategory._id, categoryData);
        if (res.success) {
          setCategories(prev => prev.map(c => c._id === editingCategory._id ? res.data : c));
        }
      } else {
        const res = await adminApi.createCategory(categoryData);
        if (res.success) {
          // The API returns the ID or the object, let's refresh to be safe or append
          await fetchData();
        }
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAttempt = (categoryId) => {
    setDeleteError("");
    // Check if category has products
    const hasProducts = products.some((p) => p.category === categoryId);
    if (hasProducts) {
      setDeleteError("Category has products. Reassign or remove the products first.");
      setDeleteConfirm(categoryId);
      return;
    }
    // Check if category has subcategories
    const hasSubcategories = categories.filter(
      (c) => c.parentCategoryId === categoryId && !c.isDeleted
    );
    if (hasSubcategories.length > 0) {
      setDeleteError("Category has subcategories. Handle them before deleting.");
      setDeleteConfirm(categoryId);
      return;
    }
    setDeleteConfirm(categoryId);
  };

  const handleDelete = async (categoryId) => {
    if (deleteError) {
      setDeleteConfirm(null);
      setDeleteError("");
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminApi.deleteCategory(categoryId);
      if (res.success) {
        setCategories(prev => prev.filter(c => c._id !== categoryId));
        setDeleteConfirm(null);
        setDeleteError("");
      } else {
        // Backend blocked deletion — show its message in the modal
        setDeleteError(res.message || "Cannot delete this category.");
      }
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Failed to delete category.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#F59115]" />
        <p className="text-sm">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-lg border border-red-100 p-6 text-center">
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
        <p className="text-sm text-gray-500">{categories.length} categories</p>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Parent</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-900 font-medium">{category.name}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{category.slug}</td>
                <td className="px-5 py-3 text-gray-600">{getParentName(category.parentCategoryId)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1.5 text-gray-400 hover:text-[#F59115] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteAttempt(category._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                  No categories found. Add your first category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Category</h3>
            {deleteError ? (
              <>
                <p className="text-sm text-red-500 mb-5">{deleteError}</p>
                <button
                  onClick={() => {
                    setDeleteConfirm(null);
                    setDeleteError("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-5">
                  Are you sure you want to delete this category?
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
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 justify-center"
                  >
                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}