import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function DealForm({ deal, products, onSave, onClose, isLoading }) {
  const toDateInputValue = (value) => {
    if (!value) return "";
    // Handles "YYYY-MM-DD" and full ISO strings reliably.
    return String(value).slice(0, 10);
  };

  const [form, setForm] = useState({
    product: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (deal) {
      const productId =
        typeof deal.product === "object" && deal.product !== null
          ? deal.product._id
          : deal.product;
      setForm({
        product: productId || "",
        discount: deal.discount || "",
        startDate: toDateInputValue(deal.startDate),
        endDate: toDateInputValue(deal.endDate),
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product || !form.discount || !form.endDate) return;

    const discount = Number(form.discount);
    if (discount < 0 || discount > 100) {
      setError("Discount must be between 0 and 100");
      return;
    }

    const startDate = form.startDate || new Date().toISOString().split("T")[0];
    const endDate = form.endDate;

    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date");
      return;
    }

    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (new Date(endDate).getTime() - new Date(startDate).getTime() > oneYear) {
      setError("Deal cannot exceed 1 year");
      return;
    }
    console.log("Form Data:", {
      product: form.product,
      discount,
      startDate,
      endDate,
    });

    onSave({
      product: form.product,
      discount,
      startDate,
      endDate,
    });
  };

  // Products are pre-filtered by the parent (Deals.jsx) based on existing deals
  const availableProducts = products;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            {deal ? "Edit Deal" : "Add Deal"}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <select
              name="product"
              value={form.product}
              onChange={handleChange}
              required
               disabled={!!deal || isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select a product</option>
              {availableProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%) *</label>
            <input
              name="discount"
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
              placeholder="0"
              required
               disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                 disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                 disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
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
              className="px-4 py-2 text-sm font-medium text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-70 flex items-center gap-2 justify-center"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? (deal ? "Updating..." : "Saving...") : (deal ? "Update Deal" : "Save Deal")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}