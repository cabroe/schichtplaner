import React from 'react';
import DataTable from '../DataTable';
import ShiftPlanningTableHeader from './ShiftPlanningTableHeader';
import ShiftPlanningTableBody from './ShiftPlanningTableBody';
import type { Employee, ShiftType, WeekGroup } from '../../types/shift';

interface ShiftPlanningTableProps {
  weekGroups: WeekGroup[];
  calendarDays: Date[];
  employees: Employee[];
  getShift: (employeeId: string, day: Date) => ShiftType;
  onCellClick: (employee: Employee, day: Date, shiftType: ShiftType) => void;
  onContextMenu: (event: React.MouseEvent, employee: Employee, day: Date, shiftType: ShiftType) => void;
  readOnly?: boolean;
}

const ShiftPlanningTable: React.FC<ShiftPlanningTableProps> = ({
  weekGroups,
  calendarDays,
  employees,
  getShift,
  onCellClick,
  onContextMenu,
  readOnly = false
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <DataTable responsive striped bordered>
          <ShiftPlanningTableHeader 
            weekGroups={weekGroups} 
            calendarDays={calendarDays} 
          />
          <ShiftPlanningTableBody 
            employees={employees}
            calendarDays={calendarDays}
            getShift={getShift}
            onCellClick={onCellClick}
            onContextMenu={onContextMenu}
            readOnly={readOnly}
          />
          <tfoot>
            <tr className="summary">
              <td colSpan={calendarDays.length + 1} className="text-center text-muted">
                Insgesamt {employees.length} Mitarbeiter
              </td>
            </tr>
          </tfoot>
        </DataTable>
      </div>
    </div>
  );
};

export default ShiftPlanningTable; 