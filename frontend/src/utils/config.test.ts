import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API_CONFIG, getApiUrl, isDevelopment, isDebugMode } from './config';

describe('API Configuration', () => {
  beforeEach(() => {
    // Mock der Umgebungsvariablen
    vi.stubEnv('VITE_API_HOST', 'localhost');
    vi.stubEnv('VITE_API_PORT', '3000');
    vi.stubEnv('VITE_API_PROTOCOL', 'http');
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api');
    vi.stubEnv('VITE_DEV_MODE', 'true');
    vi.stubEnv('VITE_DEBUG_MODE', 'false');
    vi.stubEnv('VITE_ENABLE_CACHE', 'true');
    vi.stubEnv('VITE_CACHE_TIMEOUT', '300000');
  });

  it('sollte die Standard-API-Konfiguration laden', () => {
    expect(API_CONFIG.HOST).toBe('localhost');
    expect(API_CONFIG.PORT).toBe('3000');
    expect(API_CONFIG.PROTOCOL).toBe('http');
    expect(API_CONFIG.BASE_URL).toBe('http://localhost:3000/api');
  });

  it('sollte die Cache-Konfiguration korrekt laden', () => {
    expect(API_CONFIG.ENABLE_CACHE).toBe(true);
    expect(API_CONFIG.CACHE_TIMEOUT).toBe(300000);
  });

  it('sollte die Development-Konfiguration korrekt laden', () => {
    expect(API_CONFIG.DEV_MODE).toBe(true);
    expect(API_CONFIG.DEBUG_MODE).toBe(false);
  });

  it('sollte eine API-URL mit Standard-Port generieren', () => {
    const url = getApiUrl();
    expect(url).toBe('http://localhost:3000/api');
  });

  it('sollte eine API-URL mit benutzerdefiniertem Port generieren', () => {
    const url = getApiUrl('3000');
    expect(url).toBe('http://localhost:3000/api');
  });

  it('sollte den Development-Modus korrekt erkennen', () => {
    expect(isDevelopment()).toBe(true);
  });

  it('sollte den Debug-Modus korrekt erkennen', () => {
    expect(isDebugMode()).toBe(true); // Sollte true sein, da DEV=true ist
  });
}); 