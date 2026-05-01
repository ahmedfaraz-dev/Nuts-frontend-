import { useState, useEffect } from "react";
import { Loader2, AlertCircle, ShoppingBag, Eye, CheckCircle, Clock, Truck, Package, XCircle, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import Pagination from "./Pagination";
import { paymentApi } from "../../Api/paymentApi";
import { useCurrency } from "../../contexts/CurrencyContext";

const STATUS_FLOW = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [statusTab, setStatusTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await paymentApi.getAllOrders();
      // Ensure we handle both { orders: [] } and direct array responses
      const orderData = response.data?.orders || (Array.isArray(response.data) ? response.data : []);
      setOrders(orderData);
      setError(null);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      setError("Failed to load orders. Please check your connection.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 2 minutes for admin dashboard
    const interval = setInterval(() => fetchOrders(false), 120000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await paymentApi.updateOrderStatus(orderId, newStatus);
      if (res.status === 200 || res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'processing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#F59115]" />
        <p className="text-sm tracking-wide">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-lg border border-red-100 p-6">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-sm font-medium">{error}</p>
        <button onClick={fetchOrders} className="mt-4 text-sm text-[#F59115] hover:underline font-semibold">
          Try Again
        </button>
      </div>
    );
  }

  const filteredOrders = (orders || []).filter(order => {
    const status = (order?.orderStatus || "").toLowerCase();
    
    // Status tab filter
    const statusMatch = statusTab === "Active" 
      ? status !== "delivered" && status !== "cancelled"
      : statusTab === "Delivered" 
        ? status === "delivered"
        : statusTab === "Cancelled" 
          ? status === "cancelled"
          : true;
    
    // Search filter
    const searchMatch = !searchTerm || (
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerInfo?.name && order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      status.includes(searchTerm.toLowerCase())
    );
    
    return statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 font-display">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F59115] focus:ring-1 focus:ring-[#F59115]"
              />
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {searchTerm ? `${filteredOrders.length} found` : `${filteredOrders.length} shown / ${orders.length} total`}
            </p>
          </div>
          <button 
            onClick={() => fetchOrders(true)}
            className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#F59115] transition-colors uppercase tracking-widest"
          >
            <Clock className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "Active", label: "Active" },
            { key: "Delivered", label: "Delivered" },
            { key: "Cancelled", label: "Cancelled" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusTab(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                statusTab === tab.key
                  ? "bg-[#F59115]/10 border-[#F59115] text-[#F59115]"
                  : "bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:border-orange-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Order</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Customer Information</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Date</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Amount</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Status & Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order) => (
              <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-5 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="font-bold text-gray-900 hover:text-[#F59115] transition-colors flex flex-col items-start group"
                  >
                    <span className="text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                  </button>
                </td>
                <td className="px-5 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 font-bold leading-tight">{order.customerInfo?.name}</span>
                  </div>
                </td>
                <td className="px-5 py-5 text-sm text-gray-600 font-medium">
                  {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-5 text-sm text-gray-900 font-bold">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="px-5 py-5 relative dropdown-container">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === order._id ? null : order._id)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold border uppercase tracking-widest cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group ${getStatusStyle(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdownId === order._id ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdownId === order._id && (
                    <div className="absolute left-5 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-100 py-3 animate-in fade-in zoom-in duration-200">
                      <div className="px-5 py-2 border-b border-gray-50 mb-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Update Order Status</p>
                      </div>
                      <div className="space-y-1">
                        {STATUS_FLOW.map(status => (
                          <button
                            key={status}
                            onClick={() => {
                              handleUpdateStatus(order._id, status);
                              setOpenDropdownId(null);
                            }}
                            disabled={actionLoading}
                            className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-all flex items-center justify-between group ${order.orderStatus === status
                              ? 'text-[#F59115] bg-orange-50/50'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${order.orderStatus === status ? 'bg-[#F59115]' : 'bg-gray-200 group-hover:bg-gray-400'}`}></div>
                              {status}
                            </div>
                            {order.orderStatus === status && <CheckCircle size={14} className="text-[#F59115]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400 italic">
                  No orders found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredOrders.length}
        label="Total Orders"
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none">Order Details</h3>
                <p className="text-sm text-gray-400 mt-1 font-medium italic">ID: #{selectedOrder._id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
                <XCircle className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-10">
              {/* Products List */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 p-2">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-[15px] font-bold text-gray-800 leading-tight mb-1">{item.name || 'Dry Fruit Product'}</h5>
                        <p className="text-xs text-gray-400">Unit: {formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#F59115]">x{item.quantity}</p>
                        <p className="text-xs font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-2 gap-10 border-t border-gray-50 pt-8">
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Customer</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-gray-900">{selectedOrder.customerInfo?.name}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Shipping</h4>
                  <div className="text-sm text-gray-500 font-medium leading-relaxed">
                    <p>{selectedOrder.addressSnapshot?.address}</p>
                    <p>{selectedOrder.addressSnapshot?.city}, {selectedOrder.addressSnapshot?.country}</p>
                    <p>Zip: {selectedOrder.addressSnapshot?.zip}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Grand Total</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 leading-none">{formatPrice(selectedOrder.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
