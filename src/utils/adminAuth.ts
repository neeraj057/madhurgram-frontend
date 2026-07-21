import {
  ADMIN_TOKEN_KEY,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
  TOKEN_REFRESH_THRESHOLD,
  TOKEN_AUTO_REFRESH_INTERVAL,
} from "@/utils/constants";
import { API_ENDPOINTS } from "@/apis/api";

export { ADMIN_TOKEN_KEY };

// ─── Access Token Management ─────────────────────────────────────────
// Access token (JWT, 15 min) is stored in localStorage for API calls
// and mirrored in a non-HttpOnly cookie for Next.js middleware auth checks.

export const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string) => {
  if (typeof window === "undefined") return;
  persistAccessToken(token);
};

/**
 * Saves access token to both localStorage and a non-HttpOnly cookie.
 * - localStorage: used by API calls (Authorization header)
 * - Cookie: used by Next.js middleware to check if user is logged in
 *
 * NOTE: The refresh token is in a separate HttpOnly cookie managed entirely
 * by the backend — JavaScript never sees or touches it.
 */
const persistAccessToken = (token: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  document.cookie = `${ADMIN_COOKIE_NAME}=${token}; path=/; max-age=${ADMIN_COOKIE_MAX_AGE}`;
};

/**
 * Clears all client-side auth state and redirects to login.
 * Does NOT call the backend logout endpoint — use `adminLogout()` for full logout.
 */
export const clearAdminSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ADMIN_TOKEN_KEY);
  // Also clear the old key in case user had previous session
  localStorage.removeItem("adminToken");
  document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0`;
  // Clear legacy cookie too
  document.cookie = `adminToken=; path=/; max-age=0`;

  if (!window.location.pathname.includes("/admin/login")) {
    window.location.href = "/admin/login";
  }
};

// ─── Auth Helpers for Direct Fetch Calls ──────────────────────────────

export const getAuthHeaders = (contentType?: string) => {
  const token = getAdminToken();
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  return headers;
};

export const getAuthFetchOptions = (method = "GET", body?: BodyInit, contentType?: string) => {
  const headers = getAuthHeaders(contentType);
  const options: RequestInit = { method, headers };

  if (body !== undefined) {
    options.body = body;
  }

  return options;
};

// ─── Response Error Handlers ──────────────────────────────────────────

export const handleAuthError = async (response: Response) => {
  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    return true;
  }
  return false;
};

export const parseApiError = async (response: Response) => {
  try {
    const text = await response.text();
    if (!text) return response.statusText || "Unknown error";

    try {
      const payload = JSON.parse(text);
      return payload?.message || payload?.error || payload?.detail || response.statusText;
    } catch {
      return text.slice(0, 200);
    }
  } catch {
    return response.statusText || "Unknown error";
  }
};

// ─── JWT Decode & Expiry Check ────────────────────────────────────────

/**
 * Decodes JWT payload without verifying signature (client-side decode only).
 * Used to read the `exp` claim for proactive refresh timing.
 */
const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

/**
 * Checks if the current access token is expiring within the threshold window
 * (default: 5 minutes). Returns true if token needs refresh.
 */
export const isTokenExpiringSoon = (): boolean => {
  const token = getAdminToken();
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp - nowSeconds < TOKEN_REFRESH_THRESHOLD;
};

// ─── Silent Token Refresh (Production-Grade) ──────────────────────────
// Uses HttpOnly refresh token cookie (browser sends it automatically).
// Frontend never sees the refresh token — only the access token in response.

/** Mutex to prevent multiple concurrent refresh calls */
let refreshInProgress: Promise<boolean> | null = null;

/**
 * Silently refreshes the access token using the HttpOnly refresh token cookie.
 * The browser automatically includes the cookie with `credentials: "include"`.
 * On success, saves the new access token to localStorage + middleware cookie.
 * Returns true if refresh was successful, false otherwise.
 */
export const silentRefresh = async (): Promise<boolean> => {
  // If a refresh is already in progress, wait for it instead of duplicating
  if (refreshInProgress) {
    return refreshInProgress;
  }

  const doRefresh = async (): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.adminRefreshToken, {
        method: "POST",
        credentials: "include", // Sends HttpOnly refresh cookie automatically
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("[Auth] Token refresh failed with status:", response.status);
        return false;
      }

      const data = await response.json();
      if (data.accessToken) {
        persistAccessToken(data.accessToken);
        console.info("[Auth] Access token refreshed successfully");
        return true;
      }

      return false;
    } catch (error) {
      console.warn("[Auth] Token refresh error:", error);
      return false;
    }
  };

  refreshInProgress = doRefresh().finally(() => {
    refreshInProgress = null;
  });

  return refreshInProgress;
};

// ─── Full Logout (Server-Side Revocation) ─────────────────────────────

/**
 * Production-grade logout:
 * 1. Calls backend to revoke the refresh token in DB + clear HttpOnly cookie
 * 2. Clears access token from localStorage + middleware cookie
 * 3. Redirects to login page
 */
export const adminLogout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint — revokes refresh token in DB and clears HttpOnly cookie
    await fetch(API_ENDPOINTS.adminLogout, {
      method: "POST",
      credentials: "include", // Sends HttpOnly refresh cookie for revocation
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.warn("[Auth] Logout API call failed:", error);
    // Still proceed with client-side cleanup even if server call fails
  }

  // Clear client-side state (access token + middleware cookie)
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem("adminToken"); // legacy cleanup
    document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0`;
    document.cookie = `adminToken=; path=/; max-age=0`; // legacy cleanup

    if (!window.location.pathname.includes("/admin/login")) {
      window.location.href = "/admin/login";
    }
  }
};

// ─── Background Auto-Refresh Timer ────────────────────────────────────
// Proactively refreshes the token in the background so pages using direct
// fetch calls (bypassing apiClient) always have a fresh access token.

let autoRefreshStarted = false;

/**
 * Starts a background interval that checks token expiry every 60 seconds.
 * If the token is expiring soon, silently refreshes it.
 * Safe to call multiple times — only starts once.
 */
export const startAutoRefresh = () => {
  if (autoRefreshStarted || typeof window === "undefined") return;
  autoRefreshStarted = true;

  setInterval(async () => {
    const token = getAdminToken();
    if (token && isTokenExpiringSoon()) {
      const success = await silentRefresh();
      if (!success) {
        console.warn("[Auth] Background auto-refresh failed — session may expire soon");
      }
    }
  }, TOKEN_AUTO_REFRESH_INTERVAL);
};

// Auto-start the refresh timer when this module is imported on the client side
if (typeof window !== "undefined") {
  // Small delay to avoid running during initial page hydration
  setTimeout(startAutoRefresh, 2000);
}
