import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

// Renders a scannable barcode for the given value (e.g. the slip number)
export default function BarcodeDisplay({ value }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        width: 3,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000",
      });
    }
  }, [value]);

  return (
    <div style={{ background: "#fff", padding: "10px", display: "inline-block" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}