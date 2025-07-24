import React, { useState, useEffect } from 'react';
import { userService } from '../services/users';
import type { User } from '../types';
import { 
  getWeekNumber, 
  groupDaysByWeek} from '../utils/dateUtils';
import { ContextMenu } from '../components/ContextMenu';
import {
  ShiftPlanningTable,
  ShiftTemplateModal,
  ShiftContextMenuContent
} from '../components/shift-planning';
import type { Employee, WeekGroup } from '../types/shift';
import { useShiftPlanning, useShiftContextMenu, useShiftHandlers } from '../hooks';

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
  } = useShiftContextMenu(setShift, deleteWeek, setCopiedShift, copiedShift);
  
  // Verwende den useShiftPlanningHandlers-Hook
  const {
    showTemplateModal,
    selectedCell,
    handleCellClick,
    handleTemplateSelect,
    handleCloseModal,
    shiftTemplates
  } = useShiftHandlers(setShift);

  // Konvertiere User zu Employee für die Komponenten
  const employees: Employee[] = users.map(user => ({
    id: user.id?.toString() || `user-${Math.random().toString(36).substr(2, 9)}`,
    name: user.name || user.username || 'Unbekannter Benutzer',
    username: user.username || '',
    email: user.email || '',
    color: user.color || '#6c757d',
    role: user.role || 'employee'
  }));

  // Gruppiere Kalendertage nach Wochen
  const weekGroups: WeekGroup[] = groupDaysByWeek(calendarDays).map((days) => ({
    week: getWeekNumber(days[0]),
    days
  }));

  // Fehlerbehandlung
  if (error) {
    return (
      <div className="container-xl">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Fehler beim Laden der Daten</h4>
              <p>{error}</p>
              <hr />
              <p className="mb-0">
                <button 
                  className="btn btn-outline-danger" 
                  onClick={() => window.location.reload()}
                >
                  Seite neu laden
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ladezustand
  if (loading) {
    return (
      <div className="container-xl">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Lade...</span>
              </div>
              <span className="ms-3">Lade Schichtplanung...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Schichtplanung</h1>
          
          {/* Schichtplanung-Tabelle */}
          <ShiftPlanningTable
            weekGroups={weekGroups}
            calendarDays={calendarDays}
            employees={employees}
            getShift={getShift}
            onCellClick={handleCellClick}
            onContextMenu={openContextMenu}
          />

          {/* Template-Modal */}
          <ShiftTemplateModal
            show={showTemplateModal}
            onHide={handleCloseModal}
            onTemplateSelect={handleTemplateSelect}
            templates={shiftTemplates}
            selectedCell={selectedCell}
          />

          {/* Context-Menu */}
          <ContextMenu
            isOpen={contextMenu.isOpen}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
          >
            {contextMenu.employee && contextMenu.day && (
              <ShiftContextMenuContent
                employee={contextMenu.employee}
                day={contextMenu.day}
                shiftType={contextMenu.shiftType || null}
                copiedShift={copiedShift}
                onSetShift={handleSetShift}
                onCopyShift={handleCopyShift}
                onPasteShift={handlePasteShift}
                onDeleteShift={handleDeleteShift}
                onDeleteWeek={handleDeleteWeek}
                activeSubmenu={activeSubmenu}
                setActiveSubmenu={setActiveSubmenu}
              />
            )}
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};

export default ShiftPlanningPage; 