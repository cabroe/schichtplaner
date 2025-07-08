# Schichtplaner Agent Guide

## Build/Test Commands
- `make build` - Erstellt Production Binary (Frontend + Go Backend)
- `make dev` - Startet Entwicklungsserver (Frontend auf :5173, Backend auf :3000)
- `make test` - Führt alle Tests aus (Frontend Lint/Build + Backend Tests)
- `make test-frontend` - Führt Frontend Tests aus (Lint + Build)
- `make test-backend` - Führt Backend Tests aus
- `cd frontend && yarn build` - Erstellt nur Frontend
- `cd frontend && yarn lint` - Lintet Frontend TypeScript/React Code
- `cd frontend && yarn dev` - Startet Frontend Entwicklungsserver
- `go build -o ./bin/go-vite .` - Erstellt nur Go Backend
- `air` - Hot Reload für Go Backend während Entwicklung
- `go test ./...` - Führt alle Go Tests aus
- `go test ./handlers/... -v` - Führt Handler Tests mit ausführlicher Ausgabe aus

## Architecture
- **Backend**: Go 1.24.4 mit Echo Framework, serviert API unter `/api/*` Routen
- **Frontend**: React 18 + TypeScript + Vite, SPA serviert von `/`
- **UI Framework**: Tabler UI (Bootstrap 5-basiert) für modernes Dashboard Design
- **Routing**: React Router DOM für clientseitiges Navigieren
- **Data Layer**: In-memory Storage mit vollständigen CRUD Operationen + Pagination
- **Models**: Employee, Shift, Report mit Validierungs-Tags
- **Validation**: go-playground/validator für Request-Validierung
- **Configuration**: Environment-basierte Konfiguration mit .env Support
- **Middleware**: Logger, Gzip, CORS, Secure, Session, Rate Limiter (API only), Prometheus
- **Monitoring**: Prometheus metrics via `/metrics` endpoint
- **Security**: Configurable rate limiting per IP für API, CORS protection, Security headers (XSS, Clickjacking)
- **Sessions**: Cookie-based HTTP session management via Gorilla Sessions mit Environment-Secret
- **Caching**: Intelligente Cache-Headers für statische Assets (JS/CSS: 1 Jahr, Images: 1 Monat)
- **Development**: Vite Dev Server über Go Backend geproxied
- **Production**: Frontend eingebettet in Go Binary via `embed.FS`
- **Hot reload**: Air für Go Backend, Vite für Frontend
- **Templates**: Go HTML Templates für Server-side Rendering (optional)

## Project Structure
```
├── config/             # Konfiguration und Environment-Handling
│   └── config.go       # Environment-basierte Konfiguration
├── handlers/           # HTTP handlers mit CRUD Operationen
│   ├── router.go       # Zentrale Routen-Registrierung
│   ├── employees.go    # Employee CRUD Operationen mit Pagination
│   ├── shifts.go       # Shift CRUD Operationen mit Pagination
│   ├── reports.go      # Report Generierung und CSV Export
│   ├── health.go       # Health Check Endpoints
│   └── *_test.go       # Umfassende Tests für alle Handler
├── models/             # Datenmodelle und Storage
│   ├── models.go       # Struct Definitionen mit Validierung + Pagination
│   └── store.go        # In-memory Storage mit Thread-safe Operationen
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Wiederverwendbare UI Komponenten
│   │   ├── pages/      # Seiten Komponenten
│   │   └── main.tsx    # App Einstiegspunkt
│   ├── frontend.go     # Static File Serving mit Cache-Headers
│   └── dist/           # Gebaute Frontend Assets
├── .env.example        # Environment-Variablen Template
├── .env                # Development Environment-Konfiguration
└── templates/          # Go HTML Templates (optional)
```

## API Endpoints
- **Health**: `GET /api/health`, `GET /api/message`
- **Employees**: Full CRUD at `/api/employees` (mit Pagination: `?limit=10&offset=0`)
- **Shifts**: Full CRUD at `/api/shifts` (mit Pagination: `?limit=10&offset=0`)
- **Reports**: `GET /api/reports/*`, `GET /api/reports/export?type=shifts|employees`
- **Metrics**: `GET /metrics` (Prometheus monitoring)

## Code Style
- **Go**: Standard Go conventions, Echo framework patterns
- **CRUD**: Follow Echo cookbook pattern with `c.Bind()`, `c.Validate()`, `c.JSON()`
- **TypeScript**: Strict mode enabled, React functional components
- **Imports**: ES modules for frontend, standard Go imports
- **Formatting**: ESLint for frontend, go fmt for backend
- **Types**: Strict TypeScript, no unused locals/parameters
- **Files**: `.tsx` for React components, `.go` for backend
- **Testing**: Comprehensive CRUD tests with validation testing
- **Sprache**: Code und Variablen in Englisch, Kommentare in Deutsch
