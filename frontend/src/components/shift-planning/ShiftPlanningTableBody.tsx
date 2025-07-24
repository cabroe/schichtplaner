import React from 'react';
import ShiftBadge from './ShiftBadge';
import { getTooltipForShift } from '../../utils/shiftUtils';
import type { Employee, ShiftType } from '../../types/shift';

interface ShiftPlanningTableBodyProps {
  employees: Employee[];
  calendarDays: Date[];
  getShift: (employeeId: string, day: Date) => ShiftType;
  onCellClick: (employee: Employee, day: Date, shiftType: ShiftType) => void;
  onContextMenu: (event: React.MouseEvent, employee: Employee, day: Date, shiftType: ShiftType) => void;
  readOnly?: boolean;
}

const ShiftPlanningTableBody: React.FC<ShiftPlanningTableBodyProps> = ({
  employees,
  calendarDays,
  getShift,
  onCellClick,
  onContextMenu,
  readOnly = false
}) => {
  return (
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
          {calendarDays.map((day, columnIndex) => {
            const shiftType = getShift(employee.id, day);
            const tooltip = getTooltipForShift(shiftType);
            
            return (
              <td 
                key={columnIndex} 
                className="text-center position-relative"
                style={{ 
                  cursor: readOnly ? 'default' : 'pointer',
                  minHeight: '60px'
                }}
                onClick={() => !readOnly && onCellClick(employee, day, shiftType)}
                onContextMenu={(e) => !readOnly && onContextMenu(e, employee, day, shiftType)}
                title={tooltip}
              >
                <ShiftBadge shiftType={shiftType} />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default ShiftPlanningTableBody; 