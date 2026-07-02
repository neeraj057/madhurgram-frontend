// apis/customerProfile.ts
import { API_ENDPOINTS } from "./api"; // तुम्हारा बेस API कॉन्फिग

export type AddressType = "HOME" | "OFFICE" | "OTHER";

export interface Address {
  id?: number;
  addressType: AddressType;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
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
    throw new Error("Failed to fetch customer profile.");
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
    throw new Error("Failed to add new address.");
  }
  return response.json();
};