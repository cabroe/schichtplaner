import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FormDemo from "./FormDemo";

// Mock-Funktionen für externe APIs
const mockAlert = vi.fn();
window.alert = mockAlert;

const mockConsoleLog = vi.fn();
console.log = mockConsoleLog;

const renderFormDemo = () => {
  return render(
    <MemoryRouter>
      <FormDemo />
    </MemoryRouter>
  );
};

describe("FormDemo", () => {
  beforeEach(() => {
    mockAlert.mockClear();
    mockConsoleLog.mockClear();
  });

  it("rendert die Form-Demo-Seite korrekt", () => {
    renderFormDemo();
    
    expect(screen.getByText("Form-Komponenten Demo")).toBeInTheDocument();
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByText(/Diese Seite demonstriert alle verfügbaren Form-Komponenten/)).toBeInTheDocument();
  });

  it("zeigt alle Formularfelder an", () => {
    renderFormDemo();
    
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-Mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefonnummer/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beschreibung/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kategorie/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priorität/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Farbe/)).toBeInTheDocument();
  });

  it("zeigt erforderliche Feld-Indikatoren an", () => {
    renderFormDemo();
    
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThan(0);
  });

  it("zeigt Hilfetexte für Formularfelder an", () => {
    renderFormDemo();
    
    expect(screen.getByText('Geben Sie Ihren vollständigen Namen ein')).toBeInTheDocument();
    expect(screen.getByText('Beschreiben Sie Ihr Anliegen detailliert')).toBeInTheDocument();
  });

  it("zeigt Komponenten-Info-Sektion an", () => {
    renderFormDemo();
    
    expect(screen.getByText('Komponenten-Info')).toBeInTheDocument();
    expect(screen.getByText('Tabler.io Styling')).toBeInTheDocument();
    expect(screen.getByText('Font Awesome Icons')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Support')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Error Handling')).toBeInTheDocument();
    expect(screen.getByText('Loading States')).toBeInTheDocument();
  });

  it("zeigt Verwendungs-Sektion an", () => {
    renderFormDemo();
    
    expect(screen.getByText('Verwendung')).toBeInTheDocument();
    expect(screen.getByText(/Importieren Sie die Komponenten/)).toBeInTheDocument();
    expect(screen.getByText(/import { Form, FormGroup, Input } from/)).toBeInTheDocument();
  });

  it("zeigt Validierungsfehler beim Übermitteln eines leeren Formulars", async () => {
    renderFormDemo();
    
    const submitButton = screen.getByText('Speichern');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('E-Mail ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('Telefonnummer ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('Bitte wählen Sie eine Kategorie')).toBeInTheDocument();
      expect(screen.getByText('Sie müssen den Bedingungen zustimmen')).toBeInTheDocument();
    });
  });

  it("übermittelt das Formular erfolgreich mit gültigen Daten", async () => {
    renderFormDemo();
    
    // Fülle das Formular aus
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Max Mustermann' } });
    fireEvent.change(screen.getByLabelText(/E-Mail/), { target: { value: 'max@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telefonnummer/), { target: { value: '+49 123 456789' } });
    
    // Wähle eine Kategorie
    const categorySelect = screen.getByLabelText(/Kategorie/);
    fireEvent.change(categorySelect, { target: { value: 'bug' } });
    
    // Akzeptiere die Bedingungen
    const termsCheckbox = screen.getByLabelText(/Ich stimme den Datenschutzbedingungen/);
    fireEvent.click(termsCheckbox);
    
    // Sende das Formular
    const submitButton = screen.getByText('Speichern');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Formular erfolgreich gesendet!');
    }, { timeout: 3000 });
  });

  it("zeigt Ladezustand während der Formular-Übermittlung", async () => {
    renderFormDemo();
    
    // Fülle das Formular aus
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Max Mustermann' } });
    fireEvent.change(screen.getByLabelText(/E-Mail/), { target: { value: 'max@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telefonnummer/), { target: { value: '+49 123 456789' } });
    
    const categorySelect = screen.getByLabelText(/Kategorie/);
    fireEvent.change(categorySelect, { target: { value: 'bug' } });
    
    const termsCheckbox = screen.getByLabelText(/Ich stimme den Datenschutzbedingungen/);
    fireEvent.click(termsCheckbox);
    
    // Sende das Formular
    const submitButton = screen.getByText('Speichern');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Wird gespeichert...')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Speichern')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("validiert das E-Mail-Format korrekt", async () => {
    renderFormDemo();
    
    // Fülle andere Felder aus
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Max Mustermann' } });
    fireEvent.change(screen.getByLabelText(/Telefonnummer/), { target: { value: '+49 123 456789' } });
    
    const categorySelect = screen.getByLabelText(/Kategorie/);
    fireEvent.change(categorySelect, { target: { value: 'bug' } });
    
    const termsCheckbox = screen.getByLabelText(/Ich stimme den Datenschutzbedingungen/);
    fireEvent.click(termsCheckbox);
    
    // Teste ungültige E-Mail
    fireEvent.change(screen.getByLabelText(/E-Mail/), { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText('Speichern');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Ungültige E-Mail-Adresse')).toBeInTheDocument();
    });
  });

  it("zeigt alle Prioritäts-Optionen in der Radio-Gruppe an", () => {
    renderFormDemo();
    
    expect(screen.getByLabelText('Niedrig')).toBeInTheDocument();
    expect(screen.getByLabelText('Mittel')).toBeInTheDocument();
    expect(screen.getByLabelText('Hoch')).toBeInTheDocument();
    expect(screen.getByLabelText('Dringend')).toBeInTheDocument();
  });

  it("zeigt alle Kategorie-Optionen im Select-Feld an", () => {
    renderFormDemo();
    
    const categorySelect = screen.getByLabelText(/Kategorie/);
    fireEvent.click(categorySelect);
    
    expect(screen.getByText('Bug Report')).toBeInTheDocument();
    expect(screen.getByText('Feature Request')).toBeInTheDocument();
    expect(screen.getByText('Verbesserungsvorschlag')).toBeInTheDocument();
    expect(screen.getByText('Frage')).toBeInTheDocument();
    expect(screen.getByText('Sonstiges')).toBeInTheDocument();
  });

  it("behandelt Checkbox-Interaktionen korrekt", () => {
    renderFormDemo();
    
    const notificationsCheckbox = screen.getByLabelText(/E-Mail-Benachrichtigungen erhalten/);
    const newsletterCheckbox = screen.getByLabelText(/Newsletter abonnieren/);
    
    expect(notificationsCheckbox).toBeInTheDocument();
    expect(newsletterCheckbox).toBeInTheDocument();
    
    fireEvent.click(notificationsCheckbox);
    expect(notificationsCheckbox).toBeChecked();
  });

  it("zeigt ColorDropdown mit Farbvorschau an", () => {
    renderFormDemo();
    
    const colorDropdown = screen.getByLabelText(/Farbe/);
    expect(colorDropdown).toBeInTheDocument();
    expect(screen.getByText('Blau')).toBeInTheDocument();
  });
}); 