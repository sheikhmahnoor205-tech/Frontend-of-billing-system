// Simple localStorage helpers. Every key is prefixed so this app
// doesn't clash with anything else stored in the same browser.
const PREFIX = "pakiza_billing_";

export function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("Failed to load", key, e);
    return fallback;
  }
}

export function saveKey(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save", key, e);
  }
}