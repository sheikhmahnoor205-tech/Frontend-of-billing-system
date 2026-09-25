import React, { useState } from "react";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";
import { uid, money } from "../lib/utils.js";

// Billing screen — every item is typed manually, no fixed catalog.
// Customer name/phone are also typed directly here.
export default function POSView({ onCheckout }) {
  const [cart, setCart] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemRate, setItemRate] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [itemUnit, setItemUnit] = useState("Gaz");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const addItem = () => {
    if (!itemName.trim() || !itemRate || !itemQty) return;
    setCart((c) => [
      ...c,
      { id: uid(), name: itemName.trim(), rate: Number(itemRate), qty: Number(itemQty), unit: itemUnit },
    ]);
    setItemName("");
    setItemRate("");
    setItemQty("");
  };

  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + i.rate * i.qty, 0);

    const handleCheckout = () => {
    if (cart.length === 0 || !customerName.trim()) return;
    onCheckout({
      items: cart,
      total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      paymentMethod,
    });
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
  };
  

  return (
    <div className="pos-single">
      {/* Manual item entry */}
      <div className="item-entry-form">
        <input
          className="form-input" placeholder="Item name (e.g. Ladies Suiting)"
          value={itemName} onChange={(e) => setItemName(e.target.value)}
        />
        <input
          className="form-input" type="number" placeholder="Rate"
          value={itemRate} onChange={(e) => setItemRate(e.target.value)}
        />
        <input
          className="form-input" type="number" step="0.1" placeholder="Qty"
          value={itemQty} onChange={(e) => setItemQty(e.target.value)}
        />
        <select className="unit-select" value={itemUnit} onChange={(e) => setItemUnit(e.target.value)}>
          <option>Gaz</option>
          <option>Meter</option>
          <option>Piece</option>
          <option>Set</option>
        </select>
        <button className="add-item-btn" onClick={addItem}><Plus size={15} /></button>
      </div>

      {/* Cart */}
      <div className="cart-panel">
        <div className="cart-header"><ShoppingCart size={16} color="#A8441C" /> Current Sale</div>

        <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
                    <input
            className="form-input" style={{ flex: 1 }} placeholder="Customer name *"
            value={customerName} onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            className="form-input" style={{ flex: 1 }} placeholder="Phone (optional)"
            value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#565F6E", fontSize: 14 }}>
              Add an item above to start the bill.
            </div>
          ) : (
            cart.map((i) => (
              <div key={i.id} className="cart-row">
                <div style={{ flex: 1 }}>
                  <div className="cart-row-name">{i.name}</div>
                  <div className="cart-row-price">{i.qty} {i.unit} × {money(i.rate)} = {money(i.qty * i.rate)}</div>
                </div>
                <button className="icon-btn" onClick={() => removeItem(i.id)}><Trash2 size={14} color="#AC2B22" /></button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: "#565F6E" }}>Payment method</label>
            <select className="form-input" style={{ width: "100%", marginTop: 4 }} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Cash</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>
          </div>
                   <div className="totals-row grand"><span>Total</span><span>{money(total)}</span></div>
          {!customerName.trim() && cart.length > 0 && (
            <div style={{ fontSize: 12, color: "#AC2B22", marginBottom: 8 }}>
              Customer name is required to generate a bill.
            </div>
          )}
          <button
            className="checkout-btn"
            disabled={cart.length === 0 || !customerName.trim()}
            onClick={handleCheckout}
          >
            Checkout & Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}