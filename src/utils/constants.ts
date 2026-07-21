/**
 * MadhurGram Frontend Centralized Configuration Constants
 */

export const ADMIN_TOKEN_KEY = "adminAccessToken";

// 🍪 Admin Cookie — mirrors access token for Next.js middleware auth check (non-HttpOnly)
// The actual refresh token is in a separate HttpOnly cookie managed by the backend.
export const ADMIN_COOKIE_NAME = "adminAccessToken";
export const ADMIN_COOKIE_MAX_AGE = 900; // 15 minutes in seconds (matches access token expiry)

// 🔄 Token Refresh — silently refresh token 5 minutes before expiry
export const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds
export const TOKEN_AUTO_REFRESH_INTERVAL = 60000; // Check every 60 seconds

// 🔄 Live Polling Intervals (milliseconds)
export const LIVE_POLLING_INTERVAL = 30000; // 30 seconds for live order queue
export const ANALYTICS_POLLING_INTERVAL = 60000; // 60 seconds for dashboard analytics refresh

// 🎯 Marketing Segmentation Defaults
export const DEFAULT_MARKETING_SEGMENT = "oil buyers";

// 🌐 API Configuration Fallbacks
export const API_BASE_URL_FALLBACK = "http://localhost:8080";

// ✦ Product Defaults
export const DEFAULT_PRODUCT_RATING = "4.8";
