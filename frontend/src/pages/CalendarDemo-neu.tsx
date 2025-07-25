import React, { useState } from 'react';
import { Calendar } from '../components-new/ui';

const CalendarDemoNeu: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <Calendar 
        currentDate={new Date()} 
        onDateClick={handleDateClick}
        allowDateSelection={true}
      />
      <div className="mt-3">
        Ausgewähltes Datum: {selectedDate?.toLocaleDateString() ?? 'Kein Datum gewählt'}
      </div>
    </div>
  );
};

export default CalendarDemoNeu; 