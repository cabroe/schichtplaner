# Schichtplaner Agent Guide

## Build/Test Commands
- `make build` - Build production binary (frontend + Go backend)
- `make dev` - Start development servers (frontend on :5173, backend on :3000)
- `cd frontend && yarn build` - Build frontend only
- `cd frontend && yarn lint` - Lint frontend TypeScript/React code
- `cd frontend && yarn dev` - Start frontend dev server
- `go build -o ./bin/go-vite .` - Build Go backend only
- `air` - Hot reload Go backend during development
- `go test ./...` - Run all Go tests

## Architecture
- **Backend**: Go 1.21 with Echo framework, serves API at `/api/*` routes
- **Frontend**: React 18 + TypeScript + Vite, SPA served from `/`
- **UI Framework**: Tabler UI (Bootstrap 5-based) for modern dashboard design
- **Routing**: React Router DOM for client-side navigation
- **Development**: Vite dev server proxied through Go backend
- **Production**: Frontend embedded in Go binary via `embed.FS`
- **Hot reload**: Air for Go backend, Vite for frontend
- **Templates**: Go HTML templates for server-side rendering (optional)

## Code Style
- **Go**: Standard Go conventions, Echo framework patterns
- **TypeScript**: Strict mode enabled, React functional components
- **Imports**: ES modules for frontend, standard Go imports
- **Formatting**: ESLint for frontend, go fmt for backend
- **Types**: Strict TypeScript, no unused locals/parameters
- **Files**: `.tsx` for React components, `.go` for backend
