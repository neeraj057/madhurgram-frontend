import { getAdminToken, handleAuthError, parseApiError, isTokenExpiringSoon, silentRefresh } from "@/utils/adminAuth";
import { API_BASE_URL_FALLBACK } from "@/utils/constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL_FALLBACK;

export interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Standardized HTTP API client wrapper.
 * Automatically handles base URL routing, JSON content types, authorization tokens,
 * HTTP error parses, and session redirection.
 *
 * Before each request, checks if the admin token is expiring soon and silently
 * refreshes it to prevent session expiration errors.
 */
export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { requireAuth = false, headers: customHeaders, ...restOptions } = options;

  // 🔄 Silent token refresh — if token is about to expire, refresh it before making the call
  const token = getAdminToken();
  if (token && isTokenExpiringSoon()) {
    await silentRefresh();
  }

  const headers = new Headers(customHeaders);

  // Auto-inject JSON Content-Type if a body is present and not explicitly set
  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Always inject the admin token if it exists in storage — the backend uses it
  // to resolve the caller's role (e.g. SUPER_ADMIN vs SUPPORT_STAFF) for masking.
  // We don't restrict this to /admin/ routes because order, stats, and other
  // endpoints also need role-aware responses.
  // Re-read token after potential refresh above
  const currentToken = getAdminToken();
  if (currentToken) {
    headers.set("Authorization", `Bearer ${currentToken}`);
  }
  // requireAuth = true means we must have a token (used for strict-auth flows)
  const isDocAdminRoute = endpoint.includes("/api/v1/admin/") || requireAuth;

  // Ensure absolute URL if endpoint is relative (starts with /)
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL.trim().replace(/\/+$/, "")}${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers,
    credentials: "include", // Send/receive HttpOnly cookies (refresh token)
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

  // Handle empty bodies safely (including 204 No Content and empty 200 OK)
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

