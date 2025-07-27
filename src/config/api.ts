// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Base URL - Use relative paths for production (same domain)
export const API_BASE_URL = isDevelopment ? "http://localhost:3001" : ""; // Empty string means same domain

// API Endpoints
export const API_ENDPOINTS = {
  // Donations
  DONATE: `${API_BASE_URL}/api/donate`,
  DONATIONS: `${API_BASE_URL}/api/donations`,
  TOTAL_DONATIONS: `${API_BASE_URL}/api/total-donations`,
  MIDTRANS_CALLBACK: `${API_BASE_URL}/api/midtrans-callback`,

  // Events
  ACTIVE_EVENT: `${API_BASE_URL}/api/active-event`,
  EVENTS: `${API_BASE_URL}/api/events`,

  // Users
  USERS: `${API_BASE_URL}/api/users`,

  // Gallery
  GALLERY: `${API_BASE_URL}/api/gallery`,
  GALLERY_UPLOAD: `${API_BASE_URL}/api/gallery/upload`,

  // Videos
  VIDEOS: `${API_BASE_URL}/api/videos`,

  // Programs
  PROGRAMS: `${API_BASE_URL}/api/programs`,

  // Blog Posts
  BLOG_POSTS: `${API_BASE_URL}/api/blog-posts`,
};

// Midtrans Configuration
export const MIDTRANS_CONFIG = {
  clientKey: isDevelopment
    ? "SB-Mid-client-yTb4hQknvTM4U0qb"
    : "your-production-client-key", // Ganti dengan production key
  isProduction: isProduction,
};
