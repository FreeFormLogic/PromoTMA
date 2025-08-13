import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handler for browser extensions
window.addEventListener('error', (event) => {
  // Ignore browser extension errors
  if (event.error?.stack?.includes('extension') || 
      event.error?.stack?.includes('chrome-extension') ||
      event.error?.stack?.includes('moz-extension') ||
      event.error?.stack?.includes('binance') ||
      event.error?.stack?.includes('egjidjbpglichdcondbcbdnbeeppgdph')) {
    console.log('Browser extension error ignored:', event.error);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  // Ignore browser extension promise rejections
  if (event.reason?.stack?.includes('extension') || 
      event.reason?.stack?.includes('chrome-extension') ||
      event.reason?.stack?.includes('moz-extension') ||
      event.reason?.stack?.includes('binance') ||
      event.reason?.stack?.includes('egjidjbpglichdcondbcbdnbeeppgdph')) {
    console.log('Browser extension promise rejection ignored:', event.reason);
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
