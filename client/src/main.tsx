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

// Override console.error to hide runtime error overlay for extension errors
const originalConsoleError = console.error;
console.error = (...args) => {
  const errorString = args.join(' ');
  if (errorString.includes('chrome-extension') ||
      errorString.includes('extension') ||
      errorString.includes('binance') ||
      errorString.includes('egjidjbpglichdcondbcbdnbeeppgdph')) {
    return; // Don't log extension errors
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
