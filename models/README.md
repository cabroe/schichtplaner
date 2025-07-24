# Models

Dieses Verzeichnis enthält alle Datenmodelle der Anwendung.

## Verfügbare Models

### User
Repräsentiert einen Benutzer im System.

### Schedule
Repräsentiert einen Schichtplan.

### Shift
Repräsentiert eine einzelne Schicht.

### ShiftType
Repräsentiert einen Schichttyp (z.B. Frühschicht, Spätschicht, Nachtschicht).

#### Felder:
- `Name` (string, required, unique): Name des Schichttyps
- `Description` (string): Beschreibung des Schichttyps
- `Color` (string): Hex-Farbe für die UI-Darstellung (Standard: #3B82F6)
- `DefaultStart` (time.Time): Standard-Startzeit
- `DefaultEnd` (time.Time): Standard-Endzeit
- `DefaultBreak` (int): Standard-Pausenzeit in Minuten (Standard: 30)
- `IsActive` (bool): Gibt an, ob der Schichttyp aktiv ist (Standard: true)
- `SortOrder` (int): Sortierreihenfolge (Standard: 0)
- `MinDuration` (int): Mindestdauer in Minuten (Standard: 0)
- `MaxDuration` (int): Maximaldauer in Minuten (Standard: 0)

#### Beziehungen:
- Eine Schicht kann optional einem Schichttyp zugeordnet werden (ShiftTypeID in Shift)

### Team
Repräsentiert ein Team im System.

#### Felder:
- `Name` (string, required, unique): Name des Teams
- `Description` (string): Beschreibung des Teams
- `Color` (string): Hex-Farbe für die UI-Darstellung (Standard: #6B7280)
- `IsActive` (bool): Gibt an, ob das Team aktiv ist (Standard: true)
- `SortOrder` (int): Sortierreihenfolge (Standard: 0)

#### Beziehungen:
- Ein Team kann mehrere Benutzer haben (Users)
- Ein Benutzer kann optional einem Team angehören (TeamID in User)

### ShiftTemplate
Repräsentiert eine Schichtvorlage mit 7 Tagen.

#### Felder:
- `Name` (string, required, unique): Name der Schichtvorlage
- `Description` (string): Beschreibung der Schichtvorlage
- `Color` (string): Hex-Farbe für die UI-Darstellung (Standard: #6B7280)
- `IsActive` (bool): Gibt an, ob die Schichtvorlage aktiv ist (Standard: true)
- `SortOrder` (int): Sortierreihenfolge (Standard: 0)

#### Wochentage mit Schichttypen:
- `MondayShiftTypeID` (*uint): ID des Schichttyps für Montag (optional)
- `TuesdayShiftTypeID` (*uint): ID des Schichttyps für Dienstag (optional)
- `WednesdayShiftTypeID` (*uint): ID des Schichttyps für Mittwoch (optional)
- `ThursdayShiftTypeID` (*uint): ID des Schichttyps für Donnerstag (optional)
- `FridayShiftTypeID` (*uint): ID des Schichttyps für Freitag (optional)
- `SaturdayShiftTypeID` (*uint): ID des Schichttyps für Samstag (optional)
- `SundayShiftTypeID` (*uint): ID des Schichttyps für Sonntag (optional)

#### Beziehungen:
- Jeder Wochentag kann optional einem Schichttyp zugeordnet werden
- Alle Schichttypen werden über die entsprechenden Foreign Keys verknüpft 