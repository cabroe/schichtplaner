# Form-Komponenten

Diese Sammlung von wiederverwendbaren Form-Komponenten ist speziell für die Schichtplaner-App entwickelt und verwendet Tabler.io für das Styling sowie Font Awesome für Icons.

## Verfügbare Komponenten

### Form
Die Haupt-Formular-Komponente, die alle anderen Komponenten umschließt.

```tsx
import { Form } from './components/forms';

<Form 
  onSubmit={(data) => console.log(data)}
  loading={false}
  initialValues={{ name: 'Max' }}
>
  {/* Formularfelder hier */}
</Form>
```

### FormGroup
Wrapper für einzelne Formularfelder mit Label, Fehlerbehandlung und Hilfetext.

```tsx
import { FormGroup } from './components/forms';

<FormGroup 
  label="Name" 
  htmlFor="name" 
  required
  error="Name ist erforderlich"
  helpText="Geben Sie Ihren vollständigen Namen ein"
>
  <Input name="name" />
</FormGroup>
```

### Input
Wiederverwendbare Input-Komponente für verschiedene Eingabetypen.

```tsx
import { Input } from './components/forms';

<Input
  type="text"
  name="name"
  placeholder="Max Mustermann"
  required
  error="Name ist erforderlich"
/>
```

### Textarea
Komponente für mehrzeilige Texteingaben.

```tsx
import { Textarea } from './components/forms';

<Textarea
  name="description"
  placeholder="Beschreibung..."
  rows={4}
  maxLength={500}
/>
```

### Select
Dropdown-Auswahl mit Optionen.

```tsx
import { Select } from './components/forms';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
];

<Select
  name="category"
  options={options}
  placeholder="Kategorie auswählen"
  required
/>
```

### Checkbox
Einzelne Checkbox mit Label.

```tsx
import { Checkbox } from './components/forms';

<Checkbox
  name="agreement"
  label="Ich stimme den Bedingungen zu"
  required
/>
```

### RadioGroup
Gruppe von Radio-Buttons.

```tsx
import { RadioGroup } from './components/forms';

const options = [
  { value: 'yes', label: 'Ja' },
  { value: 'no', label: 'Nein' }
];

<RadioGroup
  name="answer"
  options={options}
  inline
/>
```

### ColorDropdown
Spezielle Dropdown-Komponente für Farbauswahl mit visueller Vorschau.

```tsx
import { ColorDropdown } from './components/forms';

const colorOptions = [
  { value: '#206bc4', label: 'Blau' },
  { value: '#48bb78', label: 'Grün' }
];

<ColorDropdown
  name="color"
  value={selectedColor}
  onChange={setSelectedColor}
  options={colorOptions}
/>
```

## Verwendung

### Einfaches Beispiel

```tsx
import React, { useState } from 'react';
import { Form, FormGroup, Input, Textarea } from './components/forms';

const MyForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    // API-Aufruf hier
    console.log(data);
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading}>
      <FormGroup label="Name" htmlFor="name" required>
        <Input name="name" placeholder="Ihr Name" required />
      </FormGroup>
      
      <FormGroup label="Nachricht" htmlFor="message">
        <Textarea name="message" placeholder="Ihre Nachricht..." />
      </FormGroup>
    </Form>
  );
};
```

### Mit Validierung

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = (data: Record<string, any>) => {
  const newErrors: Record<string, string> = {};
  
  if (!data.name) {
    newErrors.name = 'Name ist erforderlich';
  }
  
  if (!data.email) {
    newErrors.email = 'E-Mail ist erforderlich';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    newErrors.email = 'Ungültige E-Mail-Adresse';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (data: Record<string, any>) => {
  if (!validateForm(data)) {
    return;
  }
  // Formular verarbeiten
};
```

## Features

- **Tabler.io Styling**: Alle Komponenten verwenden Tabler.io CSS-Klassen
- **Font Awesome Icons**: Icons werden über Font Awesome CSS-Klassen eingebunden
- **TypeScript**: Vollständige TypeScript-Unterstützung
- **Accessibility**: ARIA-Labels und korrekte HTML-Struktur
- **Error Handling**: Integrierte Fehlerbehandlung und -anzeige
- **Loading States**: Unterstützung für Ladezustände
- **Form Validation**: Einfache Integration mit Validierungslogik

## Styling

Alle Komponenten verwenden die Standard-Tabler.io CSS-Klassen:

- `form-control` für Input-Felder
- `form-select` für Select-Felder
- `form-check` für Checkboxen und Radio-Buttons
- `form-label` für Labels
- `invalid-feedback` für Fehlermeldungen
- `form-hint` für Hilfetexte

## Best Practices

1. **Verwenden Sie immer FormGroup**: Wrappen Sie einzelne Formularfelder in FormGroup für konsistentes Styling
2. **Setzen Sie htmlFor**: Verbinden Sie Labels mit Formularfeldern über die htmlFor-Prop
3. **Validierung**: Implementieren Sie Client-seitige Validierung vor dem Submit
4. **Loading States**: Zeigen Sie Ladezustände während API-Aufrufen an
5. **Error Handling**: Behandeln Sie Fehler benutzerfreundlich 