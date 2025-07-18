# Frontend-Struktur - Schichtplaner

Diese Dokumentation beschreibt die neue, modulare Frontend-Struktur des Schichtplaner-Systems, inspiriert von Kimai's bewährten Praktiken.

## 📁 Ordnerstruktur

```
src/
├── components/          # React-Komponenten
├── contexts/           # React Context für globalen Zustand
├── hooks/              # Custom React Hooks
├── pages/              # Seiten-Komponenten
├── routes/             # Routing-Konfiguration
├── services/           # API-Services und Business Logic
├── store/              # Zustandsmanagement (Zustand)
├── templates/          # Layout-Templates
├── types/              # TypeScript Type-Definitionen
├── utils/              # Utility-Funktionen
└── assets/             # Statische Assets
```

## 🏗️ Architektur-Prinzipien

### 1. **Separation of Concerns**
- **Services**: API-Kommunikation und Business Logic
- **Hooks**: Wiederverwendbare React-Logik
- **Components**: UI-Komponenten
- **Types**: TypeScript-Definitionen

### 2. **Modulare Struktur**
- Jedes Modul hat eine klare Verantwortlichkeit
- Services sind nach Domänen organisiert (auth, users, schedules, shifts)
- Hooks bieten wiederverwendbare Logik

### 3. **Type Safety**
- Vollständige TypeScript-Unterstützung
- Strenge Typisierung für alle API-Calls
- Interface-Definitionen für alle Datenstrukturen

## 🔧 Services

### API-Service (`services/api.ts`)
Zentraler HTTP-Client mit:
- Automatische Token-Verwaltung
- Error-Handling
- Request/Response-Interceptors
- Pagination-Support

### Auth-Service (`services/auth.ts`)
Authentifizierung und Autorisierung:
- Login/Logout
- Token-Management
- Permission-Checking
- User-Session-Management

### Domain-Services
- **UserService**: Benutzer-Management
- **ScheduleService**: Schichtplan-Management
- **ShiftService**: Schicht-Management

## 🎣 Custom Hooks

### API-Hooks (`hooks/useApi.ts`)
```typescript
// Verwendung
const { data, loading, error, execute } = useApi(api.getUsers);
const { data, loading, error, execute } = usePost(api.createUser);
```

### Utility-Hooks
- **useLocalStorage**: Persistente Daten im Browser
- **useDebounce**: Debounced Werte für Suchfunktionen

## 📝 Types

### Grundlegende Types (`types/index.ts`)
- **User**: Benutzer-Daten
- **Schedule**: Schichtplan-Daten
- **Shift**: Schicht-Daten
- **NavigationItem**: Navigation-Konfiguration
- **ApiResponse**: API-Antworten
- **Form-Types**: Formular-Daten

## 🛠️ Utilities

### Date-Utils (`utils/dateUtils.ts`)
- Datum-Formatierung
- Zeit-Berechnungen
- Relative Zeit-Anzeige
- Datumsbereich-Validierung

### Validation-Utils (`utils/validation.ts`)
- E-Mail-Validierung
- Passwort-Validierung
- Datum-Validierung
- Benutzerfreundliche Fehlermeldungen

## 🎨 Komponenten-Struktur

### Layout-Komponenten
- **PageLayout**: Haupt-Layout mit Sidebar und Header
- **PageHeader**: Seiten-Header mit Breadcrumbs und Actions
- **PageBody**: Haupt-Inhaltsbereich
- **Footer**: Seiten-Footer

### UI-Komponenten
- **Modal**: Modal-Dialoge
- **Toast**: Benachrichtigungen
- **DataTable**: Tabellen-Komponente
- **ContextMenu**: Kontext-Menüs

## 🔄 State Management

### Context API
- **AuthContext**: Authentifizierungs-Zustand
- **UI-Store**: UI-Zustand (Modals, Toasts, etc.)

### Local State
- Komponenten-spezifischer Zustand mit useState
- Komplexe Logik in Custom Hooks

## 🚀 Best Practices

### 1. **Service-Pattern**
```typescript
// Services kapseln API-Logik
const users = await userService.getUsers();
const schedule = await scheduleService.createSchedule(data);
```

### 2. **Hook-Pattern**
```typescript
// Hooks kapseln React-Logik
const { data, loading, error } = useApi(api.getUsers);
const [value, setValue] = useLocalStorage('key', defaultValue);
```

### 3. **Type-Safety**
```typescript
// Vollständige Typisierung
interface UserForm {
  username: string;
  email: string;
  role: UserRole;
}
```

### 4. **Error-Handling**
```typescript
// Konsistente Fehlerbehandlung
try {
  const result = await api.createUser(userData);
} catch (error) {
  // Standardisierte Fehlerbehandlung
}
```

## 📋 Nächste Schritte

1. **Komponenten-Migration**: Bestehende Komponenten in neue Struktur überführen
2. **Service-Integration**: API-Services mit Backend verbinden
3. **Type-Erweiterung**: Weitere TypeScript-Definitionen hinzufügen
4. **Testing**: Unit-Tests für Services und Hooks
5. **Documentation**: Komponenten-Dokumentation mit Storybook

## 🔗 Verwandte Dateien

- `package.json`: Dependencies und Scripts
- `tsconfig.json`: TypeScript-Konfiguration
- `vite.config.ts`: Build-Konfiguration
- `src/main.tsx`: App-Einstiegspunkt 