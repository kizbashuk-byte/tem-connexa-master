"use client";

import { useEffect } from "react";

export function BrowserDebugLogger() {
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const sendLog = async (type: string, data: any) => {
      try {
        await fetch("/api/debug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, data }),
          keepalive: true
        });
      } catch (e) {
        // Ignore
      }
    };

    // 1. Gather Service Worker evidence
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(async (registrations) => {
        const swData = registrations.map(reg => ({
          scope: reg.scope,
          scriptURL: reg.active ? reg.active.scriptURL : (reg.installing?.scriptURL || reg.waiting?.scriptURL),
          state: reg.active ? reg.active.state : 'inactive',
          controlling: navigator.serviceWorker.controller?.scriptURL === (reg.active?.scriptURL)
        }));

        await sendLog("SERVICE_WORKER_EVIDENCE", swData);

        // 2. Unregister them
        if (registrations.length > 0) {
          for (let reg of registrations) {
            await reg.unregister();
          }
          await sendLog("SERVICE_WORKER_ACTION", "Unregistered all service workers.");
          
          // 3. Reload the page automatically to prove the fix
          window.location.reload();
        } else {
          await sendLog("SERVICE_WORKER_ACTION", "No service workers found.");
        }
      });
    } else {
      sendLog("SERVICE_WORKER_EVIDENCE", "Service workers not supported");
    }

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
}

