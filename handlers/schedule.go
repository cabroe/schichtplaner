package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// GetSchedules gibt alle Schichtpläne mit Pagination zurück
func GetSchedules(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var schedules []models.Schedule
	var total int64

	// Zähle die Gesamtanzahl
	database.DB.Model(&models.Schedule{}).Count(&total)

	// Lade die paginierten Daten mit Preloads
	if err := database.DB.Preload("Shifts").Offset(params.Offset).Limit(params.PageSize).Find(&schedules).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichtpläne",
		})
	}

	response := utils.CreatePaginatedResponse(schedules, int(total), params)
	return c.JSON(http.StatusOK, response)
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

	// Validiere Pflichtfelder mit dem Validator
	validator := utils.NewValidator()
	validator.RequiredString("Name", schedule.Name, "Name ist ein Pflichtfeld")
	validator.RequiredTime("StartDate", schedule.StartDate, "Startdatum ist ein Pflichtfeld")
	validator.RequiredTime("EndDate", schedule.EndDate, "Enddatum ist ein Pflichtfeld")
	validator.TimeRange("StartDate", "EndDate", schedule.StartDate, schedule.EndDate, "Startdatum muss vor Enddatum liegen")

	if err := validator.ValidateAndRespond(c); err != nil {
		return err
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

	// Validiere Pflichtfelder mit dem Validator
	validator := utils.NewValidator()
	validator.RequiredString("Name", updateData.Name, "Name ist ein Pflichtfeld")
	validator.RequiredTime("StartDate", updateData.StartDate, "Startdatum ist ein Pflichtfeld")
	validator.RequiredTime("EndDate", updateData.EndDate, "Enddatum ist ein Pflichtfeld")
	validator.TimeRange("StartDate", "EndDate", updateData.StartDate, updateData.EndDate, "Startdatum muss vor Enddatum liegen")

	if err := validator.ValidateAndRespond(c); err != nil {
		return err
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

// GetActiveSchedules gibt alle aktiven Schichtpläne mit Pagination zurück
func GetActiveSchedules(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var schedules []models.Schedule
	var total int64

	// Zähle die Gesamtanzahl der aktiven Schichtpläne
	database.DB.Model(&models.Schedule{}).Where("is_active = ?", true).Count(&total)

	// Lade die paginierten Daten
	if err := database.DB.Where("is_active = ?", true).Preload("Shifts").Offset(params.Offset).Limit(params.PageSize).Find(&schedules).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Schichtpläne",
		})
	}

	response := utils.CreatePaginatedResponse(schedules, int(total), params)
	return c.JSON(http.StatusOK, response)
}
