// API Configuration Utility
export const API_CONFIG = {
  // API Base Configuration
  HOST: import.meta.env.VITE_API_HOST || 'localhost',
  PORT: import.meta.env.VITE_API_PORT || '3000',
  PROTOCOL: import.meta.env.VITE_API_PROTOCOL || 'http',
  
  // Full URL Configuration
  get BASE_URL() {
    return import.meta.env.VITE_API_URL || `${this.PROTOCOL}://${this.HOST}:${this.PORT}/api`;
  },
  
  // Development Configuration
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Feature Flags
  ENABLE_CACHE: import.meta.env.VITE_ENABLE_CACHE !== 'false',
  CACHE_TIMEOUT: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'), // 5 Minuten
};

// Helper function to get API URL with custom port
export const getApiUrl = (port?: string) => {
  const host = API_CONFIG.HOST;
  const protocol = API_CONFIG.PROTOCOL;
  const apiPort = port || API_CONFIG.PORT;
  
  return `${protocol}://${host}:${apiPort}/api`;
};

// Helper function to check if running in development
export const isDevelopment = () => {
  return API_CONFIG.DEV_MODE || import.meta.env.DEV;
};

// Helper function to check if debug mode is enabled
export const isDebugMode = () => {
  return API_CONFIG.DEBUG_MODE || isDevelopment();
}; 