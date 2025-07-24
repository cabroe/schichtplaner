# HTTP API Tests für Schichtplaner

Diese Dateien enthalten HTTP-Requests zum Testen der Schichtplaner API in VS Code.

## Voraussetzungen

1. **VS Code REST Client Extension**: Installiere die Extension "REST Client" von Huachao Mao
2. **Server läuft**: Stelle sicher, dass der Schichtplaner-Server auf Port 3000 läuft

## Verwendung

### 1. Extension installieren
Installiere die REST Client Extension in VS Code:
- Öffne VS Code
- Gehe zu Extensions (Ctrl+Shift+X)
- Suche nach "REST Client"
- Installiere die Extension von Huachao Mao

### 2. Server starten
Starte den Schichtplaner-Server:
```bash
go run main.go
```

### 3. Tests ausführen
- Öffne eine der `.http` Dateien in VS Code
- Klicke auf "Send Request" über jedem Request
- Oder verwende `Ctrl+Alt+R` um alle Requests in einer Datei auszuführen

## Dateien Übersicht

### `test-api.http`
Vollständige Übersicht aller API-Endpunkte in einer Datei.

### `error-tests.http`
Spezielle Tests für Error-Behandlung:
- 404 Not Found Tests
- 405 Method Not Allowed Tests
- 400 Bad Request Tests
- Validierungsfehler Tests

## Error-Behandlung

Die API implementiert eine benutzerdefinierte Error-Behandlung:

### 404 Not Found
```json
{
  "error": "API-Endpunkt nicht gefunden",
  "message": "Der angeforderte Endpunkt existiert nicht",
  "path": "/api/nonexistent",
  "method": "GET",
  "status": 404
}
```

### 405 Method Not Allowed
```json
{
  "error": "HTTP-Methode nicht erlaubt",
  "message": "Die verwendete HTTP-Methode ist für diesen Endpunkt nicht erlaubt",
  "path": "/api/health",
  "method": "POST",
  "allowed_methods": "GET",
  "status": 405
}
```

### 400 Bad Request
```json
{
  "error": "Ungültige Benutzer-ID"
}
```

## Test-Reihenfolge

Für vollständige Tests empfiehlt sich folgende Reihenfolge:

1. **Error Tests**: `error-tests.http` - Teste Error-Behandlung
2. **Health Check**: `test-api.http` - Prüfe Server-Status
3. **Basis-Daten erstellen**:
   - Users → Teams → Shift Types
4. **Abhängige Daten**:
   - Shift Templates → Schedules → Shifts

## Beispiel-Responses

### Erfolgreicher Health Check
```json
{
  "status": "ok"
}
```

### 404 Error für nicht existierende Route
```json
{
  "error": "API-Endpunkt nicht gefunden",
  "message": "Der angeforderte Endpunkt existiert nicht",
  "path": "/api/nonexistent",
  "method": "GET",
  "status": 404
}
```

### 405 Error für falsche HTTP-Methode
```json
{
  "error": "HTTP-Methode nicht erlaubt",
  "message": "Die verwendete HTTP-Methode ist für diesen Endpunkt nicht erlaubt",
  "path": "/api/health",
  "method": "POST",
  "allowed_methods": "GET",
  "status": 405
}
```

## Error-Test-Szenarien

### 404 Tests
- Nicht existierende API-Routen
- Nicht existierende Ressourcen-IDs
- Falsche Pfade

### 405 Tests
- Falsche HTTP-Methoden für Endpunkte
- POST statt GET für Health Check
- PUT statt GET für Collections

### 400 Tests
- Ungültige Parameter-Typen
- Fehlende erforderliche Felder
- Ungültige Datenformate

### Validierungsfehler
- Ungültige E-Mail-Adressen
- Ungültige Datums-/Zeitformate
- Ungültige Farbcodes
- Logische Fehler (Start nach Ende)

## Tipps

### Response-Viewing
- Responses werden in einem separaten Tab angezeigt
- JSON-Responses werden automatisch formatiert
- Status-Codes werden farblich hervorgehoben

### Error-Debugging
- Prüfe den `status` Code in der Response
- Schau dir die `error` und `message` Felder an
- Verwende die `path` und `method` Informationen für Debugging

### Environment Variables
Du kannst Umgebungsvariablen definieren:
```http
@baseUrl = http://localhost:3000/api
@authToken = your-auth-token

GET {{baseUrl}}/users
Authorization: Bearer {{authToken}}
```

## Troubleshooting

### Server nicht erreichbar
- Prüfe, ob der Server auf Port 3000 läuft
- Prüfe Firewall-Einstellungen
- Prüfe, ob der Port nicht von anderen Anwendungen belegt ist

### 404 Fehler für bekannte Routen
- Prüfe, ob alle Routen korrekt registriert sind
- Prüfe die Route-Reihenfolge in `routes.go`
- Prüfe, ob der Server neu gestartet wurde

### 405 Fehler
- Prüfe die HTTP-Methode in der Request
- Prüfe, ob der Endpunkt die Methode unterstützt
- Schau dir die `allowed_methods` in der Response an

### Validierungsfehler
- Prüfe die Request-Body-Struktur
- Stelle sicher, dass alle erforderlichen Felder vorhanden sind
- Prüfe Datums- und Zeitformate
- Prüfe E-Mail-Format und andere Validierungen

## Nützliche VS Code Einstellungen

Füge diese Einstellungen zu deiner `settings.json` hinzu:

```json
{
  "rest-client.environmentVariables": {
    "$shared": {
      "version": "1.0.0"
    },
    "local": {
      "baseUrl": "http://localhost:3000/api"
    },
    "production": {
      "baseUrl": "https://your-production-url.com/api"
    }
  },
  "rest-client.defaultHeaders": {
    "Content-Type": "application/json"
  },
  "rest-client.responseView": "response"
}
``` 