import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

export default function DealForm({ deal, products, onSave, onClose, isLoading, serverError }) {
  const toDateInputValue = (value) => {
    if (!value) return "";
    // Handles "YYYY-MM-DD" and full ISO strings reliably.
    return String(value).slice(0, 10);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    product: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deal) {
      const productId =
        typeof deal.product === "object" && deal.product !== null
          ? deal.product._id
          : deal.product;
      setForm({
        product: productId || "",
        discount: deal.discount ?? "",
        startDate: toDateInputValue(deal.startDate),
        endDate: toDateInputValue(deal.endDate),
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear only the error for the field being edited
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Product
    if (!form.product) {
      newErrors.product = "Please select a product.";
    }

    // Discount
    if (form.discount === "" || form.discount === undefined) {
      newErrors.discount = "Discount is required.";
    } else {
      const discount = Number(form.discount);
      if (isNaN(discount)) {
        newErrors.discount = "Discount must be a valid number.";
      } else if (!Number.isInteger(discount)) {
        newErrors.discount = "Discount must be a whole number (no decimals).";
      } else if (discount < 1 || discount > 100) {
        newErrors.discount = "Discount must be between 1% and 100%.";
      }
    }

    // Dates
    const startDate = form.startDate || todayStr;

    if (!deal && form.startDate && form.startDate < todayStr) {
      newErrors.startDate = "Start date cannot be in the past.";
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required.";
    } else {
      if (!deal && form.endDate < todayStr) {
        newErrors.endDate = "End date cannot be in the past.";
      }
      if (form.endDate <= startDate) {
        newErrors.endDate = "End date must be after start date.";
      }
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      if (new Date(form.endDate).getTime() - new Date(startDate).getTime() > oneYear) {
        newErrors.endDate = "Deal duration cannot exceed 1 year.";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const discount = Number(form.discount);
    const startDate = form.startDate || todayStr;
    const endDate = form.endDate;

    onSave({
      product: form.product,
      discount,
      startDate,
      endDate,
    });
  };

  // Products are pre-filtered by the parent (Deals.jsx) based on existing deals
  const availableProducts = products;
  const noProductsAvailable = !deal && availableProducts.length === 0;

  // Helper to render field error
  const fieldError = (field) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} />
        {errors[field]}
      </p>
    ) : null;

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
        <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
          {/* No products available warning */}
          {noProductsAvailable && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <AlertCircle size={16} className="shrink-0" />
              All products already have an active deal. Remove an existing deal first.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <select
              name="product"
              value={form.product}
              onChange={handleChange}
              disabled={!!deal || isLoading || noProductsAvailable}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400 ${errors.product ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#F59115]"}`}
            >
              <option value="">Select a product</option>
              {availableProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {fieldError("product")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%) *</label>
            <input
              name="discount"
              type="number"
              min="1"
              max="100"
              step="1"
              value={form.discount}
              onChange={handleChange}
              placeholder="e.g. 15"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${errors.discount ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#F59115]"}`}
            />
            {fieldError("discount")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                min={deal ? undefined : todayStr}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${errors.startDate ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#F59115]"}`}
              />
              {fieldError("startDate")}
              {!form.startDate && !errors.startDate && (
                <p className="mt-1 text-xs text-gray-400">Defaults to today</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || todayStr}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${errors.endDate ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#F59115]"}`}
              />
              {fieldError("endDate")}
            </div>
          </div>

          {/* Server/backend error displayed inline */}
          {serverError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              {serverError}
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
              disabled={isLoading || noProductsAvailable}
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