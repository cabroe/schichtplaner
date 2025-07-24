import React, { useState, useEffect } from 'react';
import { userService } from '../services/users';
import type { User } from '../types';
import { 
  getWeekStart, 
  addDays, 
  getWeekNumber, 
  groupDaysByWeek, 
  generateCalendarDays} from '../utils/dateUtils';
import { ContextMenu } from '../components/ContextMenu';
import {
  ShiftPlanningTable,
  ShiftTemplateModal,
  ShiftContextMenuContent
} from '../components/shift-planning';
import type { Employee, ShiftType, ShiftTemplate, WeekGroup } from '../types/shift';

// Mock-Daten für Schichtvorlagen
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

// Hook für Schichtplanung
const useShiftPlanning = (weeksToShow: number) => {
  const [calendarDays] = useState(() => generateCalendarDays(weeksToShow));
  const [shifts, setShifts] = useState<Record<string, ShiftType>>({});
  const [copiedShift, setCopiedShift] = useState<ShiftType>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const getShift = (employeeId: string, day: Date): ShiftType => {
    const key = `${employeeId}-${day.toISOString().split('T')[0]}`;
    return shifts[key] || null;
  };

  const setShift = (employeeId: string, day: Date, shift: ShiftType) => {
    const key = `${employeeId}-${day.toISOString().split('T')[0]}`;
    setShifts(prev => ({
      ...prev,
      [key]: shift
    }));
  };

  const deleteWeek = (weekStart: Date) => {
    const newShifts = { ...shifts };
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayKey = day.toISOString().split('T')[0];
      
      Object.keys(newShifts).forEach(key => {
        if (key.includes(dayKey)) {
          delete newShifts[key];
        }
      });
    }
    setShifts(newShifts);
  };

  return {
    calendarDays,
    getShift,
    setShift,
    deleteWeek,
    copiedShift,
    setCopiedShift,
    activeSubmenu,
    setActiveSubmenu
  };
};

// Hook für Context Menu
const useContextMenu = (
  setShift: (employeeId: string, day: Date, shift: ShiftType) => void,
  deleteWeek: (weekStart: Date) => void,
  setCopiedShift: (shift: ShiftType) => void,
  copiedShift: ShiftType) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    isOpen: boolean;
    employee?: Employee;
    day?: Date;
    shiftType?: ShiftType;
  }>({ x: 0, y: 0, isOpen: false });

  const openContextMenu = (event: React.MouseEvent, employee: Employee, day: Date, shiftType: ShiftType) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      isOpen: true,
      employee,
      day,
      shiftType
    });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  const handleSetShift = (shift: ShiftType) => {
    if (contextMenu.employee && contextMenu.day) {
      setShift(contextMenu.employee.id, contextMenu.day, shift);
    }
    closeContextMenu();
  };

  const handleCopyShift = () => {
    if (contextMenu.employee && contextMenu.day) {
      const shift = contextMenu.shiftType;
      if (shift) {
        setCopiedShift(shift);
      }
    }
    closeContextMenu();
  };

  const handlePasteShift = () => {
    if (contextMenu.employee && contextMenu.day && copiedShift) {
      setShift(contextMenu.employee.id, contextMenu.day, copiedShift);
    }
    closeContextMenu();
  };

  const handleDeleteShift = () => {
    if (contextMenu.employee && contextMenu.day) {
      setShift(contextMenu.employee.id, contextMenu.day, null);
    }
    closeContextMenu();
  };

  const handleDeleteWeek = () => {
    if (contextMenu.day) {
      const weekStart = getWeekStart(contextMenu.day);
      deleteWeek(weekStart);
    }
    closeContextMenu();
  };

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleSetShift,
    handleCopyShift,
    handlePasteShift,
    handleDeleteShift,
    handleDeleteWeek
  };
};

