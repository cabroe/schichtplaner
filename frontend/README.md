# Frontend - Schichtplaner

Das Frontend des Schichtplaner-Systems ist eine React-Anwendung mit TypeScript, Vite und Tabler UI.

## Technologie-Stack

- **React 18** mit TypeScript
- **Vite** für Build-Tool und Dev-Server
- **Tabler UI** für das Design-System
- **Font Awesome** für Icons
- **React Router** für Navigation
- **Zustand** für State Management
- **Vitest** für Tests

## Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
├── pages/             # Seiten-Komponenten
├── routes/            # Routing-Konfiguration
├── store/             # Zustand-Management
├── templates/         # Layout-Templates
├── utils/             # Hilfsfunktionen
└── App.tsx           # Haupt-App-Komponente
```

## Entwicklung

### Installation
```bash
cd frontend
yarn install
```

### Development-Server starten
```bash
yarn dev
```
Der Server läuft auf `http://localhost:5173`

### Build für Produktion
```bash
yarn build
```

### Tests ausführen
```bash
yarn test          # Unit-Tests
yarn test:ui       # Vitest UI
```

## Komponenten

### Layout-Komponenten
- **MainTemplate**: Haupt-Layout mit Sidebar und Header
- **SimpleTemplate**: Minimales Layout ohne Sidebar
- **PageHeader**: Dynamische Seiten-Header
- **Sidebar**: Navigation-Sidebar
- **Header**: Top-Header mit User-Dropdown

### UI-Komponenten
- **Modal**: Modal-Dialog-Komponente
- **Toast**: Toast-Benachrichtigungen
- **UserDropdown**: Benutzer-Menü
- **RecentActivities**: Letzte Aktivitäten
- **TicktacActions**: Aktionen für Ticktac

### Seiten
- **Dashboard**: Übersichtsseite
- **Settings**: Einstellungen
- **Times**: Zeiterfassung
- **NotFound**: 404-Seite

## Routing

Das Routing ist in `src/routes/routeConfig.ts` konfiguriert:

```typescript
export const routes = [
  {
    path: '/',
    element: <Dashboard />,
    header: DashboardHeader,
  },
  // Weitere Routen...
]
```

## State Management

Zustand wird für UI-State verwendet:

```typescript
// src/store/useUiStore.ts
interface UiStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
}
```

## API-Integration

Die Frontend-Komponenten kommunizieren mit dem Backend über REST-API:

- **Base URL**: `http://localhost:3000/api`
- **Endpoints**: Users, Shifts, Schedules
- **Format**: JSON mit Pagination

## Styling

- **Tabler CSS**: Haupt-Styling-Framework
- **Font Awesome**: Icons
- **Responsive Design**: Mobile-first Ansatz

## Testing

- **Vitest**: Test-Runner
- **React Testing Library**: Komponenten-Tests
- **Coverage**: Ziel >80% Testabdeckung

### Test-Beispiel
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
```

## Build & Deployment

### Development
```bash
yarn dev
```

### Production Build
```bash
yarn build
```
Generiert optimierte Dateien in `dist/`

### Docker
Das Frontend wird im Docker-Container gebaut und als statische Dateien serviert.

## Konfiguration

### Vite Config
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true
  }
}
```
