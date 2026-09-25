import React, { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { money } from "../lib/utils.js";
import { updateSale, deleteSale } from "../lib/api.js";
import BarcodeDisplay from "./BarcodeDisplay.jsx";

function EditSaleForm({ sale, onSave, onCancel }) {
  const [customerName, setCustomerName] = useState(sale.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(sale.customerPhone || "");
  const [paymentMethod, setPaymentMethod] = useState(
    sale.paymentMethod || "Cash"
  );
  const [items, setItems] = useState(
    (sale.items || []).map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
    }))
  );

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = {
          ...item,
          [field]:
            field === "qty" || field === "rate" ? Number(value) : value,
        };

        updated.total = Number(updated.qty || 0) * Number(updated.rate || 0);

        return updated;
      })
    );
  };

  const handleSave = () => {
    onSave({
      ...sale,
      customerName,
      customerPhone,
      paymentMethod,
      items,
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Edit Sale</div>
          <div className="card-subtitle">{sale.invoiceNo}</div>
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label>Customer Name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div>
          <label>Customer Phone</label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div>
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    value={item.name || ""}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.rate || 0}
                    onChange={(e) =>
                      updateItem(item.id, "rate", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.qty || 0}
                    onChange={(e) =>
                      updateItem(item.id, "qty", e.target.value)
                    }
                  />
                </td>

                <td>{money(item.total || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-actions">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default function HistoryView({ sales, setSales, onView }) {
  const [editingSale, setEditingSale] = useState(null);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const filteredSales = sales.filter((sale) => {
    if (!sale.dateISO) return true;

    const date = new Date(sale.dateISO);

    if (year && date.getFullYear().toString() !== year) return false;

    if (month && (date.getMonth() + 1).toString() !== month) return false;

    if (day && date.getDate().toString() !== day) return false;

    return true;
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteSale(id);

      if (!response.success) {
        alert(response.message || "Failed to delete sale");
        return;
      }

      setSales((prev) => prev.filter((sale) => sale._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete sale");
    }
  };

  const handleUpdate = async (updatedSale) => {
    try {
      const response = await updateSale(updatedSale._id, {
        customerName: updatedSale.customerName,
        customerPhone: updatedSale.customerPhone,
        paymentMethod: updatedSale.paymentMethod,
        items: updatedSale.items,
        discount: updatedSale.discount || 0,
        tax: updatedSale.tax || 0,
        notes: updatedSale.notes || "",
      });

      if (!response.success) {
        alert(response.message || "Failed to update sale");
        return;
      }

      setSales((prev) =>
        prev.map((sale) =>
          sale._id === updatedSale._id ? response.data : sale
        )
      );

      setEditingSale(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update sale");
    }
  };

  if (editingSale) {
    return (
      <EditSaleForm
        sale={editingSale}
        onSave={handleUpdate}
        onCancel={() => setEditingSale(null)}
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Sales History</div>
          <div className="card-subtitle">
            View, edit and delete sales
          </div>
        </div>

        <div className="filters">
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            {[...new Set(
              sales
                .filter((sale) => sale.dateISO)
                .map((sale) => new Date(sale.dateISO).getFullYear())
            )].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>

          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">All Days</option>
            {Array.from({ length: 31 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSales.length === 0 ? (
        <div className="empty-state">No sales found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.invoiceNo}</td>

                  <td>
                    <div>{sale.customerName || "Walk-in Customer"}</div>
                    <div>{sale.customerPhone || ""}</div>
                  </td>

                  <td>
                    {sale.dateISO
                      ? new Date(sale.dateISO).toLocaleDateString()
                      : sale.date || ""}
                  </td>

                  <td>{sale.paymentMethod}</td>

                  <td>{money(sale.total || 0)}</td>

                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onView(sale)} title="View">
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => setEditingSale(sale)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(sale._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}