# Schichtplaner Agent Guide

## Build/Test Commands
- `make build` - Build production binary (frontend + Go backend)
- `make dev` - Start development servers (frontend on :5173, backend on :3000)
- `make test` - Run all tests (frontend lint/build + backend tests)
- `make test-frontend` - Run frontend tests (lint + build)
- `make test-backend` - Run backend tests
- `cd frontend && yarn build` - Build frontend only
- `cd frontend && yarn lint` - Lint frontend TypeScript/React code
- `cd frontend && yarn dev` - Start frontend dev server
- `go build -o ./bin/go-vite .` - Build Go backend only
- `air` - Hot reload Go backend during development
- `go test ./...` - Run all Go tests
- `go test ./handlers/... -v` - Run handler tests with verbose output

## Architecture
- **Backend**: Go 1.21 with Echo framework, serves API at `/api/*` routes
- **Frontend**: React 18 + TypeScript + Vite, SPA served from `/`
- **UI Framework**: Tabler UI (Bootstrap 5-based) for modern dashboard design
- **Routing**: React Router DOM for client-side navigation
- **Data Layer**: In-memory storage with full CRUD operations
- **Models**: Employee, Shift, Report with validation tags
- **Validation**: go-playground/validator for request validation
- **Development**: Vite dev server proxied through Go backend
- **Production**: Frontend embedded in Go binary via `embed.FS`
- **Hot reload**: Air for Go backend, Vite for frontend
- **Templates**: Go HTML templates for server-side rendering (optional)

## Project Structure
```
├── handlers/           # HTTP handlers with CRUD operations
│   ├── router.go      # Central route registration
│   ├── employees.go   # Employee CRUD operations
│   ├── shifts.go      # Shift CRUD operations
│   ├── reports.go     # Report generation and CSV export
│   └── health.go      # Health check endpoints
├── models/            # Data models and storage
│   ├── models.go      # Struct definitions with validation
│   └── store.go       # In-memory storage with thread-safe operations
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   └── main.tsx   # App entry point
│   └── dist/          # Built frontend assets
└── templates/         # Go HTML templates (optional)
```

## API Endpoints
- **Health**: `GET /api/health`, `GET /api/message`
- **Employees**: Full CRUD at `/api/employees`
- **Shifts**: Full CRUD at `/api/shifts`
- **Reports**: `GET /api/reports/*`, `GET /api/reports/export?type=shifts|employees`

## Code Style
- **Go**: Standard Go conventions, Echo framework patterns
- **CRUD**: Follow Echo cookbook pattern with `c.Bind()`, `c.Validate()`, `c.JSON()`
- **TypeScript**: Strict mode enabled, React functional components
- **Imports**: ES modules for frontend, standard Go imports
- **Formatting**: ESLint for frontend, go fmt for backend
- **Types**: Strict TypeScript, no unused locals/parameters
- **Files**: `.tsx` for React components, `.go` for backend
- **Testing**: Comprehensive CRUD tests with validation testing
