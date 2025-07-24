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
- Struktur: `handlers/`, `routes/`, `models/`, `database/`
- Pagination: `?page=1&page_size=10`
- RESTful APIs mit JSON-Responses
- Deutsche Fehlermeldungen
- Tests mit testify und httptest
- In-Memory SQLite für Tests

## Frontend (React/TypeScript)
- TypeScript für alle Komponenten
- React Router für Navigation
- Zustand für State Management
- Tabler UI für Komponenten
- Font Awesome für Icons (CSS-Klassen)
- 2 Spaces Einrückung
- Deutsche UI-Texte
- Vite für Build-Tool
- Yarn für Package Management

## Development
- `make dev` für parallele Entwicklung
- `make build` für Production
- `make test` für Tests
- Docker für Deployment
- >80% Testabdeckung

## TODO-Verwaltung
- `make todo` für Status-Übersicht
- `make todo-progress` für detaillierten Fortschritt
- `make todo-add` für neue Aufgaben hinzufügen
- `make todo-complete` für Aufgaben abschließen
- `make todo-update` für Fortschritt aktualisieren
- Prioritäten: Hoch (Sofort), Mittel (Nächste Iteration), Niedrig (Langfristig)
- TODO-Datei: `TODO.md`
- Pflege-Skript: `scripts/update_todo.sh`

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
- Tests für alle Handler und Routen 