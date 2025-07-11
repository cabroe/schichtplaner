# Schichtplaner

Ein modernes Schichtplanungs-Tool entwickelt mit Go, React und TypeScript.

## 🚀 Features

### 📊 Dashboard & Analytics
- **Interactive Charts**: Moderne Datenvisualisierung mit Chart.js
- **Real-time Metrics**: Live-Updates für Mitarbeiter und Schichten
- **Performance Tracking**: Bar, Line und Doughnut Charts für Analysen
- **Progressive Loading**: Sofortiges HTML-Rendering mit intelligenten Skeleton Loaders

### 👥 Mitarbeiterverwaltung
- **CRUD-Operationen**: Vollständige Mitarbeiterverwaltung mit Validierung
- **Pagination**: Effiziente Datendarstellung für große Datensätze
- **Avatar-System**: Automatische Initialen-Avatare
- **Status-Tracking**: Live-Status-Anzeigen für Mitarbeiter

### ⏰ Schichtplanung
- **Vollständige Schichtverwaltung**: Zeiterfassung mit Start/End-Zeiten
- **Visual Timeline**: Übersichtliche Darstellung der Schichtpläne
- **Auslastungsanalyse**: Automatische Berechnung der Arbeitsauslastung
- **Batch-Operations**: Effiziente Verwaltung mehrerer Schichten

### 📈 Berichtswesen & Export
- **Automatische Report-Generierung**: Dynamische Berichte für Schichten und Mitarbeiter
- **CSV-Export**: Datenexport für externe Analysen
- **Chart-Export**: Grafiken als Bilder exportierbar
- **Wöchentliche/Monatliche Übersichten**: Zeitbasierte Analysen

### 🎨 Moderne UI/UX
- **Responsive Dashboard**: Tabler UI Framework mit Bootstrap 5
- **Professional Design**: Moderne Karten-basierte Layouts
- **Dark/Light Theme**: Automatische Theme-Erkennung
- **Progressive Loading**: Kein Full-Page Loading, sofortiges Rendering
- **Micro-Interactions**: Smooth Animationen und Übergänge

### 🔧 Technische Features
- **REST API**: Vollständige RESTful API mit Echo Framework
- **Monitoring**: Prometheus Metrics mit Grafana Dashboard
- **Datenbank**: PostgreSQL mit pgAdmin Interface
- **Docker Support**: Vollständige Container-Orchestrierung
- **Environment-Config**: Sichere Konfiguration über Umgebungsvariablen
- **Performance-Optimiert**: Intelligente Cache-Headers für statische Assets mit umfassenden Tests
- **Echtzeit-Entwicklung**: Hot Reload für Frontend und Backend

## 🛠️ Technologie-Stack

### Backend
- **Go 1.24.4** - Moderne, performante Sprache
- **Echo v4** - Leichtgewichtiges Web Framework
- **go-playground/validator** - Request-Validierung
- **PostgreSQL** - Produktive Datenhaltung mit Pagination
- **In-Memory Storage** - Schnelle Datenhaltung für Entwicklung
- **Prometheus Metrics** - Application Performance Monitoring
- **Environment-Config** - Sichere Konfiguration mit .env Support

### Frontend
- **React 18** - Moderne UI-Bibliothek mit Hooks
- **TypeScript** - Vollständige Typsicherheit
- **Vite** - Schnelles Build-Tool mit HMR
- **Tabler UI** - Bootstrap 5-basiertes Dashboard Framework
- **React Router** - Client-seitige Navigation
- **Chart.js + react-chartjs-2** - Interaktive Datenvisualisierung
- **Progressive Loading** - Skeleton Loaders für optimale UX
- **FontAwesome** - Umfangreiche Icon-Bibliothek (lokal gehostet)

## 📋 Voraussetzungen

### Lokale Entwicklung
- **Go 1.21+**
- **Node.js 18+**
- **Yarn**

### Docker Setup
- **Docker**
- **Docker Compose**

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

### Environment-Konfiguration
```bash
# Kopiere .env.example zu .env und passe an
cp .env.example .env

# Setze mindestens SESSION_SECRET (32+ Zeichen)
# Siehe .env.example für alle verfügbaren Optionen
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
- **Dashboard**: http://localhost:5173 (Entwicklung) / http://localhost:3000 (Produktion)
- **Backend API**: http://localhost:3000/api
- **Interactive Charts**: Automatisch verfügbar im Dashboard
- **Prometheus Metrics**: http://localhost:9090
- **Grafana Dashboard**: http://localhost:3001

### Docker Setup
```bash
# Alle Services starten
docker-compose up -d

