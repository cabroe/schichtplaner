# Schichtplaner

Moderne Schichtplanungs-Anwendung mit Go Backend und React Frontend.

## Quick Start

### Development Setup

1. Environment-Konfiguration kopieren:
   ```bash
   cp .env.dev .env
   cp frontend/.env.dev frontend/.env
   ```

2. Dependencies installieren:
   ```bash
   make install
   ```

3. Development Server starten:
   ```bash
   make dev
   ```

### Production Setup

1. Environment-Konfiguration kopieren:
   ```bash
   cp .env.prod .env
   cp frontend/.env.prod frontend/.env
   ```

2. Production Build erstellen:
   ```bash
   make build
   ```

3. Server starten:
   ```bash
   ./bin/schichtplaner.exe
   ```

## Environment-Konfiguration

Das Projekt verwendet verschiedene `.env`-Dateien für unterschiedliche Umgebungen:

- **`.env.dev`** - Development (Proxy zu Vite-Server)
- **`.env.prod`** - Production (statische Dateien)
- **`.env.test`** - Testing (Test-Port)

### Backend Environment Variablen

- `SERVER_PORT` - Port für den Go-Server (default: 3000)
- `ENV` - Umgebungsmodus (`dev`, `prod`, `test`)

### Frontend Environment Variablen

- `VITE_API_BASE_URL` - Basis-URL für API-Calls

## Development

Siehe [AGENT.md](./AGENT.md) für detaillierte Entwicklungsinformationen.
