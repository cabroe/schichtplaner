# Umgebungsvariablen Konfiguration

Diese Datei erklärt die verfügbaren Umgebungsvariablen für das Frontend.

## Installation

1. Kopieren Sie `env.example` zu `.env`:
   ```bash
   cp env.example .env
   ```

2. Passen Sie die Werte in der `.env`-Datei an Ihre Umgebung an.

## Verfügbare Variablen

### API Configuration

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `VITE_API_URL` | `http://localhost:3000/api` | Vollständige API-URL |
| `VITE_API_HOST` | `localhost` | API-Hostname |
| `VITE_API_PORT` | `3000` | API-Port |
| `VITE_API_PROTOCOL` | `http` | API-Protokoll (http/https) |

### Development Configuration

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `VITE_DEV_MODE` | `true` | Development-Modus aktivieren |
| `VITE_DEBUG_MODE` | `false` | Debug-Modus aktivieren |

### Feature Flags

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `VITE_ENABLE_CACHE` | `true` | API-Cache aktivieren |
| `VITE_CACHE_TIMEOUT` | `300000` | Cache-Timeout in Millisekunden (5 Min) |

## Beispiel-Konfigurationen

### Lokale Entwicklung
```env
VITE_API_HOST=localhost
VITE_API_PORT=3000
VITE_API_PROTOCOL=http
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
```

### Produktionsumgebung
```env
VITE_API_HOST=api.example.com
VITE_API_PORT=443
VITE_API_PROTOCOL=https
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### Docker-Entwicklung
```env
VITE_API_HOST=host.docker.internal
VITE_API_PORT=3000
VITE_API_PROTOCOL=http
VITE_DEV_MODE=true
```

## Verwendung im Code

```typescript
import { API_CONFIG, getApiUrl } from '../utils/config';

// Standard API-URL verwenden
const apiUrl = API_CONFIG.BASE_URL;

// Benutzerdefinierte Port-URL
const customUrl = getApiUrl('3000');
```

## Hinweise

- Alle Variablen müssen mit `VITE_` beginnen, um in der Vite-Anwendung verfügbar zu sein
- Änderungen an der `.env`-Datei erfordern einen Neustart der Entwicklungsumgebung
- Die `.env`-Datei sollte nicht in das Git-Repository eingecheckt werden 