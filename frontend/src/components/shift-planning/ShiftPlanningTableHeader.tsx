import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { formatWeekday, getWeekdayClass, getWeekNumberClass } from '../../utils/shiftUtils';
import type { WeekGroup } from '../../types/shift';

interface ShiftPlanningTableHeaderProps {
  weekGroups: WeekGroup[];
  calendarDays: Date[];
}

const ShiftPlanningTableHeader: React.FC<ShiftPlanningTableHeaderProps> = ({ 
  weekGroups, 
  calendarDays 
}) => {
  return (
    <thead>
      {/* Zeile für Kalenderwochen */}
      <tr>
        <th rowSpan={2} style={{ minWidth: '150px' }}>Mitarbeiter</th>
        {weekGroups.map((group, groupIndex) => (
          <th 
            key={`week-${groupIndex}`} 
            colSpan={group.days.length} 
            className={`text-center ${getWeekNumberClass()}`}
          >
            KW {group.week}
          </th>
        ))}
      </tr>
      {/* Zeile für Wochentage */}
      <tr>
        {calendarDays.map((day, columnIndex) => (
          <th 
            key={columnIndex} 
            className="text-center p-1"
            style={{ minWidth: '100px' }}
          >
            <div className={getWeekdayClass(day)}>{formatWeekday(day)}</div>
            <div className="small">{formatDate(day)}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ShiftPlanningTableHeader; 