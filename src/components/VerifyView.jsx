import React, { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { verifySale } from "../lib/api.js";
import { money } from "../lib/utils.js";

export default function VerifyView() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      setResult(null);

      const response = await verifySale(code.trim());

      if (response.valid) {
        setResult(response.data);
      } else {
        setResult(false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Verify Bill</div>
          <div className="card-subtitle">
            Enter an invoice number to verify the bill
          </div>
        </div>
      </div>

      <div className="verify-search">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleVerify();
            }
          }}
          placeholder="Enter invoice number"
        />

        <button onClick={handleVerify} disabled={loading}>
          <Search size={18} />
          {loading ? "Checking..." : "Verify"}
        </button>
      </div>

      {result === false && (
        <div className="verify-result invalid">
          <XCircle size={40} />
          <div>
            <div className="verify-title">Bill Not Found</div>
            <div className="verify-text">
              No bill was found for this invoice number.
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="verify-result valid">
          <div className="verify-status">
            <CheckCircle size={40} />

            <div>
              <div className="verify-title">Valid Bill</div>
              <div className="verify-text">
                Invoice: {result.invoiceNo}
              </div>
            </div>
          </div>

          <div className="verify-details">
            <div>
              <span>Customer</span>
              <strong>{result.customerName || "Walk-in Customer"}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{result.customerPhone || "-"}</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>{result.paymentMethod || "-"}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{money(result.total || 0)}</strong>
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
                {(result.items || []).map((item, index) => (
                  <tr key={item._id || item.id || index}>
                    <td>{item.name}</td>
                    <td>{money(item.rate || 0)}</td>
                    <td>
                      {item.qty} {item.unit || ""}
                    </td>
                    <td>{money(item.total || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}