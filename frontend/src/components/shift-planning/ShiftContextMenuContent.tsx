import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { formatWeekday } from '../../utils/shiftUtils';
import ShiftBadge from './ShiftBadge';
import { 
  ContextMenuItem, 
  ContextMenuDivider, 
  ContextSubmenu 
} from '../ContextMenu';
import type { Employee, ShiftType } from '../../types/shift';

interface ShiftContextMenuContentProps {
  employee: Employee;
  day: Date;
  shiftType: ShiftType;
  copiedShift: ShiftType;
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
  onSetShift: (shiftType: ShiftType) => void;
  onCopyShift: () => void;
  onPasteShift: () => void;
  onDeleteShift: () => void;
  onDeleteWeek: () => void;
}

const ShiftContextMenuContent: React.FC<ShiftContextMenuContentProps> = ({
  employee,
  day,
  shiftType,
  copiedShift,
  activeSubmenu,
  setActiveSubmenu,
  onSetShift,
  onCopyShift,
  onPasteShift,
  onDeleteShift,
  onDeleteWeek
}) => {
  return (
    <>
      <div className="dropdown-header">
        <div className="fw-bold">
          {employee.name} - {formatDate(day)} ({formatWeekday(day)})
        </div>
        {shiftType && (
          <div className="mt-1">
            Aktuelle Schicht: <ShiftBadge shiftType={shiftType} />
          </div>
        )}
      </div>
      
      <ContextMenuItem 
        onClick={() => onSetShift('F')} 
        icon="fas fa-sunrise"
      >
        Frühschicht setzen
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => onSetShift('S')} 
        icon="fas fa-sun"
      >
        Spätschicht setzen
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => onSetShift('N')} 
        icon="fas fa-moon"
      >
        Nachtschicht setzen
      </ContextMenuItem>
      
      <ContextMenuDivider />
      
      <ContextSubmenu 
        title="Weitere Schichttypen" 
        icon="fas fa-calendar-week"
        id="shift-types"
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      >
        <ContextMenuItem 
          onClick={() => onSetShift('U')} 
          icon="fas fa-calendar-check"
        >
          Urlaub setzen
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => onSetShift('K')} 
          icon="fas fa-bandaid"
        >
          Krank setzen
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => onSetShift('FR')} 
          icon="fas fa-calendar-x"
        >
          Frei setzen
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => onSetShift('FT')} 
          icon="fas fa-calendar-event"
        >
          Feiertag setzen
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => onSetShift('WE')} 
          icon="fas fa-calendar-weekend"
        >
          Wochenende setzen
        </ContextMenuItem>
      </ContextSubmenu>
      
      <ContextMenuDivider />
      
      <ContextMenuItem 
        onClick={onCopyShift} 
        icon="fas fa-copy"
        disabled={!shiftType}
      >
        Schicht kopieren
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={onPasteShift} 
        icon="fas fa-paste"
        disabled={!copiedShift}
      >
        Schicht einfügen
      </ContextMenuItem>
      
      <ContextMenuDivider />
      
      <ContextSubmenu 
        title="Aktionen" 
        icon="fas fa-cog"
        id="actions"
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      >
        <ContextMenuItem 
          onClick={onDeleteShift} 
          icon="fas fa-trash"
          disabled={!shiftType}
        >
          Schicht löschen
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={onDeleteWeek} 
          icon="fas fa-calendar-minus"
          danger={true}
        >
          Ganze Woche löschen
        </ContextMenuItem>
      </ContextSubmenu>
    </>
  );
};

export default ShiftContextMenuContent; 