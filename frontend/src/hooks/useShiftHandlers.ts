import { useState } from 'react';
import type { Employee, ShiftType, ShiftTemplate } from '../types/shift';

// Mock-Daten für Schichtvorlagen (sollte später in eine separate Datei ausgelagert werden)
const shiftTemplates: ShiftTemplate[] = [
  { 
    id: '1', 
    name: 'Frühschicht-Woche', 
    description: '5 Tage Frühschicht', 
    weekPattern: ['F', 'F', 'F', 'F', 'F', null, null],
    color: '#ff6b6b'
  },
  { 
    id: '2', 
    name: 'Spätschicht-Woche', 
    description: '5 Tage Spätschicht', 
    weekPattern: ['S', 'S', 'S', 'S', 'S', null, null],
    color: '#4ecdc4'
  },
  { 
    id: '3', 
    name: 'Nachtschicht-Woche', 
    description: '5 Tage Nachtschicht', 
    weekPattern: ['N', 'N', 'N', 'N', 'N', null, null],
    color: '#45b7d1'
  },
  { 
    id: '4', 
    name: 'Wechselnde Schichten', 
    description: 'Früh-Spät-Nacht Rotation', 
    weekPattern: ['F', 'F', 'S', 'S', 'N', null, null],
    color: '#96ceb4'
  },
];

interface SelectedCell {
  employee: Employee;
  day: Date;
  shiftType: ShiftType;
}

/**
 * Hook für Event-Handler der Schichtplanung
 * Verwaltet Zellen-Klicks, Template-Auswahl und Modal-Zustand
 */
export const useShiftHandlers = (
  setShift: (employeeId: string, day: Date, shift: ShiftType) => void
) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  /**
   * Behandelt Klicks auf Schicht-Zellen
   */
  const handleCellClick = (employee: Employee, day: Date, shiftType: ShiftType) => {
    setSelectedCell({ employee, day, shiftType });
    setShowTemplateModal(true);
  };

  /**
   * Behandelt die Auswahl einer Schichtvorlage
   */
  const handleTemplateSelect = (templateId: string) => {
    if (selectedCell) {
      const template = shiftTemplates.find(t => t.id === templateId);
      if (template) {
        // Finde den Wochentag (0-6, Montag = 0)
        const dayOfWeek = selectedCell.day.getDay();
        const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Montag = 0
        const shiftType = template.weekPattern[adjustedDayOfWeek];
        
        if (shiftType) {
          setShift(selectedCell.employee.id, selectedCell.day, shiftType);
        }
      }
    }
    setShowTemplateModal(false);
  };

  /**
   * Schließt das Template-Modal
   */
  const handleCloseModal = () => {
    setShowTemplateModal(false);
    setSelectedCell(null);
  };

  return {
    showTemplateModal,
    selectedCell,
    handleCellClick,
    handleTemplateSelect,
    handleCloseModal,
    shiftTemplates
  };
}; 