import React from "react";
import { X, Receipt as ReceiptIcon, Printer } from "lucide-react";
import ReceiptPaper from "./ReceiptPaper.jsx";

// Popup that shows the receipt with a Print button
export default function ReceiptModal({ sale, shop, onClose }) {
  if (!sale) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <ReceiptIcon size={16} color="#A8441C" /> Digital Bill
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <ReceiptPaper sale={sale} shop={shop} />
        </div>

        <div className="modal-footer">
          <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => window.print()}>
            <Printer size={16} /> Print / Save as PDF
          </button>
          <button className="btn-secondary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}