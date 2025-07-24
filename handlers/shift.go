package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// GetShifts gibt alle Schichten mit Pagination zurück
func GetShifts(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var shifts []models.Shift
	var total int64

	// Zähle die Gesamtanzahl
	database.DB.Model(&models.Shift{}).Count(&total)

	// Lade die paginierten Daten mit Preloads
	if err := database.DB.Preload("User").Preload("Schedule").Offset(params.Offset).Limit(params.PageSize).Find(&shifts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichten",
		})
	}

	response := utils.CreatePaginatedResponse(shifts, int(total), params)
	return c.JSON(http.StatusOK, response)
}

// GetShift gibt eine spezifische Schicht zurück
func GetShift(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schicht-ID",
		})
	}

	var shift models.Shift
	if err := database.DB.Preload("User").Preload("Schedule").First(&shift, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schicht nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, shift)
}

// CreateShift erstellt eine neue Schicht
func CreateShift(c echo.Context) error {
	var shift models.Shift

	if err := c.Bind(&shift); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtdaten",
		})
	}

	// Validiere Pflichtfelder mit dem Validator
	validator := utils.NewValidator()
	validator.RequiredUint("UserID", shift.UserID, "Benutzer-ID ist ein Pflichtfeld")
	validator.RequiredUint("ScheduleID", shift.ScheduleID, "Schichtplan-ID ist ein Pflichtfeld")
	validator.RequiredTime("StartTime", shift.StartTime, "Startzeit ist ein Pflichtfeld")
	validator.RequiredTime("EndTime", shift.EndTime, "Endzeit ist ein Pflichtfeld")
	validator.TimeRange("StartTime", "EndTime", shift.StartTime, shift.EndTime, "Startzeit muss vor Endzeit liegen")

	if err := validator.ValidateAndRespond(c); err != nil {
		return err
	}

	if err := database.DB.Create(&shift).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Erstellen der Schicht",
		})
	}

	return c.JSON(http.StatusCreated, shift)
}

// UpdateShift aktualisiert eine bestehende Schicht
func UpdateShift(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schicht-ID",
		})
	}

	var shift models.Shift
	if err := database.DB.First(&shift, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schicht nicht gefunden",
		})
	}

	var updateData models.Shift
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtdaten",
		})
	}

	// Validiere Pflichtfelder mit dem Validator
	validator := utils.NewValidator()
	validator.RequiredUint("UserID", updateData.UserID, "Benutzer-ID ist ein Pflichtfeld")
	validator.RequiredUint("ScheduleID", updateData.ScheduleID, "Schichtplan-ID ist ein Pflichtfeld")
	validator.RequiredTime("StartTime", updateData.StartTime, "Startzeit ist ein Pflichtfeld")
	validator.RequiredTime("EndTime", updateData.EndTime, "Endzeit ist ein Pflichtfeld")
	validator.TimeRange("StartTime", "EndTime", updateData.StartTime, updateData.EndTime, "Startzeit muss vor Endzeit liegen")

	if err := validator.ValidateAndRespond(c); err != nil {
		return err
	}

	if err := database.DB.Model(&shift).Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren der Schicht",
		})
	}

	return c.JSON(http.StatusOK, shift)
}

// DeleteShift löscht eine Schicht
func DeleteShift(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schicht-ID",
		})
	}

	var shift models.Shift
	if err := database.DB.First(&shift, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schicht nicht gefunden",
		})
	}

	if err := database.DB.Delete(&shift).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Löschen der Schicht",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Schicht erfolgreich gelöscht",
	})
}

// GetShiftsByUser gibt alle Schichten eines Benutzers mit Pagination zurück
func GetShiftsByUser(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzer-ID",
		})
	}

	// Prüfe, ob der User existiert
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Benutzer nicht gefunden",
		})
	}

	params := utils.GetPaginationParams(c)

	var shifts []models.Shift
	var total int64

	// Zähle die Gesamtanzahl der Schichten des Benutzers
	database.DB.Model(&models.Shift{}).Where("user_id = ?", userID).Count(&total)

	// Lade die paginierten Daten
	if err := database.DB.Where("user_id = ?", userID).Preload("User").Preload("Schedule").Offset(params.Offset).Limit(params.PageSize).Find(&shifts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichten",
		})
	}

	response := utils.CreatePaginatedResponse(shifts, int(total), params)
	return c.JSON(http.StatusOK, response)
}
