# Backend (Go) Regeln

## Framework & Architektur
- Verwende Echo Framework für HTTP-Server
- Trenne Handler von Routen (Handler in `handlers/`, Routen in `routes/`)
- Strukturiere Code in Pakete (handlers, routes, models, etc.)
- Verwende Dependency Injection wo sinnvoll

## Development Workflow
- Verwende `air` für Hot Reload im Development
- Verwende `go mod tidy` nach neuen Imports
- Führe `go test ./...` vor Commits aus
- Nutze `go build` für Production Builds

## Testing
- Schreibe Tests für alle Handler mit testify
- Verwende `httptest` für HTTP-Handler Tests
- Ziel: >80% Testabdeckung
- Teste sowohl positive als auch negative Szenarien

## Code Style
- Verwende camelCase für Variablen/Funktionen
- Verwende PascalCase für exportierte Funktionen/Typen
- Verwende deutsche Kommentare für komplexe Logik
- Halte Funktionen kurz und fokussiert

## Error Handling
- Verwende strukturierte Fehlerbehandlung
- Logge Fehler mit Kontext
- Gib sinnvolle HTTP-Statuscodes zurück
- Validiere Input-Daten

## API Design
- Verwende RESTful Endpoints
- Konsistente URL-Struktur
- Sinnvolle HTTP-Methoden (GET, POST, PUT, DELETE)
- JSON als Standard-Response-Format 