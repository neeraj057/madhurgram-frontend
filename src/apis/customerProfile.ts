// apis/customerProfile.ts
import { API_ENDPOINTS } from "@/apis/api"; // तुम्हारा बेस API कॉन्फिग

export type AddressType = "HOME" | "OFFICE" | "OTHER";

export interface Address {
  id?: number;
  addressType: AddressType;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CustomerProfile {
  id: number;
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  addresses: Address[];
}

// 🔍 1. फोन नंबर से प्रोफाइल और एड्रेस मंगाना
export const fetchCustomerProfile = async (phone: string): Promise<CustomerProfile> => {
  const response = await fetch(API_ENDPOINTS.getCustomerProfile(phone), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    // Try to extract a meaningful error message from the response body
    let errorMessage = "Failed to fetch customer profile.";
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Response body wasn't JSON, keep default message
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// ➕ 2. प्रोफाइल में नया एड्रेस ऐड करना
export const addCustomerAddress = async (phone: string, address: Address): Promise<CustomerProfile> => {
  const response = await fetch(API_ENDPOINTS.addCustomerAddress(phone), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    let errorMessage = "Failed to add new address.";
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
};

// ❌ 3. प्रोफाइल से एड्रेस डिलीट करना
export const deleteCustomerAddress = async (phone: string, addressId: number): Promise<CustomerProfile> => {
  const response = await fetch(API_ENDPOINTS.deleteCustomerAddress(phone, addressId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete address.";
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
};