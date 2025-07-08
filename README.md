# Schichtplaner

Ein modernes Schichtplanungs-Tool entwickelt mit Go, React und TypeScript.

## 🚀 Features

- **Mitarbeiterverwaltung**: CRUD-Operationen für Mitarbeiter mit Validierung
- **Schichtplanung**: Vollständige Schichtverwaltung mit Zeiterfassung
- **Berichtswesen**: Automatische Report-Generierung und CSV-Export
- **Moderne UI**: Responsive Dashboard mit Tabler UI Framework
- **REST API**: Vollständige RESTful API mit Echo Framework
- **Echtzeit-Entwicklung**: Hot Reload für Frontend und Backend

## 🛠️ Technologie-Stack

### Backend
- **Go 1.21** - Moderne, performante Sprache
- **Echo v4** - Leichtgewichtiges Web Framework
- **go-playground/validator** - Request-Validierung
- **In-Memory Storage** - Schnelle Datenhaltung für Entwicklung

### Frontend
- **React 18** - Moderne UI-Bibliothek
- **TypeScript** - Typsicherheit
- **Vite** - Schnelles Build-Tool
- **Tabler UI** - Bootstrap 5-basiertes Dashboard Framework
- **React Router** - Client-seitige Navigation

## 📋 Voraussetzungen

- **Go 1.21+**
- **Node.js 18+**
- **Yarn**

## 🚀 Schnellstart

### Repository klonen
```bash
git clone <repository-url>
cd schichtplaner
```

### Abhängigkeiten installieren
```bash
# Backend
go mod tidy

# Frontend
cd frontend
yarn install
cd ..
```

### Entwicklung starten
```bash
# Beide Server gleichzeitig starten
make dev

# Oder einzeln:
# Backend
air

# Frontend (in separatem Terminal)
cd frontend && yarn dev
```

Die Anwendung ist dann verfügbar unter:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Produktions-Build**: http://localhost:3000

### Produktions-Build erstellen
```bash
make build
./bin/go-vite
```

## 📁 Projektstruktur

```
schichtplaner/
├── handlers/                 # HTTP Handler
│   ├── router.go            # Zentrale Route-Registrierung
│   ├── employees.go         # Mitarbeiter CRUD
│   ├── shifts.go           # Schicht CRUD
│   ├── reports.go          # Report-Generierung
│   ├── health.go           # Health Checks
│   └── *_test.go           # Tests
├── models/                  # Datenmodelle
│   ├── models.go           # Struct-Definitionen
│   └── store.go            # In-Memory Storage
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # UI Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   └── main.tsx       # App Entry Point
│   ├── public/            # Statische Assets
│   └── dist/              # Build Output
├── templates/             # Go HTML Templates
├── bin/                   # Build Output
├── Makefile              # Build Scripts
└── main.go               # Application Entry Point
```

## 🔧 Verfügbare Kommandos

```bash
# Entwicklung
make dev                    # Starte beide Server
make build                  # Produktions-Build
air                        # Go Hot Reload
cd frontend && yarn dev    # Frontend Dev Server

# Tests
go test ./...              # Alle Tests
go test ./handlers/... -v  # Handler Tests (verbose)

# Build
go build -o ./bin/go-vite .     # Backend Build
cd frontend && yarn build       # Frontend Build
cd frontend && yarn lint        # Frontend Linting
```

## 📚 API Dokumentation

### Basis-URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
GET /api/message
```

#### Mitarbeiter
```http
GET    /api/employees      # Alle Mitarbeiter abrufen
POST   /api/employees      # Neuen Mitarbeiter erstellen
GET    /api/employees/:id  # Mitarbeiter abrufen
PUT    /api/employees/:id  # Mitarbeiter aktualisieren
DELETE /api/employees/:id  # Mitarbeiter löschen
```

**Mitarbeiter Datenstruktur:**
```json
{
  "id": 1,
  "name": "Max Mustermann",
  "email": "max@example.com",
  "position": "Developer",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

#### Schichten
```http
GET    /api/shifts      # Alle Schichten abrufen
POST   /api/shifts      # Neue Schicht erstellen
GET    /api/shifts/:id  # Schicht abrufen
PUT    /api/shifts/:id  # Schicht aktualisieren
DELETE /api/shifts/:id  # Schicht löschen
```

**Schicht Datenstruktur:**
```json
{
  "id": 1,
  "employee_id": 1,
  "start_time": "2024-01-01T09:00:00Z",
  "end_time": "2024-01-01T17:00:00Z",
  "position": "Developer",
  "notes": "Reguläre Schicht",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

#### Berichte
```http
GET /api/reports           # Alle Berichte abrufen
GET /api/reports/shifts    # Schicht-Berichte
GET /api/reports/employees # Mitarbeiter-Berichte
GET /api/reports/export?type=shifts|employees  # CSV-Export
```

## 🧪 Testing

Das Projekt verwendet Go's eingebautes Testing Framework mit umfassenden Tests:

```bash
# Alle Tests ausführen
go test ./...

# Tests mit Details
go test ./handlers/... -v

# Specific test
go test ./handlers -run TestCRUDEmployees -v
```

**Test Coverage:**
- ✅ Employee CRUD Operations
- ✅ Shift CRUD Operations  
- ✅ Report Generation
- ✅ CSV Export
- ✅ Validation Testing
- ✅ Error Handling

## 📦 Deployment

### Lokale Produktion
```bash
make build
./bin/go-vite
```

### Docker (zukünftig)
```bash
docker build -t schichtplaner .
docker run -p 3000:3000 schichtplaner
```

## 🔧 Entwicklung

### Code Style
- **Go**: Standard Go Konventionen, Echo Framework Patterns
- **TypeScript**: Strict Mode, funktionale React Komponenten
- **Testing**: Comprehensive tests mit Validierung

### Hot Reload
- **Backend**: Air für automatischen Neustart
- **Frontend**: Vite für sofortiges HMR

### Debugging
- Logs werden in der Konsole ausgegeben
- Echo Logger Middleware für HTTP Requests
- Strukturierte Fehlerbehandlung

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne eine Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz - siehe [LICENSE](LICENSE) Datei für Details.

## 👥 Autoren

- **Development Team** - *Initial work*

## 📞 Support

Bei Fragen oder Problemen erstelle bitte ein Issue im Repository.
