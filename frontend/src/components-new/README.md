# Neue Komponenten-Bibliothek

Diese Bibliothek enthält moderne, wiederverwendbare React-Komponenten für das Schichtplaner-Projekt.

## Struktur

```
components-new/
├── ui/                 # Grundlegende UI-Komponenten
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Container.tsx
│   ├── Divider.tsx
│   ├── Icon.tsx
│   ├── LoadingSpinner.tsx
│   ├── Tooltip.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── ProgressBar.tsx
│   └── Toast.tsx
├── forms/              # Formular-Komponenten
│   ├── FormField.tsx
│   ├── FormSection.tsx
│   ├── FormActions.tsx
│   ├── ValidationMessage.tsx
│   ├── DatePicker.tsx
│   ├── Select.tsx
│   └── Checkbox.tsx
├── tables/             # Tabellen-Komponenten
│   ├── Table.tsx
│   ├── TableBody.tsx
│   ├── TableCell.tsx
│   ├── TableHeader.tsx
│   ├── TableRow.tsx
│   └── DataTable.tsx
├── shift-planning/     # Schichtplanungs-spezifische Komponenten
│   ├── ShiftGrid.tsx
│   ├── ShiftCell.tsx
│   ├── ShiftControls.tsx
│   ├── ShiftLegend.tsx
│   ├── ShiftSummary.tsx
│   └── ShiftBadge.tsx
├── layout/             # Layout-Komponenten
│   ├── ContentArea.tsx
│   ├── HeaderLayout.tsx
│   ├── PageLayout.tsx
│   ├── SidebarLayout.tsx
│   └── PageHeader.tsx
├── navigation/         # Navigation-Komponenten
│   ├── Breadcrumb.tsx
│   ├── Pagination.tsx
│   └── TabNavigation.tsx
├── feedback/           # Feedback-Komponenten
│   └── Alert.tsx
└── index.ts           # Zentrale Export-Datei
```

## Verwendung

### Import aller Komponenten
```typescript
import { Button, Card, FormField, ShiftGrid, Modal, Badge, DataTable } from '../components-new';
```

### Import spezifischer Kategorien
```typescript
import { Button, Card, Modal, Badge, Avatar, ProgressBar, Toast } from '../components-new/ui';
import { FormField, FormActions, Select, Checkbox } from '../components-new/forms';
import { DataTable } from '../components-new/tables';
import { ShiftGrid, ShiftCell, ShiftBadge } from '../components-new/shift-planning';
import { PageHeader, PageLayout } from '../components-new/layout';
```

## Komponenten-Übersicht

### UI-Komponenten

#### Button
Moderne Button-Komponente mit verschiedenen Varianten und Größen.

```typescript
<Button variant="primary" size="md" onClick={handleClick}>
  Klick mich
</Button>
```

#### Modal
Vollständige Modal-Komponente mit Portal-Rendering und Accessibility.

```typescript
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Beispiel Modal"
  size="lg"
>
  <p>Modal-Inhalt</p>
</Modal>
```

#### Badge
Flexible Badge-Komponente für Status-Anzeigen.

```typescript
<Badge variant="success" size="md">
  Aktiv
</Badge>
```

#### Avatar
Avatar-Komponente mit Bild oder Fallback-Initialen.

```typescript
<Avatar
  src="/path/to/image.jpg"
  fallback="MM"
  size="lg"
  alt="Max Mustermann"
/>
```

#### ProgressBar
Fortschrittsbalken mit verschiedenen Varianten.

```typescript
<ProgressBar
  value={75}
  max={100}
  variant="success"
  showLabel
/>
```

#### Dropdown
Allgemeine Dropdown-Menü-Komponente basierend auf Bootstrap.

```typescript
<Dropdown
  trigger="Aktionen"
  items={[
    { id: 'edit', label: 'Bearbeiten', icon: 'fas fa-edit', onClick: handleEdit },
    { id: 'delete', label: 'Löschen', icon: 'fas fa-trash', onClick: handleDelete },
    { id: 'divider', divider: true },
    { id: 'export', label: 'Exportieren', icon: 'fas fa-download', onClick: handleExport }
  ]}
  variant="primary"
  align="end"
/>
```

