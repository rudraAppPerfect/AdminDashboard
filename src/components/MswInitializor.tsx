"use client";

import { useEffect } from "react";

export default function MswInitializer() {
  useEffect(() => {
    async function enableMSW() {
      if (process.env.NODE_ENV === "development") {
        const { worker } = await import("@/mocks/browser.mjs");
        worker.start();
      }
    }
    enableMSW();
  }, []);
  return null;
}
