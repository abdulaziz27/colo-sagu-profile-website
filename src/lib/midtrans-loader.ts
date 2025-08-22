import { MIDTRANS_CONFIG } from "@/config/api";

declare global {
  interface Window {
    snap: any;
  }
}

/**
 * Dynamically loads Midtrans Snap script based on environment configuration
 */
export const loadMidtransScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.snap) {
      resolve();
      return;
    }

    // Determine script URL based on environment
    const isProduction = MIDTRANS_CONFIG.isProduction;
    const scriptUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    console.log(`[MIDTRANS] Loading script from: ${scriptUrl}`);
    console.log(
      `[MIDTRANS] Environment: ${isProduction ? "Production" : "Sandbox"}`
    );

    // Create script element
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.setAttribute("data-client-key", MIDTRANS_CONFIG.clientKey);
    script.async = true;

    // Handle script load events
    script.onload = () => {
      console.log("[MIDTRANS] Script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("[MIDTRANS] Failed to load script");
      reject(new Error("Failed to load Midtrans script"));
    };

    // Append script to document
    document.head.appendChild(script);
  });
};

/**
 * Checks if Midtrans script is loaded
 */
export const isMidtransLoaded = (): boolean => {
  return typeof window.snap !== "undefined";
};

/**
 * Gets the current Midtrans configuration for debugging
 */
export const getMidtransConfig = () => {
  return {
    clientKey: MIDTRANS_CONFIG.clientKey,
    isProduction: MIDTRANS_CONFIG.isProduction,
    scriptUrl: MIDTRANS_CONFIG.isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js",
  };
};
