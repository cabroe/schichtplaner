package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
)

// GetSchedules gibt alle Schichtpläne zurück
func GetSchedules(c echo.Context) error {
	var schedules []models.Schedule

	if err := database.DB.Preload("Shifts").Find(&schedules).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichtpläne",
		})
	}

	return c.JSON(http.StatusOK, schedules)
}

// GetSchedule gibt einen spezifischen Schichtplan zurück
func GetSchedule(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtplan-ID",
		})
	}

	var schedule models.Schedule
	if err := database.DB.Preload("Shifts.User").First(&schedule, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtplan nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, schedule)
}

// CreateSchedule erstellt einen neuen Schichtplan
func CreateSchedule(c echo.Context) error {
	var schedule models.Schedule

	if err := c.Bind(&schedule); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtplan-Daten",
		})
	}

	// Validiere Zeitraum
	if schedule.StartDate.After(schedule.EndDate) {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Startdatum muss vor Enddatum liegen",
		})
	}

	if err := database.DB.Create(&schedule).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Erstellen des Schichtplans",
		})
	}

	return c.JSON(http.StatusCreated, schedule)
}

// UpdateSchedule aktualisiert einen bestehenden Schichtplan
func UpdateSchedule(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtplan-ID",
		})
	}

	var schedule models.Schedule
	if err := database.DB.First(&schedule, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtplan nicht gefunden",
		})
	}

	var updateData models.Schedule
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtplan-Daten",
		})
	}

	// Validiere Zeitraum
	if updateData.StartDate.After(updateData.EndDate) {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Startdatum muss vor Enddatum liegen",
		})
	}

	if err := database.DB.Model(&schedule).Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren des Schichtplans",
		})
	}

	return c.JSON(http.StatusOK, schedule)
}

// DeleteSchedule löscht einen Schichtplan
func DeleteSchedule(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtplan-ID",
		})
	}

	var schedule models.Schedule
	if err := database.DB.First(&schedule, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtplan nicht gefunden",
		})
	}

	if err := database.DB.Delete(&schedule).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Löschen des Schichtplans",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Schichtplan erfolgreich gelöscht",
	})
}

// GetActiveSchedules gibt alle aktiven Schichtpläne zurück
func GetActiveSchedules(c echo.Context) error {
	var schedules []models.Schedule

	if err := database.DB.Where("is_active = ?", true).Preload("Shifts").Find(&schedules).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Schichtpläne",
		})
	}

	return c.JSON(http.StatusOK, schedules)
}
