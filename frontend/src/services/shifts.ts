import { api } from './api';
import type { Shift, ShiftForm, ShiftStatus } from '../types';

class ShiftService {
  // Alle Shifts abrufen (mit Pagination)
  async getShifts(page = 1, limit = 10) {
    return api.getShifts(page, limit);
  }

  // Einzelnen Shift abrufen
  async getShift(id: number) {
    return api.getShift(id);
  }

  // Neuen Shift erstellen
  async createShift(shiftData: ShiftForm) {
    return api.createShift(shiftData);
  }

  // Shift aktualisieren
  async updateShift(id: number, shiftData: Partial<ShiftForm>) {
    return api.updateShift(id, shiftData);
  }

  // Shift löschen
  async deleteShift(id: number) {
    return api.deleteShift(id);
  }

  // Shifts nach Status filtern
  async getShiftsByStatus(status: ShiftStatus, page = 1, limit = 10) {
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) => shift.status === status);
    }
    return response;
  }

  // Shifts nach Mitarbeiter filtern
  async getShiftsByEmployee(employeeId: number, page = 1, limit = 10) {
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) => shift.employee.id === employeeId);
    }
    return response;
  }

  // Shifts nach Datum filtern
  async getShiftsByDate(date: Date, page = 1, limit = 10) {
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) => {
        const shiftDate = new Date(shift.startTime);
        return shiftDate.toDateString() === date.toDateString();
      });
    }
    return response;
  }

  // Shifts nach Datumsbereich filtern
  async getShiftsByDateRange(startDate: Date, endDate: Date, page = 1, limit = 10) {
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) => {
        const shiftStart = new Date(shift.startTime);
        const shiftEnd = new Date(shift.endTime);
        return shiftStart >= startDate && shiftEnd <= endDate;
      });
    }
    return response;
  }

  // Heutige Shifts
  async getTodayShifts(page = 1, limit = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.getShiftsByDateRange(today, tomorrow, page, limit);
  }

  // Kommende Shifts (ab heute)
  async getUpcomingShifts(page = 1, limit = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) => {
        const shiftStart = new Date(shift.startTime);
        return shiftStart >= today;
      });
    }
    return response;
  }

  // Shift Status ändern
  async updateShiftStatus(id: number, status: ShiftStatus) {
    return api.updateShift(id, { status });
  }

  // Shifts nach Schedule filtern
  async getShiftsBySchedule(scheduleId: number, page = 1, limit = 10) {
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) => shift.schedule.id === scheduleId);
    }
    return response;
  }

  // Shifts nach Zeitraum suchen
  async searchShifts(query: string, page = 1, limit = 10) {
    const response = await api.getShifts(page, limit);
    if (response.data) {
      response.data = response.data.filter((shift: Shift) =>
        shift.name.toLowerCase().includes(query.toLowerCase()) ||
        (shift.description && shift.description.toLowerCase().includes(query.toLowerCase())) ||
        shift.employee.firstName.toLowerCase().includes(query.toLowerCase()) ||
        shift.employee.lastName.toLowerCase().includes(query.toLowerCase())
      );
    }
    return response;
  }
}

export const shiftService = new ShiftService(); 