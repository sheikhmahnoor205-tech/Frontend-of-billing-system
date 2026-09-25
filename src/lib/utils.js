// Generates a random id for new records
export const uid = () => Math.random().toString(36).slice(2, 10);

// Formats a number as "Rs. 1,234"
export const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

// Human-readable date/time, e.g. "24 Aug, 2026, 3:45 PM"
export const todayLabel = () =>
  new Date().toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// "20260825" — used as a prefix for unique, date-based slip numbers
export const todayCode = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
};

// Pulls { year, month, day } out of an ISO date string —
// used by Sales History to filter bills by date
export const dateParts = (iso) => {
  const d = new Date(iso);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
};