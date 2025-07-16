# Routes Package

Dieses Paket enthält alle API-Routen für das Schichtplaner-System. Die Routen sind nach Ressourcen in separate Dateien aufgeteilt für bessere Wartbarkeit.

## Struktur

### `routes.go`
- **RegisterAPIRoutes**: Hauptfunktion, die alle API-Routen registriert
- Erstellt die `/api` Gruppe und ruft alle spezialisierten Register-Funktionen auf

### `users.go`
- **RegisterUserRoutes**: Alle User-bezogenen Endpoints
- Endpoints: `GET /users`, `GET /users/active`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`

### `shifts.go`
- **RegisterShiftRoutes**: Alle Shift-bezogenen Endpoints
- Endpoints: `GET /shifts`, `GET /shifts/:id`, `POST /shifts`, `PUT /shifts/:id`, `DELETE /shifts/:id`, `GET /users/:user_id/shifts`

### `schedules.go`
- **RegisterScheduleRoutes**: Alle Schedule-bezogenen Endpoints
- Endpoints: `GET /schedules`, `GET /schedules/active`, `GET /schedules/:id`, `POST /schedules`, `PUT /schedules/:id`, `DELETE /schedules/:id`

### `general.go`
- **RegisterGeneralRoutes**: Allgemeine API-Endpoints
- Endpoints: `GET /message`

## Verwendung

```go
import "schichtplaner/routes"

// In main.go
e := echo.New()
routes.RegisterAPIRoutes(e)
```

## Vorteile der Aufteilung

1. **Bessere Übersichtlichkeit**: Jede Ressource hat ihre eigene Datei
2. **Einfachere Wartung**: Änderungen an User-Routen betreffen nur `users.go`
3. **Bessere Testbarkeit**: Einzelne Routen-Gruppen können separat getestet werden
4. **Skalierbarkeit**: Neue Ressourcen können einfach als separate Datei hinzugefügt werden

## Hinzufügen neuer Routen

Um neue Routen hinzuzufügen:

1. Erstelle eine neue Datei `routes/[resource].go`
2. Implementiere `Register[Resource]Routes(api *echo.Group)`
3. Füge den Aufruf in `routes.go` hinzu

Beispiel:
```go
// routes/example.go
func RegisterExampleRoutes(api *echo.Group) {
    api.GET("/examples", handlers.GetExamples)
    api.POST("/examples", handlers.CreateExample)
}

// In routes.go hinzufügen:
RegisterExampleRoutes(api)
``` 