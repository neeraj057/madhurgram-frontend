/**
 * MadhurGram Frontend Centralized Configuration Constants
 */

export const ADMIN_TOKEN_KEY = "adminToken";

// 🍪 Admin Cookie name and configuration settings
export const ADMIN_COOKIE_NAME = "adminToken";
export const ADMIN_COOKIE_MAX_AGE = 36000; // 10 hours in seconds

// 🔄 Live Polling Intervals (milliseconds)
export const LIVE_POLLING_INTERVAL = 30000; // 30 seconds for live order queue
export const ANALYTICS_POLLING_INTERVAL = 60000; // 60 seconds for dashboard analytics refresh

// 🎯 Marketing Segmentation Defaults
export const DEFAULT_MARKETING_SEGMENT = "oil buyers";

// 🌐 API Configuration Fallbacks
export const API_BASE_URL_FALLBACK = "http://localhost:8080";
