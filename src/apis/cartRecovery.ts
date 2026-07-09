import { API_ENDPOINTS } from "@/apis/api";
import { handleAuthError } from "@/utils/adminAuth";

export interface SyncCartPayload {
  phoneNumber: string;
  customerName?: string;
  cartItemsJson: string;
  totalAmount: number;
}

export interface AbandonedCartInfo {
  id: number;
  phoneNumber: string;
  customerName: string | null;
  cartItemsJson: string;
  totalAmount: number;
  lastUpdated: string;
  recovered: boolean;
  reminderSent: boolean;
  reminderSentAt: string | null;
}

// 🔄 Update/Sync current cart session to backend database
export const syncCart = async (payload: SyncCartPayload): Promise<any> => {
  const response = await fetch(API_ENDPOINTS.updateCart, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to sync cart state to backend.");
  }
  return response.json();
};

// 📥 Fetch a previously abandoned cart for recovery
export const fetchRecoveredCart = async (phone: string): Promise<any> => {
  const response = await fetch(API_ENDPOINTS.recoverCart(phone), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No abandoned cart found for recovery.");
  }
  return response.json();
};

// 📊 Fetch list of all abandoned carts for admin panel (Authenticated request)
export const fetchAdminAbandonedCarts = async (token: string, minutesAgo = 30): Promise<AbandonedCartInfo[]> => {
  const url = `${API_ENDPOINTS.adminAbandonedCarts}?minutesAgo=${minutesAgo}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (await handleAuthError(response)) {
      return [];
    }
    throw new Error("Failed to fetch abandoned carts list.");
  }
  return response.json();
};

// 🗑️ Delete an abandoned cart session (Authenticated request)
export const deleteAdminAbandonedCart = async (token: string, cartId: number): Promise<boolean> => {
  const url = `${API_ENDPOINTS.adminAbandonedCarts}/${cartId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (await handleAuthError(response)) {
      return false;
    }
    throw new Error("Failed to delete abandoned cart session.");
  }
  return true;
};
