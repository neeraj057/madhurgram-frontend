export const ADMIN_TOKEN_KEY = "adminToken";

export const clearAdminSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ADMIN_TOKEN_KEY);
  document.cookie = `adminToken=; path=/; max-age=0`;
  window.location.href = "/admin/login";
};

export const handleAuthError = (response: Response) => {
  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    return true;
  }
  return false;
};
