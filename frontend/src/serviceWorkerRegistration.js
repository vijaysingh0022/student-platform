/**
 * Service Worker Registration for LearnX
 */

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // SW registered successfully
        })
        .catch((error) => {
          // SW registration failed (e.g. in some dev environments)
        });
    });
  }
}
