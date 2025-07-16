# Models Package

Dieses Paket enthält die Datenmodelle für das Schichtplaner-System.

## Struktur

Die Modelle sind in separate Dateien aufgeteilt für bessere Wartbarkeit:

### `user.go`
- **User**: Repräsentiert einen Benutzer im System
- Felder: Username, Email, FirstName, LastName, IsActive, Role
- Beziehungen: HasMany Shifts

### `shift.go`
- **Shift**: Repräsentiert eine einzelne Schicht
- Felder: UserID, StartTime, EndTime, BreakTime, Description, IsActive, ScheduleID
- Beziehungen: BelongsTo User, BelongsTo Schedule

### `schedule.go`
- **Schedule**: Repräsentiert einen Schichtplan
- Felder: Name, Description, StartDate, EndDate, IsActive
- Beziehungen: HasMany Shifts

## Verwendung

```go
import "schichtplaner/models"

// User erstellen
user := models.User{
    Username:  "max.mustermann",
    Email:     "max@example.com",
    FirstName: "Max",
    LastName:  "Mustermann",
    IsActive:  true,
    Role:      "user",
}

// Shift erstellen
shift := models.Shift{
    UserID:      1,
    StartTime:   time.Now(),
    EndTime:     time.Now().Add(8 * time.Hour),
    BreakTime:   30, // 30 Minuten Pause
    Description: "Frühschicht",
    IsActive:    true,
    ScheduleID:  1,
}

// Schedule erstellen
schedule := models.Schedule{
    Name:        "Januar 2024",
    Description: "Schichtplan für Januar",
    StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
    EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
    IsActive:    true,
}
```

## Datenbank-Migration

Alle Modelle verwenden GORM und werden automatisch migriert:

```go
// In database/database.go
DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{})
```

## Beziehungen

- **User** → **Shift**: Ein Benutzer kann mehrere Schichten haben
- **Schedule** → **Shift**: Ein Schichtplan kann mehrere Schichten enthalten
- **Shift** → **User**: Jede Schicht gehört zu einem Benutzer
- **Shift** → **Schedule**: Jede Schicht gehört zu einem Schichtplan 