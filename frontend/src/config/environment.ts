export const config = {
  brandName: import.meta.env.VITE_BRAND_NAME || "Kastner IT",
  brandHref: import.meta.env.VITE_BRAND_HREF || "/dashboard",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  appTitle: import.meta.env.VITE_APP_TITLE || "Schichtplaner"
};