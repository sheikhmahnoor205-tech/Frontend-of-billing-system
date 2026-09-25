import React, { useState, useEffect } from "react";
import { ShoppingCart, Users, ClipboardList, Store, DollarSign, TrendingUp, ScanLine } from "lucide-react";
import "./index.css";

import { uid, todayLabel, todayCode, money } from "./lib/utils.js";
import { loadKey, saveKey } from "./lib/storage.js";
import { SHOP, SEED_CUSTOMERS } from "./lib/shopData.js";

import StatCard from "./components/StatCard.jsx";
import NavButton from "./components/NavButton.jsx";
import POSView from "./components/POSView.jsx";
import CustomersView from "./components/CustomersView.jsx";
import HistoryView from "./components/HistoryView.jsx";
import ReceiptModal from "./components/ReceiptModal.jsx";
import VerifyView from "./components/VerifyView.jsx";

export default function App() {
  const [tab, setTab] = useState("pos");

  // Load saved data on first render; fall back to seed data if nothing saved yet
  const [customers, setCustomers] = useState(() => loadKey("customers", SEED_CUSTOMERS));
  const [sales, setSales] = useState(() => loadKey("sales", []));
  const [dailyCounter, setDailyCounter] = useState(() => loadKey("dailyCounter", {})); // { "20260825": 3 }
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Save to localStorage every time these change
  useEffect(() => saveKey("customers", customers), [customers]);
  useEffect(() => saveKey("sales", sales), [sales]);
  useEffect(() => saveKey("dailyCounter", dailyCounter), [dailyCounter]);

  const todaysSales = sales.filter((s) => s.date.split(",")[0] === todayLabel().split(",")[0]);
  const revenueToday = todaysSales.reduce((s, x) => s + x.total, 0);

  const handleCheckout = (draft) => {
    const { customerName, customerPhone, ...rest } = draft;

    let customer = customerPhone
      ? customers.find((c) => c.phone === customerPhone)
      : customers.find((c) => c.name === "Walk-in Customer" && customerName === "Walk-in Customer");

    if (!customer) {
      customer = { id: uid(), name: customerName, phone: customerPhone };
      setCustomers((prev) => [...prev, customer]);
    }

    // Build a unique, date-based slip number: "20260825-0001"
    // The counter for today's date increases by 1 each time — never resets on refresh,
    // and a different day automatically gets a different prefix, so no clashes ever.
    const code = todayCode();
    const countSoFar = (dailyCounter[code] || 0) + 1;
    setDailyCounter((prev) => ({ ...prev, [code]: countSoFar }));
    const invoiceNo = `${code}-${String(countSoFar).padStart(4, "0")}`;

    const sale = {
      id: uid(), invoiceNo, date: todayLabel(), dateISO: new Date().toISOString(),
      customerId: customer.id, customerName: customer.name, customerPhone: customer.phone,
      ...rest,
    };
    setSales((prev) => [...prev, sale]);
    setActiveReceipt(sale);
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
        <div className="logo-box"><Store size={18} color="#FAF6ED" /></div>
        <div>
          <div className="shop-name">{SHOP.name}</div>
          <div className="shop-sub">{SHOP.address}</div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <StatCard icon={DollarSign} label="Revenue today" value={money(revenueToday)} accent="#A8441C" />
        <StatCard icon={TrendingUp} label="Bills today" value={todaysSales.length} accent="#B8892B" />
      </div>

      <div className="main-grid">
        <div className="sidebar">
          {NAV.map((n) => (
            <NavButton key={n.id} icon={n.icon} label={n.label} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
        </div>

        <div>
          {tab === "pos" && <POSView onCheckout={handleCheckout} />}
          {tab === "customers" && <CustomersView customers={customers} sales={sales} />}
          {tab === "history" && (
            <HistoryView sales={sales} setSales={setSales} onView={setActiveReceipt} />
          )}
          {tab === "verify" && <VerifyView sales={sales} />}
        </div>
      </div>

      <ReceiptModal sale={activeReceipt} shop={SHOP} onClose={() => setActiveReceipt(null)} />
    </div>
  );
}