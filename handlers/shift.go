package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
)

// GetShifts gibt alle Schichten zurück
func GetShifts(c echo.Context) error {
	var shifts []models.Shift

	if err := database.DB.Preload("User").Preload("Schedule").Find(&shifts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichten",
		})
	}

	return c.JSON(http.StatusOK, shifts)
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

	// Validiere Zeiten
	if shift.StartTime.After(shift.EndTime) {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Startzeit muss vor Endzeit liegen",
		})
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

	// Validiere Zeiten
	if updateData.StartTime.After(updateData.EndTime) {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Startzeit muss vor Endzeit liegen",
		})
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

// GetShiftsByUser gibt alle Schichten eines Benutzers zurück
func GetShiftsByUser(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzer-ID",
		})
	}

	var shifts []models.Shift
	if err := database.DB.Where("user_id = ?", userID).Preload("User").Preload("Schedule").Find(&shifts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichten",
		})
	}

	return c.JSON(http.StatusOK, shifts)
}
