# Schichtplaner Cursor Rules

## Allgemein
- Alle Antworten auf Deutsch
- Deutsche Kommentare in Code
- Sauberer, lesbarer Code
- Aussagekräftige Variablen- und Funktionsnamen

## Backend (Go)
- Echo Framework für HTTP-Server
- GORM für Datenbankoperationen
- SQLite als Datenbank
- Struktur: `handlers/`, `routes/`, `models/`
- Pagination: `?page=1&page_size=10`
- RESTful APIs mit JSON-Responses
- Deutsche Fehlermeldungen
- Tests mit testify und httptest

## Frontend (React/TypeScript)
- TypeScript für alle Komponenten
- React Router für Navigation
- Zustand für State Management
- Tabler UI für Komponenten
- Font Awesome für Icons (CSS-Klassen)
- 2 Spaces Einrückung
- Deutsche UI-Texte

## Development
- `make dev` für parallele Entwicklung
- `make build` für Production
- `make test` für Tests
- Docker für Deployment
- >80% Testabdeckung

## API Standards
- RESTful Design: `/api/resource/:id`
- HTTP-Statuscodes: 200, 201, 400, 404, 500
- Pagination für List-Endpoints
- Konsistente JSON-Responses
- Input-Validierung

## Code Quality
- Kurze, fokussierte Funktionen
- Vermeide Code-Duplikation
- Kommentiere komplexe Logik
- Aussagekräftige Commit-Messages 