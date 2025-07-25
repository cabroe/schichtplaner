import { forwardRef, useState, useRef, useEffect } from 'react';
import { FormField } from './FormField';
import { Icon } from '../ui/Icon';

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  format?: string;
  className?: string;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  todayButton?: boolean;
}

/**
 * DatePicker-Komponente
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  value = '',
  onChange,
  placeholder = 'Datum auswählen',
  label,
  required = false,
  disabled = false,
  className = '',
  error,
  helpText,
  clearable = true,
  todayButton = true
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date => {
    return new Date(dateString);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    onChange?.(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange?.('');
  };

  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];
    
    // Leere Tage am Anfang
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Tage des Monats
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    return (
      <div className="p-2">
        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
          <button
            type="button"
            className="btn btn-sm btn-link"
            onClick={() => setCurrentDate(new Date(year, month - 1))}
          >
            <Icon name="chevron-left" />
          </button>
          <span className="fw-bold">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-link"
            onClick={() => setCurrentDate(new Date(year, month + 1))}
          >
            <Icon name="chevron-right" />
          </button>
        </div>

        <div className="p-2">
          <div className="d-flex mb-1">
            {dayNames.map(day => (
              <div key={day} className="text-center text-muted small" style={{ width: '14.28%' }}>
                {day}
              </div>
            ))}
          </div>

          <div>
            {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
              <div key={weekIndex} className="d-flex">
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                  <div key={dayIndex} className="text-center" style={{ width: '14.28%' }}>
                    {day ? (
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          selectedDate && formatDate(selectedDate) === formatDate(day)
                            ? 'btn-primary'
                            : 'btn-link'
                        }`}
                        onClick={() => handleDateSelect(day)}
                        disabled={disabled}
                      >
                        {day.getDate()}
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {(todayButton || clearable) && (
          <div className="d-flex justify-content-between p-2 border-top">
            {todayButton && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleToday}
              >
                Heute
              </button>
            )}
            {clearable && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClear}
              >
                Löschen
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`position-relative w-100${className ? ` ${className}` : ''}`} ref={containerRef}>
      <div className="input-group">
        <FormField
          ref={ref}
          name="date"
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ''}
          onChange={(e) => {
            const date = parseDate(e.target.value);
            if (!isNaN(date.getTime())) {
              handleDateSelect(date);
            }
          }}
          placeholder={placeholder}
          label={label}
          required={required}
          disabled={disabled}
          error={error}
          helpText={helpText}
          readOnly
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Icon name="calendar" />
        </button>
      </div>
      
      {isOpen && (
        <div className="position-absolute bg-white border rounded shadow-sm" style={{ zIndex: 1050, top: '100%', left: 0, right: 0 }}>
          {renderCalendar()}
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker; 