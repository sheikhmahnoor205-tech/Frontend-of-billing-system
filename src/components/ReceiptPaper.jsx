import React from "react";
import { money } from "../lib/utils.js";
import BarcodeDisplay from "./BarcodeDisplay.jsx";

// The printable bill design
export default function ReceiptPaper({ sale, shop }) {
  if (!sale) return null;
  return (
    <div className="receipt receipt-print">
      <div className="receipt-center">
        <div className="receipt-shop-name">{shop.name}</div>
        <div>{shop.address}</div>
        <div>{shop.phone1} / {shop.phone2}</div>
      </div>

      <div className="receipt-row"><span>Slip #{sale.invoiceNo}</span><span>{sale.date}</span></div>
      <div className="receipt-row"><span>Customer:</span><span>{sale.customerName}</span></div>
      {sale.customerPhone && (
        <div className="receipt-row"><span>Phone:</span><span>{sale.customerPhone}</span></div>
      )}

      <div className="receipt-items">
        {sale.items.map((it) => (
          <div key={it.id} className="receipt-row">
            <span>{it.name} ({it.qty} {it.unit})</span>
            <span>{money(it.rate * it.qty)}</span>
          </div>
        ))}
      </div>

      <div className="receipt-row receipt-total"><span>Total</span><span>{money(sale.total)}</span></div>
      <div className="receipt-row" style={{ marginTop: 8 }}><span>Paid via</span><span>{sale.paymentMethod}</span></div>

      <div style={{ textAlign: "center", marginTop: 14 }}>
        <BarcodeDisplay value={sale.invoiceNo} />
      </div>
    </div>
  );
}