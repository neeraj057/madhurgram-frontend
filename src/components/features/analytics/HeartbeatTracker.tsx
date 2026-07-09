"use client";
import { useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";

export default function HeartbeatTracker() {
  useEffect(() => {
    // Generate or fetch a persistent random client UUID
    let clientId = localStorage.getItem("madhurgram_client_id");
    if (!clientId) {
      clientId = "client_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("madhurgram_client_id", clientId);
    }

    const sendHeartbeat = async () => {
      try {
        const url = `${API_ENDPOINTS.publicHeartbeat}?clientId=${clientId}`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        // Silent catch to prevent errors in logs if server is down during rendering
      }
    };

    // Send immediate heartbeat on mount
    sendHeartbeat();

    // Send pings every 20 seconds
    const interval = setInterval(sendHeartbeat, 20000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
