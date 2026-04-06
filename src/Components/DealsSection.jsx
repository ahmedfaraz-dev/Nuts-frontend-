import { useEffect, useState } from "react";
import { userApi } from "../Api/userApi";
import Product from "./Ui/Product";

// Live countdown to a given endDate
const useCountdown = (endDate) => {
  const calcTimeLeft = () => {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    if (!endDate) return;
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return timeLeft;
};

const CountBox = ({ value, label }) => (
  <div className="bg-white text-[#7a0026] rounded-md p-2 text-center font-semibold">
    <span className="text-xl block">{String(value).padStart(2, "0")}</span>
    <span className="text-xs">{label}</span>
  </div>
);

const DealsSection = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userApi.getAllProducts();
        if (res.success) {
          // Only keep products that have an active deal
          const withDeals = (res.data || [])
            .filter((p) => p.activeDeal && p.activeDeal.discount > 0)
            .map((p) => ({
              id: p._id,
              title: p.name,
              desc: p.discription || p.description,
              price: p.price,
              image: p.images?.[0] || "/images/placeholder.png",
              activeDeal: p.activeDeal,
              stock: p.stock,
            }));
          setDealProducts(withDeals);
        }
      } catch (e) {
        console.error("DealsSection fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Use the earliest ending deal for the countdown
  const nearestEndDate = dealProducts.reduce((earliest, p) => {
    const d = p.activeDeal?.endDate;
    if (!d) return earliest;
    return !earliest || new Date(d) < new Date(earliest) ? d : earliest;
  }, null);

  const maxDiscount = dealProducts.reduce(
    (max, p) => Math.max(max, p.activeDeal?.discount || 0),
    0
  );

  const timeLeft = useCountdown(nearestEndDate);

  return (
    <section className="w-full bg-white">
      <div className="w-full px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Our Best Deals</h2>

          <div className="flex items-stretch gap-6">
            {/* Hot Deal Panel */}
            <div className="w-64 shrink-0 flex flex-col justify-center items-center gap-6 bg-[#7a0026] text-white rounded-2xl p-6 min-h-[420px]">
              <h3 className="text-2xl font-bold text-center">Hot Deal</h3>
              <p className="text-center opacity-90">
                Sale Upto {maxDiscount > 0 ? `${maxDiscount}%` : "—"} Off
              </p>

              <p className="text-sm opacity-75 -mb-2">Offer Ends In</p>

              <div className="grid grid-cols-4 gap-2 w-full">
                <CountBox value={timeLeft.days} label="Days" />
                <CountBox value={timeLeft.hours} label="Hrs" />
                <CountBox value={timeLeft.mins} label="Mins" />
                <CountBox value={timeLeft.secs} label="Sec" />
              </div>
            </div>

            {/* Scrollable Product Cards */}
            <div className="flex-1 overflow-x-auto no-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[420px]">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59115]" />
                </div>
              ) : dealProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[420px] text-gray-400 text-sm">
                  No active deals at the moment.
                </div>
              ) : (
                <div className="flex gap-5 pb-2" style={{ width: "max-content" }}>
                  {dealProducts.map((item) => (
                    <div key={item.id} className="w-56 shrink-0">
                      <Product item={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
