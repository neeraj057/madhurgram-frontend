import { getAdminToken, handleAuthError, parseApiError } from "@/utils/adminAuth";
import { API_BASE_URL_FALLBACK } from "@/utils/constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL_FALLBACK;

export interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Standardized HTTP API client wrapper.
 * Automatically handles base URL routing, JSON content types, authorization tokens,
 * HTTP error parses, and session redirection.
 */
export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { requireAuth = false, headers: customHeaders, ...restOptions } = options;

  const headers = new Headers(customHeaders);

  // Auto-inject JSON Content-Type if a body is present and not explicitly set
  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Auto-inject admin token if requested or if targeting an admin endpoint
  const isDocAdminRoute = endpoint.includes("/api/v1/admin/") || requireAuth;
  if (isDocAdminRoute) {
    const token = getAdminToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Ensure absolute URL if endpoint is relative (starts with /)
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL.trim().replace(/\/+$/, "")}${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  // Intercept 401/403 to auto-redirect user to admin login
  if (isDocAdminRoute) {
    const isAuthErr = await handleAuthError(response);
    if (isAuthErr) {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errMsg = await parseApiError(response);
    throw new Error(errMsg);
  }

  // Handle 204 No Content responses safely
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
