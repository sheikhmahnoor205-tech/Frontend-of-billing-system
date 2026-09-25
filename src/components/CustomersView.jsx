import React, { useState } from "react";
import { User, ChevronLeft } from "lucide-react";
import { money } from "../lib/utils.js";

// Customers screen: list view + detail view.
// Customers are added automatically from POSView, no manual add here.
export default function CustomersView({ customers, sales }) {
  const [selected, setSelected] = useState(null);

  const historyFor = (id) => sales.filter((s) => s.customerId === id);

  if (selected) {
    const c = customers.find((x) => x.id === selected);
    const hist = historyFor(selected);
    const totalSpent = hist.reduce((sum, s) => sum + s.total, 0);

    return (
      <div>
        <button className="back-link" onClick={() => setSelected(null)}>
          <ChevronLeft size={16} /> Back to customers
        </button>

        <div className="customer-detail-card">
          <div className="customer-name" style={{ fontSize: 16 }}>{c.name}</div>
          <div className="customer-sub">{c.phone || "No phone on file"}</div>
          <div className="customer-sub" style={{ marginTop: 6, color: "#B8892B", fontWeight: 600 }}>
            Total spent: {money(totalSpent)} across {hist.length} visit(s)
          </div>
        </div>

        <div className="view-title" style={{ fontSize: 14, marginBottom: 8 }}>Purchase history</div>
        {hist.length === 0 ? (
          <div className="content-placeholder">No purchases yet.</div>
        ) : (
          hist.map((s) => (
            <div key={s.id} className="history-row">
              <div>
                <div className="customer-name">Slip #{s.invoiceNo}</div>
                <div className="customer-sub">{s.date}</div>
              </div>
              <div style={{ fontWeight: 600, color: "#A8441C" }}>{money(s.total)}</div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="view-header">
        <div className="view-title">Customers</div>
        <div className="view-subtitle">Added automatically when you bill someone</div>
      </div>
      <div className="customer-grid">
        {customers.map((c) => {
          const hist = historyFor(c.id);
          return (
            <button key={c.id} className="customer-card" onClick={() => setSelected(c.id)}>
              <div className="customer-avatar"><User size={16} color="#B8892B" /></div>
              <div>
                <div className="customer-name">{c.name}</div>
                <div className="customer-sub">{hist.length} purchase(s)</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}