import React, { useState, useEffect } from 'react';
import { userService } from '../services/users';
import type { User } from '../types';
import { 
  getWeekStart, 
  addDays, 
  getWeekNumber, 
  groupDaysByWeek, 
  generateCalendarDays,
  formatCalendarDate,
  formatCalendarDateLong
} from '../utils/dateUtils';
import { ContextMenu, ContextMenuItem, ContextMenuDivider } from '../components/ContextMenu';
import DataTable from '../components/DataTable';

// Mock-Daten für Schichtvorlagen
const shiftTemplates = [
  { id: 1, name: 'Frühschicht', startTime: '06:00', endTime: '14:00', color: '#ff6b6b' },
  { id: 2, name: 'Spätschicht', startTime: '14:00', endTime: '22:00', color: '#4ecdc4' },
  { id: 3, name: 'Nachtschicht', startTime: '22:00', endTime: '06:00', color: '#45b7d1' },
  { id: 4, name: 'Teilzeit', startTime: '09:00', endTime: '13:00', color: '#96ceb4' },
];

// Hook für Schichtplanung
const useShiftPlanning = (weeksToShow: number) => {
  const [calendarDays] = useState(() => generateCalendarDays(weeksToShow));
  const [shifts, setShifts] = useState<Record<string, any>>({});
  const [copiedShift, setCopiedShift] = useState<any>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const getShift = (employeeId: string, day: Date) => {
    const key = `${employeeId}-${day.toISOString().split('T')[0]}`;
    return shifts[key] || null;
  };

  const setShift = (employeeId: string, day: Date, shift: any) => {
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
  setShift: (employeeId: string, day: Date, shift: any) => void,
  deleteWeek: (weekStart: Date) => void,
  setCopiedShift: (shift: any) => void,
  copiedShift: any) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    isOpen: boolean;
    employee?: any;
    day?: Date;
    shiftType?: any;
  }>({ x: 0, y: 0, isOpen: false });

  const openContextMenu = (event: React.MouseEvent, employee: any, day: Date, shiftType?: any) => {
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

  const handleSetShift = (shift: any) => {
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
const useShiftPlanningHandlers = (setShift: (employeeId: string, day: Date, shift: any) => void) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ employee: any; day: Date } | null>(null);

  const handleCellClick = (employee: any, day: Date) => {
    setSelectedCell({ employee, day });
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = (template: any) => {
    if (selectedCell) {
      setShift(selectedCell.employee.id, selectedCell.day, template);
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
    handleCellClick,
    handleTemplateSelect,
    handleCloseModal
  } = useShiftPlanningHandlers(setShift);
  
  // Gruppiere die Tage nach Kalenderwochen
  const weekGroups = groupDaysByWeek(calendarDays);

  // Konvertiere User-Objekte in das Format, das die Komponente erwartet
  const employees = (users || []).map(user => ({
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
          
          {/* Schichtplanungs-Tabelle mit DataTable-Komponente */}
          <div className="card">
            <div className="card-body">
              <DataTable responsive striped bordered>
                <thead>
                  <tr>
                    <th style={{ minWidth: '150px' }}>Mitarbeiter</th>
                    {weekGroups.map((week, weekIndex) => (
                      <th key={weekIndex} colSpan={7} className="text-center">
                        KW {getWeekNumber(week[0])}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th></th>
                    {calendarDays.map((day, dayIndex) => (
                      <th key={dayIndex} className="text-center" style={{ minWidth: '100px' }}>
                        <div>{formatCalendarDate(day)}</div>
                        <div className="small">{formatCalendarDateLong(day)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2" 
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: employee.color || '#6c757d' 
                            }}
                          />
                          <div>
                            <div className="fw-bold">{employee.name}</div>
                            <div className="small text-muted">{employee.username}</div>
                          </div>
                        </div>
                      </td>
                      {calendarDays.map((day, dayIndex) => {
                        const shift = getShift(employee.id, day);
                        return (
                          <td 
                            key={dayIndex}
                            className="text-center position-relative"
                            style={{ 
                              backgroundColor: shift ? shift.color : 'transparent',
                              cursor: 'pointer',
                              minHeight: '60px'
                            }}
                            onClick={() => handleCellClick(employee, day)}
                            onContextMenu={(e) => openContextMenu(e, employee, day, shift)}
                          >
                            {shift && (
                              <div className="small">
                                <div className="fw-bold">{shift.name}</div>
                                <div>{shift.startTime} - {shift.endTime}</div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          </div>

          {/* Context Menu mit vorhandener ContextMenu-Komponente */}
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            isOpen={contextMenu.isOpen}
            onClose={closeContextMenu}
          >
            <ContextMenuItem onClick={() => handleSetShift(shiftTemplates[0])}>
              <i className="fas fa-sun me-2"></i>
              Frühschicht zuweisen
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSetShift(shiftTemplates[1])}>
              <i className="fas fa-moon me-2"></i>
              Spätschicht zuweisen
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSetShift(shiftTemplates[2])}>
              <i className="fas fa-star me-2"></i>
              Nachtschicht zuweisen
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSetShift(shiftTemplates[3])}>
              <i className="fas fa-clock me-2"></i>
              Teilzeit zuweisen
            </ContextMenuItem>
            <ContextMenuDivider />
            {contextMenu.shiftType && (
              <>
                <ContextMenuItem onClick={handleCopyShift}>
                  <i className="fas fa-copy me-2"></i>
                  Schicht kopieren
                </ContextMenuItem>
                <ContextMenuItem onClick={handleDeleteShift} danger>
                  <i className="fas fa-trash me-2"></i>
                  Schicht löschen
                </ContextMenuItem>
              </>
            )}
            {copiedShift && (
              <ContextMenuItem onClick={handlePasteShift}>
                <i className="fas fa-paste me-2"></i>
                Schicht einfügen
              </ContextMenuItem>
            )}
            <ContextMenuDivider />
            <ContextMenuItem onClick={handleDeleteWeek} danger>
              <i className="fas fa-calendar-times me-2"></i>
              Woche löschen
            </ContextMenuItem>
          </ContextMenu>

          {/* Template Modal */}
          {showTemplateModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Schichtvorlage auswählen</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={handleCloseModal}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      {shiftTemplates.map(template => (
                        <div key={template.id} className="col-6 mb-3">
                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => handleTemplateSelect(template)}
                            style={{ borderColor: template.color, color: template.color }}
                          >
                            <div className="fw-bold">{template.name}</div>
                            <div className="small">{template.startTime} - {template.endTime}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftPlanningPage; 