// Hook für Schichtplanung-Handler
const useShiftPlanningHandlers = (setShift: (employeeId: string, day: Date, shift: ShiftType) => void) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ employee: Employee; day: Date; shiftType: ShiftType } | null>(null);

  const handleCellClick = (employee: Employee, day: Date, shiftType: ShiftType) => {
    setSelectedCell({ employee, day, shiftType });
    setShowTemplateModal(true);
  };

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

  const handleCloseModal = () => {
    setShowTemplateModal(false);
    setSelectedCell(null);
  };

  return {
    showTemplateModal,
    selectedCell,
    handleCellClick,
    handleTemplateSelect,
    handleCloseModal
  };
};

const ShiftPlanningPage: React.FC = () => {
  // State für die Anzahl der anzuzeigenden Wochen
  const [weeksToShow] = useState(4);
  
  // State für die Benutzer aus der API
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lade Benutzer beim Komponenten-Mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers();
        
        // Sicherheitsprüfung für die API-Antwort
        if (response && response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.warn('Unerwartete API-Antwort:', response);
          setUsers([]);
        }
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden der Benutzer:', err);
        setError('Benutzer konnten nicht geladen werden. Bitte versuche es später erneut.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };    
    fetchUsers();
  }, []);
  
  // Verwende den useShiftPlanning-Hook
  const {
    calendarDays,
    getShift,
    setShift,
    deleteWeek,
    copiedShift,
    setCopiedShift,
    activeSubmenu,
    setActiveSubmenu
  } = useShiftPlanning(weeksToShow);
  
  // Verwende den useContextMenu-Hook
  const {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleSetShift,
    handleCopyShift,
    handlePasteShift,
    handleDeleteShift,
    handleDeleteWeek
  } = useContextMenu(setShift, deleteWeek, setCopiedShift, copiedShift);
  
  // Verwende den useShiftPlanningHandlers-Hook
  const {
    showTemplateModal,
    selectedCell,
    handleCellClick,
    handleTemplateSelect,
    handleCloseModal
  } = useShiftPlanningHandlers(setShift);
  
  // Gruppiere die Tage nach Kalenderwochen
  const weekGroups: WeekGroup[] = groupDaysByWeek(calendarDays).map((days) => ({
    week: getWeekNumber(days[0]),
    days
  }));

  // Konvertiere User-Objekte in das Format, das die Komponente erwartet
  const employees: Employee[] = (users || []).map(user => ({
    id: user.id?.toString() || `user-${Math.random().toString(36).substr(2, 9)}`,
    name: user.name || 'Unbekannter Benutzer',
    username: user.username || 'unknown',
    email: user.email || '',
    color: user.color || '#6c757d',
    role: user.role || 'user'
  }));

  // Zeige Ladezustand oder Fehler an
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
              <p className="mt-3">Benutzer werden geladen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger m-3">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback wenn keine Benutzer verfügbar sind
  if (!employees || employees.length === 0) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info m-3">
              <h4>Keine Benutzer verfügbar</h4>
              <p>Es wurden keine Benutzer gefunden. Bitte stellen Sie sicher, dass Benutzer im System angelegt sind.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Schichtplanung</h1>
          
          {/* Schichtplanungs-Tabelle */}
          <ShiftPlanningTable
            weekGroups={weekGroups}
            calendarDays={calendarDays}
            employees={employees}
            getShift={getShift}
            onCellClick={handleCellClick}
            onContextMenu={openContextMenu}
          />

          {/* Context Menu */}
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            isOpen={contextMenu.isOpen}
            onClose={closeContextMenu}
          >
            {contextMenu.employee && contextMenu.day && (
              <ShiftContextMenuContent
                employee={contextMenu.employee}
                day={contextMenu.day}
                shiftType={contextMenu.shiftType || null}
                copiedShift={copiedShift}
                activeSubmenu={activeSubmenu}
                setActiveSubmenu={setActiveSubmenu}
                onSetShift={handleSetShift}
                onCopyShift={handleCopyShift}
                onPasteShift={handlePasteShift}
                onDeleteShift={handleDeleteShift}
                onDeleteWeek={handleDeleteWeek}
              />
            )}
          </ContextMenu>

          {/* Template Modal */}
          <ShiftTemplateModal
            show={showTemplateModal}
            onHide={handleCloseModal}
            selectedCell={selectedCell}
            templates={shiftTemplates}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default ShiftPlanningPage; 