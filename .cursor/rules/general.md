# Allgemeine Projektregeln

## Kommunikation
- Alle Antworten auf Deutsch
- Verwende deutsche Kommentare in Code
- Erkläre komplexe Logik mit Kommentaren

## Projektstruktur
- Folge den bestehenden Projektstrukturen
- Halte Dateien und Ordner organisiert
- Verwende aussagekräftige Dateinamen
- Trenne Concerns (Separation of Concerns)

## Development Workflow
- Verwende `make dev` für parallele Entwicklung
- Verwende `make build` für Production Build
- Nutze Docker für Deployment
- Halte Dependencies aktuell

## Code Quality
- Schreibe sauberen, lesbaren Code
- Verwende aussagekräftige Variablen- und Funktionsnamen
- Kommentiere komplexe Algorithmen
- Vermeide Code-Duplikation

## Testing
- Schreibe Tests für neue Features
- Führe Tests vor Commits aus
- Ziel: >80% Testabdeckung
- Teste sowohl positive als auch negative Szenarien

## Version Control
- Schreibe aussagekräftige Commit-Messages
- Verwende konventionelle Commit-Format
- Committe häufig und in kleinen Chunks
- Verwende Feature-Branches für neue Features

## Documentation
- Dokumentiere API-Endpoints
- Schreibe README-Dateien für neue Module
- Kommentiere komplexe Business-Logik
- Halte Dokumentation aktuell

## Security
- Validiere alle User-Inputs
- Verwende sichere Defaults
- Halte Dependencies aktuell
- Implementiere proper Error Handling

## API Standards
- Verwende RESTful Design-Prinzipien
- Konsistente URL-Struktur: `/api/resource/:id`
- Sinnvolle HTTP-Statuscodes (200, 201, 400, 404, 500)
- JSON als Standard-Response-Format
- Deutsche Fehlermeldungen

## Pagination Best Practices
- Implementiere Pagination für alle List-Endpoints
- Verwende einheitliche Query-Parameter: `page` und `page_size`
- Setze sinnvolle Limits (max 100 items per page)
- Gib immer `total` und `total_pages` in Response zurück
- Verwende die `utils/pagination.go` Utilities

## Performance
- Optimiere Datenbankabfragen mit Preloading
- Verwende Pagination für große Datensätze
- Implementiere Caching wo sinnvoll
- Überwache Response-Zeiten 