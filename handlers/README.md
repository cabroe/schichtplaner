# Handlers Package

Dieses Paket enthält alle HTTP-Handler für das Schichtplaner-System. Die Handler sind nach Ressourcen in separate Dateien aufgeteilt und implementieren die CRUD-Operationen für die API-Endpoints.

## Struktur



### `user.go`
- **GetUsers**: Gibt alle Benutzer mit Pagination zurück
- **GetUser**: Gibt einen spezifischen Benutzer zurück
- **CreateUser**: Erstellt einen neuen Benutzer
- **UpdateUser**: Aktualisiert einen bestehenden Benutzer
- **DeleteUser**: Löscht einen Benutzer (Soft Delete)
- **GetActiveUsers**: Gibt alle aktiven Benutzer zurück

### `shift.go`
- **GetShifts**: Gibt alle Schichten mit Pagination zurück
- **GetShift**: Gibt eine spezifische Schicht zurück
- **CreateShift**: Erstellt eine neue Schicht
- **UpdateShift**: Aktualisiert eine bestehende Schicht
- **DeleteShift**: Löscht eine Schicht (Soft Delete)
- **GetShiftsByUser**: Gibt alle Schichten eines Benutzers zurück

### `schedule.go`
- **GetSchedules**: Gibt alle Schichtpläne mit Pagination zurück
- **GetSchedule**: Gibt einen spezifischen Schichtplan zurück
- **CreateSchedule**: Erstellt einen neuen Schichtplan
- **UpdateSchedule**: Aktualisiert einen bestehenden Schichtplan
- **DeleteSchedule**: Löscht einen Schichtplan (Soft Delete)
- **GetActiveSchedules**: Gibt alle aktiven Schichtpläne zurück

## Gemeinsame Features

### Pagination
Alle List-Endpoints unterstützen Pagination mit den Query-Parametern:
- `page`: Seitennummer (Standard: 1)
- `page_size`: Anzahl Einträge pro Seite (Standard: 10, Max: 100)

### Response-Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

### Error-Handling
Alle Handler geben konsistente Fehler-Responses zurück:
```json
{
  "error": "Deutsche Fehlermeldung"
}
```

### HTTP-Statuscodes
- `200 OK`: Erfolgreiche GET/PUT-Operationen
- `201 Created`: Erfolgreiche POST-Operationen
- `400 Bad Request`: Ungültige Eingabedaten
- `404 Not Found`: Ressource nicht gefunden
- `500 Internal Server Error`: Server-Fehler

## Validierung

### User-Validierung
- Username und Email müssen eindeutig sein
- Email-Format wird validiert
- Required-Felder werden geprüft

### Shift-Validierung
- StartTime muss vor EndTime liegen
- UserID und ScheduleID müssen existieren
- BreakTime ist optional (Standard: 0)

### Schedule-Validierung
- StartDate muss vor EndDate liegen
- Name ist required
- IsActive ist optional (Standard: true)

## Beziehungen

### Preloading
Die Handler laden automatisch verknüpfte Daten:
- **GetUser**: Lädt `Shifts` mit
- **GetShift**: Lädt `User` und `Schedule` mit
- **GetSchedule**: Lädt `Shifts` mit `User` mit
- **GetShifts**: Lädt `User` und `Schedule` mit

### Soft Deletes
Alle Delete-Operationen verwenden Soft Deletes:
- Datensätze werden nicht physisch gelöscht
- `deleted_at` wird gesetzt
- Queries filtern automatisch gelöschte Datensätze

## Testing

Jeder Handler hat entsprechende Tests in `*_test.go` Dateien:
- Positive Testfälle (erfolgreiche Operationen)
- Negative Testfälle (Fehlerbehandlung)
- Validierungstests
- Pagination-Tests

### Test-Setup
```go
func setupTestDB() {
    // In-Memory SQLite für Tests
    database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    database.DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{})
}
```

## Verwendung

```go
import "schichtplaner/handlers"

// In routes/routes.go
api.GET("/users", handlers.GetUsers)
api.POST("/users", handlers.CreateUser)
```

## Hinzufügen neuer Handler

1. Erstelle eine neue Datei `handlers/[resource].go`
2. Implementiere CRUD-Funktionen mit konsistenter Signatur
3. Schreibe entsprechende Tests in `handlers/[resource]_test.go`
4. Registriere die Handler in `routes/[resource].go`

### Beispiel-Template
```go
func Get[Resource]s(c echo.Context) error {
    params := utils.GetPaginationParams(c)
    // Implementation
}

func Create[Resource](c echo.Context) error {
    var resource models.[Resource]
    if err := c.Bind(&resource); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{
            "error": "Ungültige Daten",
        })
    }
    // Implementation
}
``` 