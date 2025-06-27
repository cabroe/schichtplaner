# AGENT.md - Schichtplaner Development Guide

## Commands
- Build: `make build` (builds frontend + Go binary)
- Dev: `make dev` (runs frontend on :5173, Go on :3000 with hot reload)
- Test: `make test` (all tests), `make test-go` (Go only), `make test-frontend` (frontend only)
- Single Go test: `go test -v ./path/to/package -run TestName`
- Frontend Tests: `cd frontend && yarn test` (interactive), `yarn test:run` (CI), `yarn test:ui` (UI mode)
- Lint: `make lint` (ESLint + go vet)
- Coverage: `make coverage` (both), `make coverage-go` (Go only)

## Architecture
- **Go Backend**: Echo web server with embedded frontend assets, CORS enabled
- **Frontend**: React + TypeScript + Vite + Font Awesome icons (SPA served by Go in production)
- **Testing**: Vitest + React Testing Library + jsdom for frontend unit/integration tests
- **Dev Mode**: Vite dev server (:5173) proxied through Go server (:3000)
- **API**: RESTful endpoints under `/api/*` prefix
- **Static Assets**: Embedded in Go binary using `//go:embed`
- **Environment**: .env files for configuration (.env.dev, .env.prod, .env.test - frontend/.env.dev: VITE_API_BASE_URL, .env.dev: SERVER_PORT, ENV)

## Code Style
- **Go**: Standard Go conventions, Echo framework patterns
- **Frontend**: TypeScript strict mode, ESLint rules, functional components
- **Testing**: Vitest for frontend tests, Go testing package for backend
- **Imports**: Go std lib first, then external, then internal packages
- **Naming**: camelCase (TS), snake_case (Go structs), PascalCase (Go types)
- **Language**: German comments allowed, English code preferred
- **Database**: SQLite (github.com/glebarez/sqlite) with GORM (production can use PostgreSQL)
- **Models**: GORM models, Echo handlers
- **Error Handling**: Go: explicit error returns; TS: proper error boundaries

## Testing Setup
- **Frontend**: Vitest with jsdom environment, React Testing Library for component testing
- **Test Files**: `*.test.ts` or `*.test.tsx` files in `src/` directory
- **Setup**: Global test setup in `src/test/setup.ts` with jest-dom matchers
- **Coverage**: Built-in Vitest coverage reporting
