import { ADMIN_TOKEN_KEY, ADMIN_COOKIE_NAME } from "@/utils/constants";

export { ADMIN_TOKEN_KEY };

export const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ADMIN_TOKEN_KEY);
  document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0`;

  if (!window.location.pathname.includes("/admin/login")) {
    window.location.href = "/admin/login";
  }
};

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
