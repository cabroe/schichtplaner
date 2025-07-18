// Validierungs-Utility-Funktionen für das Schichtplaner-System

/**
 * Validiert eine E-Mail-Adresse
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validiert ein Passwort (mindestens 8 Zeichen, Groß- und Kleinbuchstaben, Zahlen)
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validiert einen Benutzernamen (3-20 Zeichen, nur Buchstaben, Zahlen, Unterstriche)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validiert eine Telefonnummer (deutsches Format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+49|0)[0-9]{6,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validiert ein Datum (muss in der Zukunft liegen)
 */
export function isValidFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Validiert einen Datumsbereich (Enddatum muss nach Startdatum liegen)
 */
export function isValidDateRange(startDate: Date | string, endDate: Date | string): boolean {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return end > start;
}

/**
 * Validiert eine Uhrzeit
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Validiert eine positive Zahl
 */
export function isValidPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0 && Number.isFinite(value);
}

/**
 * Validiert eine Zahl in einem bestimmten Bereich
 */
export function isValidNumberInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max && Number.isFinite(value);
}

/**
 * Validiert einen String mit minimaler und maximaler Länge
 */
export function isValidStringLength(value: string, minLength: number, maxLength: number): boolean {
  return typeof value === 'string' && value.length >= minLength && value.length <= maxLength;
}

/**
 * Validiert eine erforderliche Eingabe
 */
export function isRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Validiert eine URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validiert eine Postleitzahl (deutsches Format)
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Validiert eine IBAN
 */
export function isValidIBAN(iban: string): boolean {
  const ibanRegex = /^DE[0-9]{20}$/;
  return ibanRegex.test(iban.replace(/\s/g, '').toUpperCase());
}

/**
 * Validiert eine Steuernummer
 */
export function isValidTaxNumber(taxNumber: string): boolean {
  const taxNumberRegex = /^[0-9]{10,11}$/;
  return taxNumberRegex.test(taxNumber.replace(/\s/g, ''));
}

/**
 * Validiert eine Sozialversicherungsnummer
 */
export function isValidSocialSecurityNumber(ssn: string): boolean {
  const ssnRegex = /^[0-9]{11}$/;
  return ssnRegex.test(ssn.replace(/\s/g, ''));
}

/**
 * Erstellt eine benutzerfreundliche Fehlermeldung für Validierungsfehler
 */
export function getValidationErrorMessage(field: string, type: string): string {
  const messages: Record<string, string> = {
    required: `${field} ist erforderlich`,
    email: `${field} muss eine gültige E-Mail-Adresse sein`,
    password: `${field} muss mindestens 8 Zeichen mit Groß- und Kleinbuchstaben und Zahlen enthalten`,
    username: `${field} muss 3-20 Zeichen lang sein und nur Buchstaben, Zahlen und Unterstriche enthalten`,
    phone: `${field} muss eine gültige Telefonnummer sein`,
    futureDate: `${field} muss in der Zukunft liegen`,
    dateRange: `${field} Enddatum muss nach dem Startdatum liegen`,
    time: `${field} muss eine gültige Uhrzeit sein`,
    positiveNumber: `${field} muss eine positive Zahl sein`,
    numberRange: `${field} muss zwischen den angegebenen Werten liegen`,
    stringLength: `${field} muss die richtige Länge haben`,
    url: `${field} muss eine gültige URL sein`,
    postalCode: `${field} muss eine gültige Postleitzahl sein`,
    iban: `${field} muss eine gültige IBAN sein`,
    taxNumber: `${field} muss eine gültige Steuernummer sein`,
    socialSecurityNumber: `${field} muss eine gültige Sozialversicherungsnummer sein`,
  };
  
  return messages[type] || `${field} ist ungültig`;
} 