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

// ===== KALENDER-SPEZIFISCHE FUNKTIONEN =====

/**
 * Berechnet die Kalenderwoche für ein Datum
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Gruppiert Tage nach Kalenderwochen
 */
export function groupDaysByWeek(days: Date[]): Date[][] {
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
}

/**
 * Generiert Kalendertage für eine bestimmte Anzahl von Wochen
 */
export function generateCalendarDays(weeksToShow: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  const startDate = getWeekStart(today);
  
  for (let week = 0; week < weeksToShow; week++) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(startDate, (week * 7) + day);
      days.push(date);
    }
  }
  
  return days;
}

/**
 * Formatiert ein Datum für die Kalenderanzeige (Kurzformat)
 */
export function formatCalendarDate(date: Date, locale = 'de-DE'): string {
  return date.toLocaleDateString(locale, { weekday: 'short' });
}

/**
 * Formatiert ein Datum für die Kalenderanzeige (Langformat)
 */
export function formatCalendarDateLong(date: Date, locale = 'de-DE'): string {
  return date.toLocaleDateString(locale, { 
    day: '2-digit', 
    month: '2-digit' 
  });
}

/**
 * Prüft ob ein Datum am Wochenende liegt
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sonntag = 0, Samstag = 6
}

/**
 * Prüft ob ein Datum ein Feiertag ist (einfache Implementierung)
 */
export function isHoliday(date: Date): boolean {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Deutsche Feiertage (vereinfacht)
  const holidays = [
    { month: 0, day: 1 },   // Neujahr
    { month: 4, day: 1 },   // Tag der Arbeit
    { month: 9, day: 3 },   // Tag der Deutschen Einheit
    { month: 11, day: 25 }, // Weihnachten
    { month: 11, day: 26 }, // 2. Weihnachtstag
  ];
  
  return holidays.some(holiday => holiday.month === month && holiday.day === day);
}

/**
 * Erstellt ein Datum für den ersten Tag des Monats
 */
export function getMonthStart(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Erstellt ein Datum für den letzten Tag des Monats
 */
export function getMonthEnd(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
} 