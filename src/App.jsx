import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  ClipboardList,
  Store,
  DollarSign,
  TrendingUp,
  ScanLine,
} from "lucide-react";
import "./index.css";

import { money } from "./lib/utils.js";
import {
  getCustomers,
  getSales,
  getShop,
  getStats,
  createSale,
} from "./lib/api.js";

import StatCard from "./components/StatCard.jsx";
import NavButton from "./components/NavButton.jsx";
import POSView from "./components/POSView.jsx";
import CustomersView from "./components/CustomersView.jsx";
import HistoryView from "./components/HistoryView.jsx";
import ReceiptModal from "./components/ReceiptModal.jsx";
import VerifyView from "./components/VerifyView.jsx";

export default function App() {
  const [tab, setTab] = useState("pos");
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, salesRes, shopRes, statsRes] = await Promise.all([
        getCustomers(),
        getSales(),
        getShop(),
        getStats(),
      ]);

      setCustomers(customersRes.data || []);
      setSales(salesRes.data || []);
      setShop(shopRes.data || null);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleCheckout = async (draft) => {
    try {
      const response = await createSale(draft);

      if (!response.success) {
        alert(response.message || "Failed to create sale");
        return;
      }

      const sale = response.data;

      setSales((prev) => [...prev, sale]);
      setActiveReceipt(sale);

      const customersRes = await getCustomers();
      setCustomers(customersRes.data || []);

      const statsRes = await getStats();
      setStats(statsRes.data || null);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to create bill");
    }
  };

  const revenueToday = stats?.kpis?.revenueToday || 0;
  const billsToday = stats?.kpis?.billsToday || 0;

  const shopData = shop || {
    name: "Fabrics",
    address: "",
  };

  const NAV = [
    { id: "pos", label: "New Bill", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "history", label: "Sales History", icon: ClipboardList },
    { id: "verify", label: "Verify Bill", icon: ScanLine },
  ];

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo-box">
          <Store size={18} color="#FAF6ED" />
        </div>

        <div>
          <div className="shop-name">{shopData.name}</div>
          <div className="shop-sub">{shopData.address}</div>
        </div>
      </div>

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        <StatCard
          icon={DollarSign}
          label="Revenue today"
          value={money(revenueToday)}
          accent="#A8441C"
        />

        <StatCard
          icon={TrendingUp}
          label="Bills today"
          value={billsToday}
          accent="#B8892B"
        />
      </div>

      <div className="main-grid">
        <div className="sidebar">
          {NAV.map((n) => (
            <NavButton
              key={n.id}
              icon={n.icon}
              label={n.label}
              active={tab === n.id}
              onClick={() => setTab(n.id)}
            />
          ))}
        </div>

        <div>
          {tab === "pos" && <POSView onCheckout={handleCheckout} />}

          {tab === "customers" && (
            <CustomersView customers={customers} sales={sales} />
          )}

          {tab === "history" && (
            <HistoryView
              sales={sales}
              setSales={setSales}
              onView={setActiveReceipt}
            />
          )}

          {tab === "verify" && <VerifyView />}
        </div>
      </div>

      <ReceiptModal
        sale={activeReceipt}
        shop={shopData}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}