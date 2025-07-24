package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// GetShiftTypes gibt alle Schichttypen mit Pagination zurück
func GetShiftTypes(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var shiftTypes []models.ShiftType
	var total int64

	// Zähle die Gesamtanzahl
	database.DB.Model(&models.ShiftType{}).Count(&total)

	// Lade die paginierten Daten, sortiert nach SortOrder und Name
	if err := database.DB.Order("sort_order ASC, name ASC").Offset(params.Offset).Limit(params.PageSize).Find(&shiftTypes).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichttypen",
		})
	}

	response := utils.CreatePaginatedResponse(shiftTypes, int(total), params)
	return c.JSON(http.StatusOK, response)
}

// GetActiveShiftTypes gibt nur aktive Schichttypen zurück
func GetActiveShiftTypes(c echo.Context) error {
	var shiftTypes []models.ShiftType

	if err := database.DB.Where("is_active = ?", true).Order("sort_order ASC, name ASC").Find(&shiftTypes).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Schichttypen",
		})
	}

	return c.JSON(http.StatusOK, shiftTypes)
}

// GetShiftType gibt einen spezifischen Schichttyp zurück
func GetShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichttyp-ID",
		})
	}

	var shiftType models.ShiftType
	if err := database.DB.First(&shiftType, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichttyp nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, shiftType)
}

// CreateShiftType erstellt einen neuen Schichttyp
func CreateShiftType(c echo.Context) error {
	var shiftType models.ShiftType

	if err := c.Bind(&shiftType); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichttyp-Daten",
		})
	}

	// Validiere Pflichtfelder mit dem Validator
	validator := utils.NewValidator()
	validator.RequiredString("Name", shiftType.Name, "Name ist ein Pflichtfeld")

	// Validiere Standardzeiten (nur wenn beide gesetzt sind)
	if !shiftType.DefaultStart.IsZero() && !shiftType.DefaultEnd.IsZero() {
		validator.TimeRange("DefaultStart", "DefaultEnd", shiftType.DefaultStart, shiftType.DefaultEnd, "Standard-Startzeit muss vor Standard-Endzeit liegen")
	}

	// Validiere Dauer-Beschränkungen (nur wenn beide > 0 sind)
	if shiftType.MinDuration > 0 && shiftType.MaxDuration > 0 {
		validator.NumberRange("MinDuration", "MaxDuration", shiftType.MinDuration, shiftType.MaxDuration, "Mindestdauer darf nicht größer als Maximaldauer sein")
	}

	if err := validator.ValidateAndRespond(c); err != nil {
		return err
	}

	if err := database.DB.Create(&shiftType).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Erstellen des Schichttyps",
		})
	}

	return c.JSON(http.StatusCreated, shiftType)
}

// UpdateShiftType aktualisiert einen bestehenden Schichttyp
func UpdateShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichttyp-ID",
		})
	}

	var shiftType models.ShiftType
	if err := database.DB.First(&shiftType, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichttyp nicht gefunden",
		})
	}

	var updateData models.ShiftType
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichttyp-Daten",
		})
	}

	// Validiere Pflichtfelder mit dem Validator
	validator := utils.NewValidator()
	validator.RequiredString("Name", updateData.Name, "Name ist ein Pflichtfeld")

	// Validiere Standardzeiten (nur wenn beide gesetzt sind)
	if !updateData.DefaultStart.IsZero() && !updateData.DefaultEnd.IsZero() {
		validator.TimeRange("DefaultStart", "DefaultEnd", updateData.DefaultStart, updateData.DefaultEnd, "Standard-Startzeit muss vor Standard-Endzeit liegen")
	}

	// Validiere Dauer-Beschränkungen (nur wenn beide > 0 sind)
	if updateData.MinDuration > 0 && updateData.MaxDuration > 0 {
		validator.NumberRange("MinDuration", "MaxDuration", updateData.MinDuration, updateData.MaxDuration, "Mindestdauer darf nicht größer als Maximaldauer sein")
	}

	if err := validator.ValidateAndRespond(c); err != nil {
		return err
	}

	if err := database.DB.Model(&shiftType).Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren des Schichttyps",
		})
	}

	return c.JSON(http.StatusOK, shiftType)
}

// DeleteShiftType löscht einen Schichttyp
func DeleteShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichttyp-ID",
		})
	}

	var shiftType models.ShiftType
	if err := database.DB.First(&shiftType, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichttyp nicht gefunden",
		})
	}

	// Prüfe, ob der Schichttyp noch verwendet wird
	var count int64
	database.DB.Model(&models.Shift{}).Where("shift_type_id = ?", id).Count(&count)
	if count > 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Schichttyp kann nicht gelöscht werden, da er noch verwendet wird",
		})
	}

	if err := database.DB.Delete(&shiftType).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Löschen des Schichttyps",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Schichttyp erfolgreich gelöscht",
	})
}

// ToggleShiftTypeActive aktiviert/deaktiviert einen Schichttyp
func ToggleShiftTypeActive(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichttyp-ID",
		})
	}

	var shiftType models.ShiftType
	if err := database.DB.First(&shiftType, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichttyp nicht gefunden",
		})
	}

	shiftType.IsActive = !shiftType.IsActive

	if err := database.DB.Save(&shiftType).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Ändern des Status",
		})
	}

	return c.JSON(http.StatusOK, shiftType)
}

// UpdateShiftTypeOrder aktualisiert die Sortierreihenfolge von Schichttypen
func UpdateShiftTypeOrder(c echo.Context) error {
	var orderData struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}

	if err := c.Bind(&orderData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Sortierdaten",
		})
	}

	var shiftType models.ShiftType
	if err := database.DB.First(&shiftType, orderData.ID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichttyp nicht gefunden",
		})
	}

	shiftType.SortOrder = orderData.SortOrder

	if err := database.DB.Save(&shiftType).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren der Sortierung",
		})
	}

	return c.JSON(http.StatusOK, shiftType)
}
