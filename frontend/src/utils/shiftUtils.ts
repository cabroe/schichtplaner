// Utility-Funktionen für die Schichtplanung

/**
 * Formatiert einen Wochentag
 */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'short' });
}

/**
 * Gibt CSS-Klasse für Wochentag zurück
 */
export function getWeekdayClass(date: Date): string {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return 'text-danger'; // Wochenende
  }
  return '';
}

/**
 * Gibt CSS-Klasse für Kalenderwoche zurück
 */
export function getWeekNumberClass(weekNumber: number): string {
  return 'bg-light';
}

/**
 * Gibt Tooltip für Schichttyp zurück
 */
export function getTooltipForShift(shiftType: string | null): string {
  if (!shiftType) return 'Keine Schicht';
  
  const tooltips: Record<string, string> = {
    'F': 'Frühschicht',
    'S': 'Spätschicht',
    'N': 'Nachtschicht',
    'U': 'Urlaub',
    'K': 'Krank',
    'FR': 'Frei',
    'FT': 'Feiertag',
    'WE': 'Wochenende'
  };
  
  return tooltips[shiftType] || shiftType;
}

/**
 * Gibt Farbe für Schichttyp zurück
 */
export function getShiftColor(shiftType: string | null): string {
  if (!shiftType) return 'transparent';
  
  const colors: Record<string, string> = {
    'F': '#ff6b6b', // Rot für Frühschicht
    'S': '#4ecdc4', // Türkis für Spätschicht
    'N': '#45b7d1', // Blau für Nachtschicht
    'U': '#ffd93d', // Gelb für Urlaub
    'K': '#ff8a80', // Rosa für Krank
    'FR': '#6c757d', // Grau für Frei
    'FT': '#28a745', // Grün für Feiertag
    'WE': '#343a40'  // Dunkelgrau für Wochenende
  };
  
  return colors[shiftType] || '#6c757d';
}

/**
 * Gibt Icon für Schichttyp zurück
 */
export function getShiftIcon(shiftType: string | null): string {
  if (!shiftType) return 'fas fa-calendar';
  
  const icons: Record<string, string> = {
    'F': 'fas fa-sunrise',
    'S': 'fas fa-sun',
    'N': 'fas fa-moon',
    'U': 'fas fa-calendar-check',
    'K': 'fas fa-bandaid',
    'FR': 'fas fa-calendar-x',
    'FT': 'fas fa-calendar-event',
    'WE': 'fas fa-calendar-weekend'
  };
  
  return icons[shiftType] || 'fas fa-calendar';
}

/**
 * Prüft ob ein Schichttyp ein Wochenende ist
 */
export function isWeekendShift(shiftType: string | null): boolean {
  return shiftType === 'WE';
}

/**
 * Prüft ob ein Schichttyp ein Feiertag ist
 */
export function isHolidayShift(shiftType: string | null): boolean {
  return shiftType === 'FT';
}

/**
 * Prüft ob ein Schichttyp eine Abwesenheit ist
 */
export function isAbsenceShift(shiftType: string | null): boolean {
  return shiftType === 'U' || shiftType === 'K';
}

/**
 * Gibt die Dauer einer Schicht in Stunden zurück
 */
export function getShiftDuration(shiftType: string | null): number {
  if (!shiftType) return 0;
  
  const durations: Record<string, number> = {
    'F': 8, // Frühschicht: 8 Stunden
    'S': 8, // Spätschicht: 8 Stunden
    'N': 8, // Nachtschicht: 8 Stunden
    'U': 0, // Urlaub: 0 Stunden
    'K': 0, // Krank: 0 Stunden
    'FR': 0, // Frei: 0 Stunden
    'FT': 0, // Feiertag: 0 Stunden
    'WE': 0  // Wochenende: 0 Stunden
  };
  
  return durations[shiftType] || 0;
}

/**
 * Formatiert die Schichtdauer
 */
export function formatShiftDuration(shiftType: string | null): string {
  const duration = getShiftDuration(shiftType);
  if (duration === 0) return '-';
  return `${duration}h`;
} 