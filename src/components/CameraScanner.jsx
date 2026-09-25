import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Camera } from "lucide-react";

// Opens the device camera and continuously scans for a barcode.
// Calls onScan(text) the moment a barcode is successfully read, then stops.
export default function CameraScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false); // tracks whether the camera has actually started
  const stoppedRef = useRef(false);   // guards against calling onScan/stop more than once
  const [error, setError] = useState("");
  const elementId = "camera-scanner-view";

  useEffect(() => {
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    const safeStop = () => {
      if (isRunningRef.current) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {}); // ignore — camera may already be stopped
        isRunningRef.current = false;
      }
    };

              scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 400, height: 180 },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        },
      
        (decodedText) => {
          if (stoppedRef.current) return;
          stoppedRef.current = true;
          safeStop();
          onScan(decodedText);
        },
        () => {
          // called continuously while no barcode is found — ignore, this is normal
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        setError("Could not access camera. Please allow camera permission and try again.");
        console.error(err);
      });

    // Cleanup: only stop if the camera actually finished starting
    return () => {
      stoppedRef.current = true;
      safeStop();
    };
  }, [onScan]);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <Camera size={16} color="#A8441C" /> Scan Bill Barcode
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          {error ? (
            <div style={{ color: "#AC2B22", fontSize: 14 }}>{error}</div>
          ) : (
            <div id={elementId}></div>
          )}
          <div className="customer-sub" style={{ marginTop: 10, textAlign: "center" }}>
            Point the camera at the barcode on the bill.
          </div>
        </div>
      </div>
    </div>
  );
}