#### UserDropdown
Spezialisierte Dropdown-Komponente für Benutzer-Menüs.

```typescript
<UserDropdown
  user={{
    id: 1,
    name: 'Max Mustermann',
    email: 'max@example.com',
    avatar: '/path/to/avatar.jpg',
    role: 'Administrator'
  }}
  items={[
    { id: 'profile', label: 'Profil', icon: 'fas fa-user', onClick: handleProfile },
    { id: 'settings', label: 'Einstellungen', icon: 'fas fa-cog', onClick: handleSettings },
    { id: 'divider', divider: true },
    { id: 'logout', label: 'Abmelden', icon: 'fas fa-sign-out-alt', onClick: handleLogout }
  ]}
/>
```
  variant="success"
  showLabel
  striped
  animated
/>
```

#### Label
Flexible Label-Komponente für Status-Anzeigen und Tags.

```typescript
<Label variant="success" size="md">
  Aktiv
</Label>

<Label variant="danger" outline dot>
  Fehler
</Label>
```

#### UserLabel
Spezialisierte Label-Komponente für Benutzer mit Avatar und Status.

```typescript
<UserLabel
  user={{
    id: 1,
    displayName: 'Max Mustermann',
    color: '#007bff',
    enabled: true,
    avatar: '/path/to/avatar.jpg'
  }}
  showAvatar
  showStatus
/>
```

#### Card
Erweiterte Card-Komponente mit Tools, Collapsible und verschiedenen Varianten.

```typescript
<Card
  title="Benutzer Details"
  subtitle="Verwaltung von Benutzerinformationen"
  tools={[
    { id: 'edit', icon: 'fas fa-edit', title: 'Bearbeiten', onClick: handleEdit },
    { id: 'delete', icon: 'fas fa-trash', title: 'Löschen', onClick: handleDelete }
  ]}
  collapsible
  variant="primary"
>
  <p>Card-Inhalt hier...</p>
</Card>
```

#### Toast
Toast-Benachrichtigungen mit automatischem Ausblenden.

```typescript
<Toast
  show={showToast}
  onClose={() => setShowToast(false)}
  type="success"
  title="Erfolg"
  message="Aktion erfolgreich ausgeführt"
  autoHide={5000}
/>
```

### Form-Komponenten

#### Select
Erweiterte Select-Komponente mit Gruppierung und Suche.

```typescript
<Select
  name="category"
  value={selectedCategory}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2', group: 'Gruppe A' }
  ]}
  onChange={setSelectedCategory}
  searchable
/>
```

#### Checkbox
Checkbox-Komponente mit Switch- und Radio-Style.

```typescript
<Checkbox
  name="active"
  checked={isActive}
  onChange={setIsActive}
  label="Benutzer ist aktiv"
  switch
/>
```

#### SelectDropdown
Erweiterte Select-Dropdown-Komponente mit Suche und Gruppierung.

```typescript
<SelectDropdown
  name="category"
  value={selectedCategory}
  options={[
    { value: 'tech', label: 'Technologie' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' }
  ]}
  placeholder="Kategorie wählen"
  searchable
  clearable
  onChange={setSelectedCategory}
/>

// Mit Gruppierung
<SelectDropdown
  name="country"
  value={selectedCountry}
  options={[
    {
      label: 'Europa',
      options: [
        { value: 'de', label: 'Deutschland' },
        { value: 'at', label: 'Österreich' }
      ]
    },
    {
      label: 'Amerika',
      options: [
        { value: 'us', label: 'USA' },
        { value: 'ca', label: 'Kanada' }
      ]
    }
  ]}
  multiple
  searchable
  onChange={setSelectedCountries}
/>
```

### Tabellen-Komponenten

#### DataTable
Vollständige Daten-Tabelle mit Sortierung, Pagination und Auswahl.

```typescript
<DataTable
  data={users}
  columns={[
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'E-Mail' },
    { key: 'status', title: 'Status', render: (value) => <Badge variant="success">{value}</Badge> }
  ]}
  pagination={{
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    onPageChange: setPage
  }}
  sorting={{
    sortBy: 'name',
    sortDirection: 'asc',
    onSort: handleSort
  }}
  selection={{
    selectedRows: selectedUsers,
    onSelectionChange: setSelectedUsers,
    rowKey: 'id'
  }}
