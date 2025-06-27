# AGENT.md - Schichtplaner Development Guide

## Commands
- Build: `make build` (builds frontend + Go binary)
- Dev: `make dev` (runs frontend on :5173, Go on :3000 with hot reload)
- Test: `make test` (all tests), `make test-go` (Go only), `make test-frontend` (frontend only)
- Single Go test: `go test -v ./path/to/package -run TestName`
- Lint: `make lint` (ESLint + go vet)
- Coverage: `make coverage` (both), `make coverage-go` (Go only)

## Architecture
- **Go Backend**: Echo web server with embedded frontend assets
- **Frontend**: React + TypeScript + Vite (SPA served by Go in production)
- **Dev Mode**: Vite dev server (:5173) proxied through Go server (:3000)
- **API**: RESTful endpoints under `/api/*` prefix
- **Static Assets**: Embedded in Go binary using `//go:embed`

## Code Style
- **Go**: Standard Go conventions, Echo framework patterns
- **Frontend**: TypeScript strict mode, ESLint rules, functional components
- **Imports**: Go std lib first, then external, then internal packages
- **Naming**: camelCase (TS), snake_case (Go structs), PascalCase (Go types)
- **Error Handling**: Go: explicit error returns; TS: proper error boundaries
