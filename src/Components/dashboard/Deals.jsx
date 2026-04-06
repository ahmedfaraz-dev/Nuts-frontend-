import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { adminApi } from "../../Api/adminApi";
import DealForm from "./DealForm";

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dealsRes, prodRes] = await Promise.all([
        adminApi.getDeals(),
        adminApi.getAllProducts()
      ]);

      if (dealsRes.success) setDeals(dealsRes.data || []);
      if (prodRes.success) setProducts(prodRes.data?.products || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching deals:", err);
      setError("Failed to load deals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (product) => {
    // API returns populated product object { _id, name }
    if (typeof product === "object" && product !== null) return product.name || "—";
    // Fallback: look up by ID in local products list
    const found = products.find((p) => p._id === product);
    return found ? found.name : "—";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAdd = () => {
    setEditingDeal(null);
    setShowForm(true);
  };

  const handleEdit = async (deal) => {
    setActionLoading(true);
    try {
      const productId = typeof deal.product === 'object' ? deal.product._id : deal.product;
      const res = await adminApi.getCurrentProductDeal(productId);

      if (res.success && res.data && res.data.deal) {
        // Use the 'current' deal data from backend
        setEditingDeal(res.data.deal);
        setShowForm(true);
      } else {
        // Fallback to local deal if current fetch fails or returns empty
        setEditingDeal(deal);
        setShowForm(true);
      }
    } catch (err) {
      console.error("Error fetching current deal:", err);
      // Fallback
      setEditingDeal(deal);
      setShowForm(true);
    } finally {
      setActionLoading(false);
    }
  };


  const handleSave = async (dealData) => {
    setActionLoading(true);
    try {
      if (editingDeal) {
        const productId =
          typeof editingDeal.product === "object" && editingDeal.product !== null
            ? editingDeal.product._id
            : editingDeal.product;
        const res = await adminApi.editDeal(productId, editingDeal._id, dealData);
        if (res.success) {
          // Refetch to get the latest data including updated dates from backend
          await fetchData();
        }
      } else {
        const res = await adminApi.createDeal(dealData.product, {
          discount: dealData.discount,
          startDate: dealData.startDate,
          endDate: dealData.endDate,
        });
        if (res.success) {
          await fetchData();
        }
      }
      setShowForm(false);
      setEditingDeal(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save deal");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (dealId) => {
    const deal = deals.find((d) => d._id === dealId);
    if (!deal) return;

    setActionLoading(true);
    try {
      const res = await adminApi.deleteDeal(deal.product, dealId);
      if (res.success) {
        // Refresh products too to clear activeDeal local state
        await fetchData();
        setDeleteConfirm(null);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete deal");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#F59115]" />
        <p className="text-sm">Loading promotional deals...</p>
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
        <p className="text-sm text-gray-500">{deals.length} deals</p>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#F59115] rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus size={16} />
          Add Deal
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">End Date</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-900 font-medium whitespace-nowrap">
                  {getProductName(deal.product)}
                </td>
                <td className="px-5 py-3">
                  <span className="inline-block px-2 py-0.5 rounded bg-orange-50 text-[#F59115] text-xs font-medium">
                    {deal.discount}% off
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{formatDate(deal.startDate)}</td>
                <td className="px-5 py-3 text-gray-600">{formatDate(deal.endDate)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(deal)}
                    className="p-1.5 text-gray-400 hover:text-[#F59115] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(deal._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  No deals found. Add your first deal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Deal Form Modal */}
      {showForm && (() => {
        // Build set of product IDs that already have a deal
        const dealtProductIds = new Set(
          deals.map((d) =>
            typeof d.product === "object" && d.product !== null ? d.product._id : d.product
          )
        );
        // For add: exclude products that already have a deal
        // For edit: show all products so the current one stays visible
        const formProducts = editingDeal
          ? products
          : products.filter((p) => !dealtProductIds.has(p._id));

        return (
          <DealForm
            deal={editingDeal}
            products={formProducts}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingDeal(null);
            }}
          />
        );
      })()}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Deal</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete this deal? The deal will be removed from the product.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
          </div>
        </div>
      )}
    </div>
  );
}