/>
```

#### Input
Einfache Input-Komponente für verschiedene Eingabetypen.

```typescript
<Input
  name="email"
  type="email"
  label="E-Mail-Adresse"
  placeholder="ihre@email.de"
  required
  onChange={setEmail}
/>
```

#### SearchForm
Suchformular-Komponente mit verschiedenen Feldtypen.

```typescript
<SearchForm
  fields={[
    { name: 'search', type: 'text', label: 'Suche', placeholder: 'Suchen...' },
    { name: 'category', type: 'select', label: 'Kategorie', options: categoryOptions },
    { name: 'dateRange', type: 'daterange', label: 'Zeitraum' }
  ]}
  onSubmit={handleSearch}
  onReset={handleReset}
  loading={isLoading}
/>
```

### Tabellen-Komponenten

#### Table
Erweiterte Tabellen-Komponente mit Sortierung und verschiedenen Stilen.

```typescript
<Table
  columns={[
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'E-Mail' },
    { key: 'status', title: 'Status', render: (value) => <Badge variant="success">{value}</Badge> }
  ]}
  data={users}
  sortable
  sortBy="name"
  sortDirection="asc"
  onSort={handleSort}
  hover
  striped
  onRowClick={handleRowClick}
/>
```

### Schichtplanungs-Komponenten

#### ShiftBadge
Spezielle Badge-Komponente für Schicht-Typen.

```typescript
<ShiftBadge
  shiftType="F"
  size="md"
  tooltip="Frühschicht"
/>
```

### Layout-Komponenten

#### PageHeader
Seiten-Header mit Titel, Breadcrumb und Aktionen.

```typescript
<PageHeader
  title="Benutzerverwaltung"
  subtitle="Verwalten Sie Benutzer und Berechtigungen"
  breadcrumb={[
    { label: 'Dashboard', href: '/' },
    { label: 'Benutzer', active: true }
  ]}
  actions={<Button variant="primary">Neuer Benutzer</Button>}
  status={<Badge variant="success">Online</Badge>}
/>
```

## Design-System

Alle Komponenten basieren auf:
- **Tabler.io** Design-System
- **Bootstrap 5** CSS-Framework
- **Tabler Icons** für Icons
- Konsistente Farbpalette und Typografie

## Best Practices

1. **Konsistente Props**: Alle Komponenten verwenden ähnliche Prop-Strukturen
2. **TypeScript**: Vollständige TypeScript-Unterstützung mit exportierten Typen
3. **Accessibility**: ARIA-Attribute und Keyboard-Navigation
4. **Responsive**: Mobile-first Design-Ansatz
5. **Performance**: React.memo für optimierte Rendering-Performance
6. **Portal-Rendering**: Modals und Toasts verwenden React Portals

## Migration von alten Komponenten

Die neuen Komponenten sind als Ersatz für die bestehenden Komponenten in `/components/` gedacht. Sie bieten:

- Bessere TypeScript-Unterstützung
- Konsistentere API
- Moderne React-Patterns
- Verbesserte Performance
- Bessere Accessibility
- Portal-Rendering für Overlays

## Entwicklung

### Neue Komponente hinzufügen

1. Komponente in entsprechendem Verzeichnis erstellen
2. Export in `index.ts` der Kategorie hinzufügen
3. Haupt-Export in `/index.ts` aktualisieren
4. Typen in `/index.ts` exportieren
5. Dokumentation in dieser README ergänzen

### Testing

Alle Komponenten sollten mit entsprechenden Tests versehen werden:

```typescript
// Komponente.test.tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Verfügbare Typen

Alle Komponenten-Typen sind über die Haupt-Export-Datei verfügbar:

```typescript
import type { 
  ModalProps, 
  BadgeProps, 
  AvatarProps, 
  ProgressBarProps, 
  ToastProps,
  SelectProps,
  CheckboxProps,
  DataTableProps,
  ShiftBadgeProps,
  PageHeaderProps
} from '../components-new';
``` 