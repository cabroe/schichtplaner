# Frontend (React/TypeScript) Regeln

## Framework & Architektur
- Verwende TypeScript für alle Komponenten
- Nutze React Router für Navigation
- Verwende Zustand für State Management
- Folge der bestehenden Komponenten-Struktur
- Verwende Tabler UI Komponenten

## Development Workflow
- Verwende `yarn dev` für Development Server
- Verwende `yarn build` für Production Build
- Führe `yarn test` vor Commits aus
- Nutze `yarn lint` für Code-Qualität

## Testing
- Schreibe Tests mit Vitest und Testing Library
- Teste Komponenten isoliert
- Verwende `@testing-library/react` für UI-Tests
- Teste User-Interaktionen mit `fireEvent` und `userEvent`
- Ziel: >80% Testabdeckung

## Code Style
- Verwende 2 Spaces für Einrückung
- Verwende camelCase für Variablen/Funktionen
- Verwende PascalCase für Komponenten/Typen
- Verwende deutsche Bezeichnungen in UI-Texten
- Verwende deutsche Kommentare für komplexe Logik

## Component Structure
- Erstelle wiederverwendbare Komponenten
- Verwende TypeScript Interfaces für Props
- Trenne Logik von Präsentation
- Verwende Custom Hooks für komplexe Logik
- Halte Komponenten klein und fokussiert

## State Management
- Verwende Zustand für globalen State
- Verwende React State für lokalen Component-State
- Vermeide Prop-Drilling
- Verwende Context nur wenn nötig

## UI/UX
- Verwende Tabler UI Design System
- Stelle Barrierefreiheit sicher
- Verwende responsive Design
- Konsistente Farben und Typografie
- Deutsche Lokalisierung für alle Texte 