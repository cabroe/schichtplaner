import React from 'react';
import Card from '../ui/Card';
import ShiftCell from './ShiftCell';
import type { Employee, ShiftType, WeekGroup } from '../../types/shift';

export interface ShiftGridProps {
  weekGroups: WeekGroup[];
  calendarDays: Date[];
  employees: Employee[];
  getShift: (employeeId: string, day: Date) => ShiftType;
  onCellClick: (employee: Employee, day: Date, shiftType: ShiftType) => void;
  onContextMenu: (event: React.MouseEvent, employee: Employee, day: Date, shiftType: ShiftType) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * Moderne Schichtplanungs-Grid-Komponente
 */
export const ShiftGrid: React.FC<ShiftGridProps> = ({
  weekGroups,
  calendarDays,
  employees,
  getShift,
  onCellClick,
  onContextMenu,
  readOnly = false,
  className = ''
}) => {
  const renderHeader = () => (
    <thead>
      <tr>
        <th className="text-start" style={{ minWidth: '150px' }}>
          Mitarbeiter
        </th>
        {weekGroups.map((weekGroup) => (
          <th key={weekGroup.week} colSpan={weekGroup.days.length} className="text-center">
            <div className="d-flex flex-column">
              <span className="fw-bold">KW {weekGroup.week}</span>
              <small className="text-muted">
                {weekGroup.days[0].toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - 
                {weekGroup.days[weekGroup.days.length - 1].toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              </small>
            </div>
          </th>
        ))}
      </tr>
      <tr>
        <th></th>
        {calendarDays.map((day) => (
          <th key={day.toISOString()} className="text-center" style={{ minWidth: '60px' }}>
            <div className="d-flex flex-column">
              <span className="fw-bold">
                {day.toLocaleDateString('de-DE', { weekday: 'short' })}
              </span>
              <small className="text-muted">
                {day.toLocaleDateString('de-DE', { day: '2-digit' })}
              </small>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderBody = () => (
    <tbody>
      {employees.map((employee) => (
        <tr key={employee.id}>
          <td className="text-start">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold"
                style={{ 
                  backgroundColor: employee.color,
                  width: '32px', 
                  height: '32px' 
                }}
              >
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-bold">{employee.name}</div>
                <small className="text-muted">{employee.role}</small>
              </div>
            </div>
          </td>
          {calendarDays.map((day) => {
            const shiftType = getShift(employee.id, day);
            return (
              <td key={`${employee.id}-${day.toISOString()}`} className="text-center">
                <ShiftCell
                  shiftType={shiftType}
                  onClick={() => onCellClick(employee, day, shiftType)}
                  onContextMenu={(e: React.MouseEvent) => onContextMenu(e, employee, day, shiftType)}
                  readOnly={readOnly}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );

  const renderFooter = () => (
    <tfoot>
      <tr className="table-light">
        <td colSpan={calendarDays.length + 1} className="text-center text-muted">
          <strong>Insgesamt {employees.length} Mitarbeiter</strong>
        </td>
      </tr>
    </tfoot>
  );

  return (
    <Card className={className}>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </table>
      </div>
    </Card>
  );
};

export default ShiftGrid; 