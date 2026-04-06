import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Tag, Zap, ArrowRight, Loader2 } from "lucide-react";
import { adminApi } from "../../Api/adminApi";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Total Products", value: 0, icon: Package, to: "/admin-dashboard/products", color: "text-[#F59115]", bg: "bg-orange-50" },
    { label: "Categories", value: 0, icon: Tag, to: "/admin-dashboard/categories", color: "text-[#F59115]", bg: "bg-orange-50" },
    { label: "Active Deals", value: 0, icon: Zap, to: "/admin-dashboard/deals", color: "text-[#F59115]", bg: "bg-orange-50" },
  ]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prodRes, catRes] = await Promise.all([
          adminApi.getAllProducts(),
          adminApi.getCategories().catch(() => ({ success: true, data: [] }))
        ]);

        if (prodRes.success) {
          const prods = prodRes.data?.products || [];
          setRecentProducts(prods.slice(0, 5));

          setStats(prev => prev.map(s => {
            if (s.label === "Total Products") return { ...s, value: prods.length };
            if (s.label === "Active Deals") return { ...s, value: prods.filter(p => p.activeDeal).length };
            return s;
          }));
        }

        if (catRes.success) {
          setStats(prev => prev.map(s => {
            if (s.label === "Categories") return { ...s, value: catRes.data?.length || 0 };
            return s;
          }));
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F59115]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.to}
              className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4 hover:border-[#F59115]/40 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin-dashboard/products"
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#F59115]/40 transition-colors flex items-center justify-between"
        >
          Manage Products <ArrowRight size={16} className="text-gray-400" />
        </Link>
        <Link
          to="/admin-dashboard/categories"
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#F59115]/40 transition-colors flex items-center justify-between"
        >
          Manage Categories <ArrowRight size={16} className="text-gray-400" />
        </Link>
        <Link
          to="/admin-dashboard/deals"
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#F59115]/40 transition-colors flex items-center justify-between"
        >
          Manage Deals <ArrowRight size={16} className="text-gray-400" />
        </Link>
      </div>

      {/* Recent products */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Products</h3>
          <Link
            to="/admin-dashboard/products"
            className="text-xs font-medium text-[#F59115] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-900 font-medium">{product.name}</td>
                  <td className="px-5 py-3 text-gray-600">Rs. {product.price}</td>
                  <td className="px-5 py-3 text-gray-600">{product.stock}</td>
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
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}