# Nur bestimmte Services
docker-compose up -d schichtplaner database
```

Docker Services verfügbar unter:
- **Schichtplaner**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **pgAdmin**: http://localhost:5050 (admin@schichtplaner.com/admin)
- **PostgreSQL**: localhost:5432 (user/password)

### Produktions-Build erstellen
```bash
make build
./bin/schichtplaner
```

## 📁 Projektstruktur

```
schichtplaner/
├── config/                  # Konfiguration
│   └── config.go           # Environment-basierte Konfiguration
├── handlers/                # HTTP Handler
│   ├── router.go           # Zentrale Route-Registrierung
│   ├── employees.go        # Mitarbeiter CRUD mit Pagination
│   ├── shifts.go           # Schicht CRUD mit Pagination
│   ├── reports.go          # Report-Generierung
│   ├── health.go           # Health Checks
│   └── *_test.go           # Umfassende Tests
├── models/                  # Datenmodelle
│   ├── models.go           # Struct-Definitionen mit Pagination
│   └── store.go            # In-Memory Storage mit Thread-Safety
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/     # UI Komponenten mit Skeleton Loaders
│   │   ├── pages/          # Dashboard mit Charts und Analytics
│   │   ├── assets/         # Lokale Assets (Fonts, Icons)
│   │   └── main.tsx        # App Entry Point
│   ├── frontend.go         # Static File Serving mit Cache-Headers
│   ├── public/             # Statische Assets
│   └── dist/               # Build Output mit optimierten Charts
├── monitoring/              # Monitoring & Database Config
│   ├── prometheus.yml      # Prometheus Konfiguration
│   ├── grafana/            # Grafana Setup
│   │   ├── dashboards/     # Vorkonfigurierte Dashboards
│   │   └── datasources/    # Prometheus Datasource
│   └── pgadmin/            # pgAdmin Konfiguration
├── templates/               # Go HTML Templates
├── bin/                     # Build Output
├── docker-compose.yml      # Docker Services
├── .env.example            # Environment-Variablen Template
├── .env                    # Development-Konfiguration
├── Makefile                # Build Scripts
└── main.go                 # Application Entry Point
```

## 🔧 Verfügbare Kommandos

```bash
# Entwicklung
make dev                    # Starte beide Server
make build                  # Produktions-Build
air                        # Go Hot Reload
cd frontend && yarn dev    # Frontend Dev Server

# Docker
docker-compose up -d        # Alle Services starten
docker-compose down         # Alle Services stoppen
docker-compose logs -f      # Logs verfolgen

# Tests
make test                   # Alle Tests (Frontend + Backend)
make test-frontend         # Frontend Tests (Lint + Build + Chart Components)
make test-backend          # Backend Tests
go test ./...              # Alle Go Tests
go test ./handlers/... -v  # Handler Tests (verbose)
go test ./frontend/... -v  # Frontend Static Cache Tests
cd frontend && yarn test   # Frontend Unit Tests (Dashboard + Charts)

# Build
go build -o ./bin/schichtplaner .     # Backend Build
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
GET    /api/employees           # Alle Mitarbeiter abrufen
GET    /api/employees?limit=10&offset=0  # Paginierte Mitarbeiter
POST   /api/employees           # Neuen Mitarbeiter erstellen
GET    /api/employees/:id       # Mitarbeiter abrufen
PUT    /api/employees/:id       # Mitarbeiter aktualisieren
DELETE /api/employees/:id       # Mitarbeiter löschen
```

**Pagination-Response:**
```json
{
  "data": [...],
  "total": 100,
  "limit": 10,
  "offset": 0,
  "has_more": true,
  "total_pages": 10
}
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
GET    /api/shifts              # Alle Schichten abrufen
GET    /api/shifts?limit=10&offset=0  # Paginierte Schichten
POST   /api/shifts              # Neue Schicht erstellen
GET    /api/shifts/:id          # Schicht abrufen
PUT    /api/shifts/:id          # Schicht aktualisieren
DELETE /api/shifts/:id          # Schicht löschen
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

#### Monitoring
```http
GET /metrics               # Prometheus Metrics
GET /api/health           # Application Health Check
```

## 🧪 Testing

Das Projekt verwendet Go's eingebautes Testing Framework mit umfassenden Tests:

```bash
# Alle Tests ausführen
go test ./...

# Tests mit Details
go test ./handlers/... -v

# Cache Header Tests
go test ./frontend/... -v

# Specific test
go test ./handlers -run TestCRUDEmployees -v
go test ./frontend -run TestStaticCacheHeaders -v
```

**Test Coverage:**
- ✅ Employee CRUD Operations
- ✅ Shift CRUD Operations  
- ✅ Dashboard Chart Components
- ✅ Progressive Loading States
- ✅ Skeleton Loader Components
- ✅ Pagination Testing
- ✅ **Static Cache Headers Testing** (JS/CSS: 1 Jahr, Bilder: 1 Monat, HTML: No-Cache)
- ✅ **ETag & Expires Headers** für optimale Browser-Caching
- ✅ **API Endpoint Cache-Exclusion** (keine Cache-Headers für /api/* und /metrics)
- ✅ Report Generation
- ✅ CSV Export
- ✅ Validation Testing
- ✅ Error Handling
- ✅ Chart.js Integration

## 📦 Deployment

### Lokale Produktion
```bash
make build
./bin/schichtplaner
```

### Docker Production
```bash
# Vollständiger Stack
docker-compose up -d

# Nur Anwendung
docker-compose up -d schichtplaner

# Mit Datenbank
docker-compose up -d schichtplaner database

# Mit Monitoring
docker-compose up -d schichtplaner prometheus grafana
```

### Monitoring Setup
Nach dem Start der Docker Services ist Monitoring verfügbar:
- **Prometheus**: http://localhost:9090 - Metrics Collection
- **Grafana**: http://localhost:3001 - Dashboard (admin/admin)
- **pgAdmin**: http://localhost:5050 - Database Management

Das Grafana Dashboard zeigt automatisch:
- HTTP Request Rate
- Response Times (50th/95th Percentile)  
- HTTP Status Code Distribution
- Application Performance Metrics
- Dashboard Chart Performance
- Frontend Loading States
- Real-time User Interactions

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
