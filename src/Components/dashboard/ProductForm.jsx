import { useState, useEffect, useRef } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function ProductForm({ product, categories, onSave, onClose, isLoading }) {
  const { currency } = useCurrency();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    isActive: true,
    discription: "",
    hasDeal: false,
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        isActive: product.isActive ?? true,
        discription: product.discription || "",
        hasDeal: !!product.activeDeal,
        discount: "",
        startDate: "",
        endDate: "",
      });
      // For editing, we might show existing images if the API provides them
      if (product.images) {
        setPreviews(product.images);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("You can only upload exactly 3 images.");
      return;
    }

    setImages(files);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation based on schema
    if (form.name.length < 3) return alert("Name must be at least 3 characters");
    if (form.discription.length < 3 || form.discription.length > 200) {
      return alert("Description must be between 3 and 200 characters");
    }
    if (form.category.length < 24) return alert("Please select a valid category");

    if (!product && images.length !== 3) {
      return alert("Exactly 3 images are required for new products");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("isActive", form.isActive);
    formData.append("discription", form.discription);

    // Append images
    images.forEach((file) => {
      formData.append("images", file);
    });

    if (form.hasDeal && form.discount && form.endDate) {
      const dealData = {
        discount: Number(form.discount),
        startDate: form.startDate || new Date().toISOString().split("T")[0],
        endDate: form.endDate,
      };
      formData.append("deals", JSON.stringify(dealData));
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Min 3 characters"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="discription"
              value={form.discription}
              onChange={handleChange}
              placeholder="3 - 200 characters"
              required
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-400"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{form.discription.length}/200</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ({currency === 'USD' ? '$' : 'Rs.'}) *</label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors bg-white font-mono disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images (Exactly 3) *</label>
            <div
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
            >
              <Upload size={24} className="text-gray-400" />
              <p className="text-xs text-gray-500">
                {isLoading ? "Uploading..." : "Click to upload 3 product images"}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
                disabled={isLoading}
              />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden border border-gray-100 bg-gray-50 relative">
                    <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 p-1 bg-black/60 text-[8px] text-white rounded-bl-md">
                      {i + 1}
                    </div>
                  </div>
                ))}
                {previews.length < 3 && Array(3 - previews.length).fill(0).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-md border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                    <ImageIcon size={16} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-[#F59115]"
            />
            <span className="text-sm text-gray-700 font-medium">Active (Visible to customers)</span>
          </label>

          {/* Deal section — only for new products */}
          {!product && (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50/50 border-b border-gray-100 transition-colors hover:bg-gray-50">
                <input
                  name="hasDeal"
                  type="checkbox"
                  checked={form.hasDeal}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#F59115]"
                />
                <span className="text-sm text-gray-700 font-medium">Create with promotional deal</span>
              </label>

              {form.hasDeal && (
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%) *
                    </label>
                    <input
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <input
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? (product ? "Updating..." : "Saving...") : (product ? "Update Product" : "Save Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}