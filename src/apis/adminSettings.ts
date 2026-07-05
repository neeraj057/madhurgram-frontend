import { API_ENDPOINTS } from "@/apis/api";
import { handleAuthError } from "@/utils/adminAuth";

// Fetch current Auto-Pilot recovery engine status from backend settings
export const fetchAutoRecoveryStatus = async (token: string): Promise<boolean> => {
  const response = await fetch(API_ENDPOINTS.adminGetAutoRecovery, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (await handleAuthError(response)) {
      return false;
    }
    throw new Error("Failed to fetch auto-recovery status.");
  }
  const data = await response.json();
  return !!data.enabled;
};

// Update Auto-Pilot recovery status (turn ON or OFF)
export const updateAutoRecoveryStatus = async (token: string, enabled: boolean): Promise<boolean> => {
  const response = await fetch(API_ENDPOINTS.adminSetAutoRecovery(enabled), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (await handleAuthError(response)) {
      return false;
    }
    throw new Error("Failed to update auto-recovery status.");
  }
  const data = await response.json();
  return !!data.enabled;
};
