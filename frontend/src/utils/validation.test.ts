import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidPhone,
  isValidFutureDate,
  isValidDateRange,
  isValidTime,
  isValidPositiveNumber,
  isValidNumberInRange,
  isValidStringLength,
  isRequired,
  isValidUrl,
  isValidPostalCode,
  isValidIBAN,
  isValidTaxNumber,
  isValidSocialSecurityNumber,
  getValidationErrorMessage
} from './validation';

describe('validation', () => {
  describe('E-Mail-Validierung', () => {
    it('erkennt gültige E-Mail-Adressen', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.org')).toBe(true);
    });

    it('erkennt ungültige E-Mail-Adressen', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Passwort-Validierung', () => {
    it('erkennt gültige Passwörter', () => {
      expect(isValidPassword('Password123')).toBe(true);
      expect(isValidPassword('SecurePass1')).toBe(true);
      expect(isValidPassword('MyP@ssw0rd')).toBe(true);
    });

    it('erkennt ungültige Passwörter', () => {
      expect(isValidPassword('password')).toBe(false); // Keine Großbuchstaben
      expect(isValidPassword('PASSWORD')).toBe(false); // Keine Kleinbuchstaben
      expect(isValidPassword('Pass')).toBe(false); // Zu kurz
      expect(isValidPassword('Password')).toBe(false); // Keine Zahlen
      expect(isValidPassword('12345678')).toBe(false); // Keine Buchstaben
    });
  });

  describe('Benutzername-Validierung', () => {
    it('erkennt gültige Benutzernamen', () => {
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('admin')).toBe(true);
      expect(isValidUsername('test_user_123')).toBe(true);
    });

    it('erkennt ungültige Benutzernamen', () => {
      expect(isValidUsername('ab')).toBe(false); // Zu kurz
      expect(isValidUsername('very_long_username_that_exceeds_limit')).toBe(false); // Zu lang
      expect(isValidUsername('user-name')).toBe(false); // Bindestrich nicht erlaubt
      expect(isValidUsername('user.name')).toBe(false); // Punkt nicht erlaubt
      expect(isValidUsername('')).toBe(false);
    });
  });

  describe('Telefonnummer-Validierung', () => {
    it('erkennt gültige deutsche Telefonnummern', () => {
      expect(isValidPhone('+49123456789')).toBe(true);
      expect(isValidPhone('0123456789')).toBe(true);
      expect(isValidPhone('+49 123 456 789')).toBe(true);
      expect(isValidPhone('0123 456 789')).toBe(true);
    });

    it('erkennt ungültige Telefonnummern', () => {
      expect(isValidPhone('123456')).toBe(false); // Zu kurz
      expect(isValidPhone('+491234567890123456789')).toBe(false); // Zu lang
      expect(isValidPhone('invalid')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('Zukunftsdatum-Validierung', () => {
    it('erkennt gültige Zukunftsdaten', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isValidFutureDate(tomorrow)).toBe(true);
      
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      expect(isValidFutureDate(nextYear)).toBe(true);
    });

    it('erkennt ungültige Zukunftsdaten', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isValidFutureDate(yesterday)).toBe(false);
      
      expect(isValidFutureDate(new Date())).toBe(false); // Heute
      expect(isValidFutureDate('2020-01-01')).toBe(false); // Vergangenheit
    });
  });

  describe('Datumsbereich-Validierung', () => {
    it('erkennt gültige Datumsbereiche', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-15');
      expect(isValidDateRange(start, end)).toBe(true);
      
      expect(isValidDateRange('2024-01-01', '2024-01-15')).toBe(true);
    });

    it('erkennt ungültige Datumsbereiche', () => {
      const start = new Date('2024-01-15');
      const end = new Date('2024-01-01');
      expect(isValidDateRange(start, end)).toBe(false);
      
      expect(isValidDateRange('2024-01-15', '2024-01-01')).toBe(false);
    });
  });

  describe('Uhrzeit-Validierung', () => {
    it('erkennt gültige Uhrzeiten', () => {
      expect(isValidTime('09:30')).toBe(true);
      expect(isValidTime('23:59')).toBe(true);
      expect(isValidTime('00:00')).toBe(true);
      expect(isValidTime('12:00')).toBe(true);
    });

    it('erkennt ungültige Uhrzeiten', () => {
      expect(isValidTime('24:00')).toBe(false); // Stunde zu hoch
      expect(isValidTime('12:60')).toBe(false); // Minute zu hoch
      expect(isValidTime('9:30')).toBe(false); // Führende Null fehlt
      expect(isValidTime('12:5')).toBe(false); // Führende Null fehlt
      expect(isValidTime('invalid')).toBe(false);
      expect(isValidTime('')).toBe(false);
    });
  });

  describe('Positive Zahlen-Validierung', () => {
    it('erkennt gültige positive Zahlen', () => {
      expect(isValidPositiveNumber(1)).toBe(true);
      expect(isValidPositiveNumber(100)).toBe(true);
      expect(isValidPositiveNumber(3.14)).toBe(true);
    });

    it('erkennt ungültige positive Zahlen', () => {
      expect(isValidPositiveNumber(0)).toBe(false);
      expect(isValidPositiveNumber(-1)).toBe(false);
      expect(isValidPositiveNumber(Infinity)).toBe(false);
      expect(isValidPositiveNumber(NaN)).toBe(false);
      expect(isValidPositiveNumber('1' as any)).toBe(false);
    });
  });

  describe('Zahlenbereich-Validierung', () => {
    it('erkennt gültige Zahlen im Bereich', () => {
      expect(isValidNumberInRange(5, 1, 10)).toBe(true);
      expect(isValidNumberInRange(1, 1, 10)).toBe(true); // Min-Wert
      expect(isValidNumberInRange(10, 1, 10)).toBe(true); // Max-Wert
    });

    it('erkennt ungültige Zahlen im Bereich', () => {
      expect(isValidNumberInRange(0, 1, 10)).toBe(false); // Unter Min
      expect(isValidNumberInRange(11, 1, 10)).toBe(false); // Über Max
      expect(isValidNumberInRange(NaN, 1, 10)).toBe(false);
      expect(isValidNumberInRange(Infinity, 1, 10)).toBe(false);
    });
  });

  describe('String-Längen-Validierung', () => {
    it('erkennt gültige String-Längen', () => {
      expect(isValidStringLength('test', 1, 10)).toBe(true);
      expect(isValidStringLength('a', 1, 10)).toBe(true); // Min-Länge
      expect(isValidStringLength('abcdefghij', 1, 10)).toBe(true); // Max-Länge
    });

    it('erkennt ungültige String-Längen', () => {
      expect(isValidStringLength('', 1, 10)).toBe(false); // Zu kurz
      expect(isValidStringLength('abcdefghijk', 1, 10)).toBe(false); // Zu lang
      expect(isValidStringLength('test', 5, 10)).toBe(false); // Zu kurz für Min
    });
  });

  describe('Erforderliche Eingabe-Validierung', () => {
    it('erkennt gültige erforderliche Eingaben', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired(' ')).toBe(false); // Leerzeichen
      expect(isRequired('  test  ')).toBe(true); // Getrimmt
      expect(isRequired(123)).toBe(true);
      expect(isRequired(0)).toBe(true);
      expect(isRequired(false)).toBe(true);
    });

    it('erkennt ungültige erforderliche Eingaben', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('URL-Validierung', () => {
    it('erkennt gültige URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/path?param=value')).toBe(true);
    });

    it('erkennt ungültige URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false); // Kein Protokoll
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('Postleitzahl-Validierung', () => {
    it('erkennt gültige deutsche Postleitzahlen', () => {
      expect(isValidPostalCode('12345')).toBe(true);
      expect(isValidPostalCode('00000')).toBe(true);
      expect(isValidPostalCode('99999')).toBe(true);
    });

    it('erkennt ungültige Postleitzahlen', () => {
      expect(isValidPostalCode('1234')).toBe(false); // Zu kurz
      expect(isValidPostalCode('123456')).toBe(false); // Zu lang
      expect(isValidPostalCode('1234a')).toBe(false); // Buchstaben
      expect(isValidPostalCode('')).toBe(false);
    });
  });

  describe('IBAN-Validierung', () => {
    it('erkennt gültige deutsche IBANs', () => {
      expect(isValidIBAN('DE12345678901234567890')).toBe(true);
      expect(isValidIBAN('de12345678901234567890')).toBe(true); // Kleinbuchstaben
      expect(isValidIBAN('DE 1234 5678 9012 3456 7890')).toBe(true); // Mit Leerzeichen
    });

    it('erkennt ungültige IBANs', () => {
      expect(isValidIBAN('DE1234567890123456789')).toBe(false); // Zu kurz
      expect(isValidIBAN('DE123456789012345678901')).toBe(false); // Zu lang
      expect(isValidIBAN('AT12345678901234567890')).toBe(false); // Falsches Land
      expect(isValidIBAN('')).toBe(false);
    });
  });

  describe('Steuernummer-Validierung', () => {
    it('erkennt gültige Steuernummern', () => {
      expect(isValidTaxNumber('1234567890')).toBe(true);
      expect(isValidTaxNumber('12345678901')).toBe(true);
      expect(isValidTaxNumber('123 456 789 01')).toBe(true); // Mit Leerzeichen
    });

    it('erkennt ungültige Steuernummern', () => {
      expect(isValidTaxNumber('123456789')).toBe(false); // Zu kurz
      expect(isValidTaxNumber('123456789012')).toBe(false); // Zu lang
      expect(isValidTaxNumber('123456789a')).toBe(false); // Buchstaben
      expect(isValidTaxNumber('')).toBe(false);
    });
  });

  describe('Sozialversicherungsnummer-Validierung', () => {
    it('erkennt gültige Sozialversicherungsnummern', () => {
      expect(isValidSocialSecurityNumber('12345678901')).toBe(true);
      expect(isValidSocialSecurityNumber('123 456 789 01')).toBe(true); // Mit Leerzeichen
    });

    it('erkennt ungültige Sozialversicherungsnummern', () => {
      expect(isValidSocialSecurityNumber('1234567890')).toBe(false); // Zu kurz
      expect(isValidSocialSecurityNumber('123456789012')).toBe(false); // Zu lang
      expect(isValidSocialSecurityNumber('1234567890a')).toBe(false); // Buchstaben
      expect(isValidSocialSecurityNumber('')).toBe(false);
    });
  });

  describe('Validierungsfehlermeldungen', () => {
    it('gibt korrekte Fehlermeldungen zurück', () => {
      expect(getValidationErrorMessage('E-Mail', 'required')).toBe('E-Mail ist erforderlich');
      expect(getValidationErrorMessage('Passwort', 'email')).toBe('Passwort muss eine gültige E-Mail-Adresse sein');
      expect(getValidationErrorMessage('Benutzername', 'password')).toBe('Benutzername muss mindestens 8 Zeichen mit Groß- und Kleinbuchstaben und Zahlen enthalten');
      expect(getValidationErrorMessage('Telefon', 'username')).toBe('Telefon muss 3-20 Zeichen lang sein und nur Buchstaben, Zahlen und Unterstriche enthalten');
    });

    it('gibt Standard-Fehlermeldung für unbekannte Typen zurück', () => {
      expect(getValidationErrorMessage('Feld', 'unknown')).toBe('Feld ist ungültig');
    });

    it('behandelt alle Validierungstypen', () => {
      const types = [
        'required', 'email', 'password', 'username', 'phone', 'futureDate',
        'dateRange', 'time', 'positiveNumber', 'numberRange', 'stringLength',
        'url', 'postalCode', 'iban', 'taxNumber', 'socialSecurityNumber'
      ];

      types.forEach(type => {
        const message = getValidationErrorMessage('Test', type);
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases und Grenzfälle', () => {
    it('behandelt leere Strings korrekt', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidPassword('')).toBe(false);
      expect(isValidUsername('')).toBe(false);
      expect(isValidPhone('')).toBe(false);
      expect(isValidTime('')).toBe(false);
      expect(isValidPostalCode('')).toBe(false);
      expect(isValidIBAN('')).toBe(false);
      expect(isValidTaxNumber('')).toBe(false);
      expect(isValidSocialSecurityNumber('')).toBe(false);
    });

    it('behandelt null und undefined korrekt', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });

    it('behandelt Whitespace korrekt', () => {
      expect(isValidEmail(' test@example.com ')).toBe(true);
      expect(isValidPhone(' +49 123 456 789 ')).toBe(true);
      expect(isValidPostalCode(' 12345 ')).toBe(true);
    });
  });
}); 