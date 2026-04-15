import { useState, useEffect } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";

export default function CategoryForm({ category, categories, onSave, onClose, isLoading }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    parentCategoryId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        parentCategoryId: category.parentCategoryId || "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from name if user is typing name
      if (name === "name") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Schema validation
    if (form.name.length < 3) {
      return setError("Category name should have at least 3 characters");
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(form.slug)) {
      return setError("Slug can only contain lowercase letters, numbers, and single hyphens");
    }

    onSave({
      name: form.name,
      slug: form.slug,
      parentCategoryId: form.parentCategoryId || null,
    });
  };

  // Filter out the current category from parent options to prevent self-reference
  const parentOptions = categories.filter(
    (c) => c._id !== category?._id
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {category ? "Modify Category" : "New Category"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dry Fruits"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug *</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="dry-fruits"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors font-mono disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent Category (Optional)</label>
            <select
              name="parentCategoryId"
              value={form.parentCategoryId}
              onChange={handleChange}
               disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">None (Top-level)</option>
              {parentOptions.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
             <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-bold text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-all shadow-sm hover:shadow-orange-200 cursor-pointer disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? (category ? "Updating..." : "Creating...") : (category ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}