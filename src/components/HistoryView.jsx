import React, { useState } from "react";
import { Trash2, Edit3, Eye, Plus, Save, X } from "lucide-react";
import { uid, money, dateParts } from "../lib/utils.js";
import BarcodeDisplay from "./BarcodeDisplay.jsx";

// One sale being edited inline: lets you change customer info, payment
// method, and the item list (add/remove items), then recalculates the total.
function EditSaleForm({ sale, onSave, onCancel }) {
  const [customerName, setCustomerName] = useState(sale.customerName);
  const [customerPhone, setCustomerPhone] = useState(sale.customerPhone || "");
  const [paymentMethod, setPaymentMethod] = useState(sale.paymentMethod);
  const [items, setItems] = useState(sale.items);

  const [itemName, setItemName] = useState("");
  const [itemRate, setItemRate] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [itemUnit, setItemUnit] = useState("Gaz");

  const addItem = () => {
    if (!itemName.trim() || !itemRate || !itemQty) return;
    setItems((prev) => [
      ...prev,
      { id: uid(), name: itemName.trim(), rate: Number(itemRate), qty: Number(itemQty), unit: itemUnit },
    ]);
    setItemName(""); setItemRate(""); setItemQty("");
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const total = items.reduce((s, i) => s + i.rate * i.qty, 0);

  const save = () => {
    if (!customerName.trim() || items.length === 0) return;
    onSave({
      ...sale,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      paymentMethod,
      items,
      total,
    });
  };

  return (
    <div className="form-card">
      <div className="add-customer-form" style={{ marginBottom: 12 }}>
        <input className="form-input" placeholder="Customer name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <input className="form-input" placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        <select className="unit-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>Cash</option>
          <option>Card</option>
          <option>Bank Transfer</option>
        </select>
      </div>

      {items.map((i) => (
        <div key={i.id} className="cart-row">
          <div style={{ flex: 1 }}>
            <div className="cart-row-name">{i.name}</div>
            <div className="cart-row-price">{i.qty} {i.unit} × {money(i.rate)} = {money(i.qty * i.rate)}</div>
          </div>
          <button className="icon-btn" onClick={() => removeItem(i.id)}><Trash2 size={14} color="#AC2B22" /></button>
        </div>
      ))}

      <div className="item-entry-form" style={{ marginTop: 12, marginBottom: 12 }}>
        <input className="form-input" placeholder="Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <input className="form-input" type="number" placeholder="Rate" value={itemRate} onChange={(e) => setItemRate(e.target.value)} />
        <input className="form-input" type="number" step="0.1" placeholder="Qty" value={itemQty} onChange={(e) => setItemQty(e.target.value)} />
        <select className="unit-select" value={itemUnit} onChange={(e) => setItemUnit(e.target.value)}>
          <option>Gaz</option>
          <option>Meter</option>
          <option>Piece</option>
          <option>Set</option>
        </select>
        <button className="add-item-btn" onClick={addItem}><Plus size={15} /></button>
      </div>

      <div className="totals-row grand" style={{ marginBottom: 12 }}>
        <span>New Total</span><span>{money(total)}</span>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={save}><Save size={14} /> Save changes</button>
        <button className="btn-secondary" onClick={onCancel}><X size={14} /> Cancel</button>
      </div>
    </div>
  );
}

export default function HistoryView({ sales, setSales, onView }) {
  const [year, setYear] = useState("All");
  const [month, setMonth] = useState("All");
  const [day, setDay] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const withParts = sales.map((s) => ({ ...s, ...dateParts(s.dateISO || s.date) }));

  const years = ["All", ...new Set(withParts.map((s) => s.year))].sort();
  const months = ["All", ...new Set(
    withParts.filter((s) => year === "All" || s.year === year).map((s) => s.month)
  )].sort((a, b) => (a === "All" ? -1 : a - b));
  const days = ["All", ...new Set(
    withParts
      .filter((s) => (year === "All" || s.year === year) && (month === "All" || s.month === month))
      .map((s) => s.day)
  )].sort((a, b) => (a === "All" ? -1 : a - b));

  const filtered = withParts
    .filter((s) => year === "All" || s.year === year)
    .filter((s) => month === "All" || s.month === month)
    .filter((s) => day === "All" || s.day === day);

  const monthName = (m) => new Date(2000, m - 1, 1).toLocaleString("en-PK", { month: "short" });

  const handleDelete = (id) => {
    if (window.confirm("Delete this bill? This cannot be undone.")) {
      setSales((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveEdit = (updated) => {
    setSales((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingId(null);
  };

  return (
    <div>
      <div className="view-title" style={{ marginBottom: 12 }}>Sales History</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <select className="form-input" value={year} onChange={(e) => { setYear(e.target.value === "All" ? "All" : Number(e.target.value)); setMonth("All"); setDay("All"); }}>
          {years.map((y) => <option key={y} value={y}>{y === "All" ? "Year: All" : y}</option>)}
        </select>
        <select className="form-input" value={month} onChange={(e) => { setMonth(e.target.value === "All" ? "All" : Number(e.target.value)); setDay("All"); }}>
          {months.map((m) => <option key={m} value={m}>{m === "All" ? "Month: All" : monthName(m)}</option>)}
        </select>
        <select className="form-input" value={day} onChange={(e) => setDay(e.target.value === "All" ? "All" : Number(e.target.value))}>
          {days.map((d) => <option key={d} value={d}>{d === "All" ? "Day: All" : d}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="content-placeholder">No bills match this filter.</div>
      ) : (
        [...filtered].reverse().map((s) =>
          editingId === s.id ? (
            <EditSaleForm key={s.id} sale={s} onSave={handleSaveEdit} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={s.id} className="history-row">
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ transform: "scale(0.7)", transformOrigin: "left center" }}>
                  <BarcodeDisplay value={s.invoiceNo} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="customer-name">Slip #{s.invoiceNo} — {s.customerName}</div>
                  <div className="customer-sub">{s.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontWeight: 600, color: "#A8441C", marginRight: 6 }}>{money(s.total)}</span>
                <button className="icon-btn" onClick={() => onView(s)} title="View / Print"><Eye size={15} color="#565F6E" /></button>
                <button className="icon-btn" onClick={() => setEditingId(s.id)} title="Edit"><Edit3 size={15} color="#565F6E" /></button>
                <button className="icon-btn" onClick={() => handleDelete(s.id)} title="Delete"><Trash2 size={15} color="#AC2B22" /></button>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}