import { api } from './api';
import type { Schedule, ScheduleForm } from '../types';

class ScheduleService {
  // Alle Schedules abrufen (mit Pagination)
  async getSchedules(page = 1, limit = 10) {
    return api.getSchedules(page, limit);
  }

  // Einzelnen Schedule abrufen
  async getSchedule(id: number) {
    return api.getSchedule(id);
  }

  // Neuen Schedule erstellen
  async createSchedule(scheduleData: ScheduleForm) {
    return api.createSchedule(scheduleData);
  }

  // Schedule aktualisieren
  async updateSchedule(id: number, scheduleData: Partial<ScheduleForm>) {
    return api.updateSchedule(id, scheduleData);
  }

  // Schedule löschen
  async deleteSchedule(id: number) {
    return api.deleteSchedule(id);
  }

  // Schedules nach Datum filtern
  async getSchedulesByDateRange(startDate: Date, endDate: Date, page = 1, limit = 10) {
    const response = await api.getSchedules(page, limit);
    if (response.data) {
      response.data = response.data.filter((schedule: Schedule) => {
        const scheduleStart = new Date(schedule.startDate);
        const scheduleEnd = new Date(schedule.endDate);
        return scheduleStart >= startDate && scheduleEnd <= endDate;
      });
    }
    return response;
  }

  // Aktuelle Schedules (heute und in der Zukunft)
  async getCurrentSchedules(page = 1, limit = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const response = await api.getSchedules(page, limit);
    if (response.data) {
      response.data = response.data.filter((schedule: Schedule) => {
        const scheduleEnd = new Date(schedule.endDate);
        return scheduleEnd >= today;
      });
    }
    return response;
  }

  // Schedules nach Erstellungsdatum sortieren
  async getSchedulesByCreatedDate(page = 1, limit = 10, ascending = false) {
    const response = await api.getSchedules(page, limit);
    if (response.data) {
      response.data.sort((a: Schedule, b: Schedule) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
    }
    return response;
  }

  // Schedules nach Name suchen
  async searchSchedules(query: string, page = 1, limit = 10) {
    const response = await api.getSchedules(page, limit);
    if (response.data) {
      response.data = response.data.filter((schedule: Schedule) =>
        schedule.name.toLowerCase().includes(query.toLowerCase()) ||
        (schedule.description && schedule.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    return response;
  }
}

export const scheduleService = new ScheduleService(); 