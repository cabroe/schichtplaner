import React, { type ReactNode } from 'react';

interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  helpText?: string;
}

/**
 * Wiederverwendbare FormGroup-Komponente für Formularfelder mit Tabler.io Styling
 * 
 * @param label - Label für das Formularfeld
 * @param htmlFor - ID des zugehörigen Formularfelds (für das label-Element)
 * @param required - Gibt an, ob das Feld erforderlich ist
 * @param error - Fehlermeldung, falls vorhanden
 * @param children - Kind-Komponenten (normalerweise das Eingabefeld)
 * @param className - Zusätzliche CSS-Klassen
 * @param helpText - Hilfetext unter dem Formularfeld
 */
export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className = '',
  helpText,
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="form-hint">
          {helpText}
        </div>
      )}
    </div>
  );
}; 