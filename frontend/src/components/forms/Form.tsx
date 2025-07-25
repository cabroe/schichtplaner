import React, { type FormEvent, type ReactNode } from 'react';

interface FormProps {
  id?: string;
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  initialValues?: Record<string, any>;
  children: ReactNode;
  className?: string;
}

/**
 * Wiederverwendbare Form-Komponente mit Tabler.io Styling und HTML5-Validierung
 * 
 * @param id - Optionale ID für das Formular
 * @param onSubmit - Callback-Funktion, die bei Formular-Übermittlung aufgerufen wird
 * @param loading - Gibt an, ob das Formular gerade lädt (deaktiviert Submit-Button)
 * @param initialValues - Anfangswerte für die Formularfelder
 * @param children - Kind-Komponenten des Formulars
 * @param className - Zusätzliche CSS-Klassen
 */
export const Form: React.FC<FormProps> = ({
  id,
  onSubmit,
  loading = false,
  initialValues = {},
  children,
  className = '',
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (loading) return;
    
    // Prüfe HTML5-Validierung vor preventDefault
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      // Trigger Browser-Validierung und zeige Meldungen an
      form.reportValidity();
      return;
    }
    
    e.preventDefault();
    
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    
    // Konvertiere FormData in ein einfaches Objekt
    formData.forEach((value, key) => {
      // Behandle Checkboxen speziell
      const element = form.elements.namedItem(key);
      if (element instanceof HTMLInputElement && element.type === 'checkbox') {
        data[key] = value === 'on' || value === 'true';
      } else {
        data[key] = value;
      }
    });    
    
    // Füge initialValues hinzu, die nicht im Formular enthalten sind
    Object.keys(initialValues).forEach(key => {
      if (data[key] === undefined) {
        data[key] = initialValues[key];
      }
    });
    
    onSubmit(data);
  };
  
  return (
    <form 
      id={id}
      onSubmit={handleSubmit}
      className={`${className}`}
    >
      {children}
      
      <div className="d-flex justify-content-end mt-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Wird gespeichert...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Speichern
            </>
          )}
        </button>
      </div>
    </form>
  );
}; 