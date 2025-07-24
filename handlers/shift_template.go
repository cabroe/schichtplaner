package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// GetShiftTemplates gibt alle Schichtvorlagen mit Pagination zurück
func GetShiftTemplates(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var shiftTemplates []models.ShiftTemplate
	var total int64

	// Zähle die Gesamtanzahl
	database.DB.Model(&models.ShiftTemplate{}).Count(&total)

	// Lade die paginierten Daten mit allen Schichttypen, sortiert nach SortOrder und Name
	if err := database.DB.Preload("MondayShiftType").
		Preload("TuesdayShiftType").
		Preload("WednesdayShiftType").
		Preload("ThursdayShiftType").
		Preload("FridayShiftType").
		Preload("SaturdayShiftType").
		Preload("SundayShiftType").
		Order("sort_order ASC, name ASC").
		Offset(params.Offset).
		Limit(params.PageSize).
		Find(&shiftTemplates).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Schichtvorlagen",
		})
	}

	response := utils.CreatePaginatedResponse(shiftTemplates, int(total), params)
	return c.JSON(http.StatusOK, response)
}

// GetActiveShiftTemplates gibt nur aktive Schichtvorlagen zurück
func GetActiveShiftTemplates(c echo.Context) error {
	var shiftTemplates []models.ShiftTemplate

	if err := database.DB.Preload("MondayShiftType").
		Preload("TuesdayShiftType").
		Preload("WednesdayShiftType").
		Preload("ThursdayShiftType").
		Preload("FridayShiftType").
		Preload("SaturdayShiftType").
		Preload("SundayShiftType").
		Where("is_active = ?", true).
		Order("sort_order ASC, name ASC").
		Find(&shiftTemplates).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Schichtvorlagen",
		})
	}

	return c.JSON(http.StatusOK, shiftTemplates)
}

// GetShiftTemplate gibt eine spezifische Schichtvorlage zurück
func GetShiftTemplate(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtvorlagen-ID",
		})
	}

	var shiftTemplate models.ShiftTemplate
	if err := database.DB.Preload("MondayShiftType").
		Preload("TuesdayShiftType").
		Preload("WednesdayShiftType").
		Preload("ThursdayShiftType").
		Preload("FridayShiftType").
		Preload("SaturdayShiftType").
		Preload("SundayShiftType").
		First(&shiftTemplate, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtvorlage nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, shiftTemplate)
}

// CreateShiftTemplate erstellt eine neue Schichtvorlage
func CreateShiftTemplate(c echo.Context) error {
	var shiftTemplate models.ShiftTemplate

	if err := c.Bind(&shiftTemplate); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtvorlagen-Daten",
		})
	}

	// Validiere, dass alle Schichttyp-IDs existieren (falls gesetzt)
	if err := validateShiftTypeIDs(&shiftTemplate); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}

	if err := database.DB.Create(&shiftTemplate).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Erstellen der Schichtvorlage",
		})
	}

	// Lade die erstellte Vorlage mit allen Schichttypen
	if err := database.DB.Preload("MondayShiftType").
		Preload("TuesdayShiftType").
		Preload("WednesdayShiftType").
		Preload("ThursdayShiftType").
		Preload("FridayShiftType").
		Preload("SaturdayShiftType").
		Preload("SundayShiftType").
		First(&shiftTemplate, shiftTemplate.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der erstellten Schichtvorlage",
		})
	}

	return c.JSON(http.StatusCreated, shiftTemplate)
}

// UpdateShiftTemplate aktualisiert eine bestehende Schichtvorlage
func UpdateShiftTemplate(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtvorlagen-ID",
		})
	}

	var shiftTemplate models.ShiftTemplate
	if err := database.DB.First(&shiftTemplate, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtvorlage nicht gefunden",
		})
	}

	var updateData models.ShiftTemplate
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtvorlagen-Daten",
		})
	}

	// Validiere, dass alle Schichttyp-IDs existieren (falls gesetzt)
	if err := validateShiftTypeIDs(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}

	if err := database.DB.Model(&shiftTemplate).Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren der Schichtvorlage",
		})
	}

	// Lade die aktualisierte Vorlage mit allen Schichttypen
	if err := database.DB.Preload("MondayShiftType").
		Preload("TuesdayShiftType").
		Preload("WednesdayShiftType").
		Preload("ThursdayShiftType").
		Preload("FridayShiftType").
		Preload("SaturdayShiftType").
		Preload("SundayShiftType").
		First(&shiftTemplate, shiftTemplate.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktualisierten Schichtvorlage",
		})
	}

	return c.JSON(http.StatusOK, shiftTemplate)
}

// DeleteShiftTemplate löscht eine Schichtvorlage
func DeleteShiftTemplate(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtvorlagen-ID",
		})
	}

	var shiftTemplate models.ShiftTemplate
	if err := database.DB.First(&shiftTemplate, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtvorlage nicht gefunden",
		})
	}

	if err := database.DB.Delete(&shiftTemplate).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Löschen der Schichtvorlage",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Schichtvorlage erfolgreich gelöscht",
	})
}

// ToggleShiftTemplateActive aktiviert/deaktiviert eine Schichtvorlage
func ToggleShiftTemplateActive(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Schichtvorlagen-ID",
		})
	}

	var shiftTemplate models.ShiftTemplate
	if err := database.DB.First(&shiftTemplate, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtvorlage nicht gefunden",
		})
	}

	shiftTemplate.IsActive = !shiftTemplate.IsActive

	if err := database.DB.Save(&shiftTemplate).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Ändern des Status",
		})
	}

	return c.JSON(http.StatusOK, shiftTemplate)
}

// UpdateShiftTemplateOrder aktualisiert die Sortierreihenfolge von Schichtvorlagen
func UpdateShiftTemplateOrder(c echo.Context) error {
	var orderData struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}

	if err := c.Bind(&orderData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Sortierdaten",
		})
	}

	var shiftTemplate models.ShiftTemplate
	if err := database.DB.First(&shiftTemplate, orderData.ID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Schichtvorlage nicht gefunden",
		})
	}

	shiftTemplate.SortOrder = orderData.SortOrder

	if err := database.DB.Save(&shiftTemplate).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren der Sortierung",
		})
	}

	return c.JSON(http.StatusOK, shiftTemplate)
}

// validateShiftTypeIDs prüft, ob alle gesetzten Schichttyp-IDs existieren
func validateShiftTypeIDs(template *models.ShiftTemplate) error {
	shiftTypeIDs := []*uint{
		template.MondayShiftTypeID,
		template.TuesdayShiftTypeID,
		template.WednesdayShiftTypeID,
		template.ThursdayShiftTypeID,
		template.FridayShiftTypeID,
		template.SaturdayShiftTypeID,
		template.SundayShiftTypeID,
	}

	for _, id := range shiftTypeIDs {
		if id != nil {
			var shiftType models.ShiftType
			if err := database.DB.First(&shiftType, *id).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
