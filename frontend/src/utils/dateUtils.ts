// Datum-Utility-Funktionen für das Schichtplaner-System

/**
 * Formatiert ein Datum in ein lesbares Format
 */
export function formatDate(date: Date | string, locale = 'de-DE'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
}

/**
 * Formatiert eine Uhrzeit
 */
export function formatTime(date: Date | string, locale = 'de-DE'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString(locale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Formatiert Datum und Uhrzeit
 */
export function formatDateTime(date: Date | string, locale = 'de-DE'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
}

/**
 * Berechnet die Dauer zwischen zwei Zeitpunkten
 */
export function calculateDuration(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}min`;
  }
  return `${diffMinutes}min`;
}

/**
 * Prüft ob ein Datum heute ist
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}

/**
 * Prüft ob ein Datum in der Vergangenheit liegt
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Prüft ob ein Datum in der Zukunft liegt
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Erstellt ein Datum für heute um Mitternacht
 */
export function getTodayStart(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Erstellt ein Datum für heute um 23:59:59
 */
export function getTodayEnd(): Date {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

/**
 * Fügt Tage zu einem Datum hinzu
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Berechnet die Anzahl der Tage zwischen zwei Daten
 */
export function daysBetween(start: Date, end: Date): number {
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Erstellt ein Datum für den Anfang der Woche (Montag)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Montag = 1
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Erstellt ein Datum für das Ende der Woche (Sonntag)
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const result = getWeekStart(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Formatiert eine relative Zeit (z.B. "vor 2 Stunden")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'gerade eben';
  } else if (diffMinutes < 60) {
    return `vor ${diffMinutes} Minuten`;
  } else if (diffHours < 24) {
    return `vor ${diffHours} Stunden`;
  } else if (diffDays < 7) {
    return `vor ${diffDays} Tagen`;
  } else {
    return formatDate(dateObj);
  }
} 