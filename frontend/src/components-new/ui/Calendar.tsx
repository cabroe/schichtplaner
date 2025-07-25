import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
  description?: string;
  allDay?: boolean;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  currentDate?: Date;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWeekNumbers?: boolean;
  showTodayHighlight?: boolean;
  allowDateSelection?: boolean;
}

/**
 * Kalender-Komponente
 */
export const Calendar: React.FC<CalendarProps> = ({
  events = [],
  currentDate = new Date(),
  onDateClick,
  onEventClick,
  className = '',
  size = 'md',
  showWeekNumbers = false,
  showTodayHighlight = true,
  allowDateSelection = true
}) => {
  const [viewDate, setViewDate] = useState(currentDate);

  const today = new Date();
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = useMemo(() => {
    const days = [];
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    
    // Vorheriger Monat
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Aktueller Monat
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    // Nächster Monat
    const remainingDays = 42 - days.length; // 6 Wochen * 7 Tage
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth, today]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    if (allowDateSelection) {
      onDateClick?.(date);
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  const goToPreviousMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setViewDate(today);
  };

  const getCalendarClass = () => {
    const classes = [
      'border rounded p-3',
      size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getDayClass = (day: { date: Date; isCurrentMonth: boolean; isToday: boolean }) => {
    const classes = [
      'border p-2 text-center',
      !day.isCurrentMonth ? 'text-muted bg-light' : '',
      day.isToday && showTodayHighlight ? 'bg-primary text-white' : '',
      allowDateSelection ? 'cursor-pointer' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  return (
    <div className={getCalendarClass()}>
      <div className="d-flex align-items-center justify-content-between mb-3">
                               <button
                         type="button"
                         className="btn btn-sm btn-outline-secondary"
                         onClick={goToPreviousMonth}
                       >
                         <Icon name="chevron-left" />
                       </button>
        
        <div>
          <h4 className="mb-0">
            {monthNames[currentMonth]} {currentYear}
          </h4>
        </div>
        
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={goToToday}
          >
            Heute
          </button>
                                   <button
                           type="button"
                           className="btn btn-sm btn-outline-secondary"
                           onClick={goToNextMonth}
                         >
                           <Icon name="chevron-right" />
                         </button>
        </div>
      </div>
      
      <div>
        <div className="d-flex">
          {showWeekNumbers && <div className="border p-2 text-center text-muted small" style={{ width: '40px' }} />}
          {dayNames.map(dayName => (
            <div key={dayName} className="border p-2 text-center fw-bold" style={{ flex: 1 }}>
              {dayName}
            </div>
          ))}
        </div>
        
        <div>
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <div key={weekIndex} className="d-flex">
              {showWeekNumbers && (
                <div className="border p-2 text-center text-muted small" style={{ width: '40px' }}>
                  {Math.ceil((weekIndex * 7 + 1) / 7)}
                </div>
              )}
              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day.date);
                return (
                  <div
                    key={dayIndex}
                    className={getDayClass(day)}
                    style={{ flex: 1, minHeight: '80px' }}
                    onClick={() => handleDateClick(day.date)}
                  >
                    <div className="fw-bold mb-1">
                      {day.date.getDate()}
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="mt-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className="small p-1 rounded mb-1 text-white"
                            style={{ backgroundColor: event.color || '#007bff' }}
                            onClick={(e) => handleEventClick(event, e)}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="small text-muted">
                            +{dayEvents.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 