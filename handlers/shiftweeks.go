package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"gorm.io/gorm"
)

// @Summary Alle Schichtwochen abrufen
// @Description Ruft alle Schichtwochen mit relevanten Beziehungen ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftWeek}
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shiftweeks [get]
func HandleAllShiftWeeks(c *fiber.Ctx) error {
	var shiftWeeks []models.ShiftWeek
	result := database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, description, color").
				Order("name")
		}).
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, date, shift_type_id, employee_id, shift_week_id").
				Order("date DESC")
		}).
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.Employee", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id").
				Order("last_name, first_name")
		}).
		Order("year DESC, calendar_week DESC").
		Find(&shiftWeeks)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftWeeks))
}

// @Summary Schichtwoche erstellen
// @Description Erstellt eine neue Schichtwoche
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param shiftweek body models.ShiftWeek true "Schichtwoche-Daten"
// @Success 201 {object} responses.APIResponse{data=models.ShiftWeek}
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/shiftweeks [post]
func HandleCreateShiftWeek(c *fiber.Ctx) error {
	shiftWeek := new(models.ShiftWeek)
	if err := c.BodyParser(shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := validateShiftWeek(shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	shiftWeek.Status = models.StatusDraft
	result := database.GetDB().Create(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Department").
		First(&shiftWeek, shiftWeek.ID)

	return c.Status(201).JSON(responses.SuccessResponse(responses.MsgSuccessCreate, shiftWeek))
}

// @Summary Einzelne Schichtwoche abrufen
// @Description Ruft eine spezifische Schichtwoche mit allen Details ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse{data=models.ShiftWeek}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id} [get]
func HandleGetOneShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Order("date")
		}).
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.Employee").
		First(&shiftWeek, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftWeek))
}

// @Summary Schichtwoche aktualisieren
// @Description Aktualisiert eine bestehende Schichtwoche
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Param shiftweek body models.ShiftWeek true "Aktualisierte Schichtwoche-Daten"
// @Success 200 {object} responses.APIResponse{data=models.ShiftWeek}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id} [put]
func HandleUpdateShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if shiftWeek.Status != models.StatusDraft {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrDraftOnly))
	}

	if err := c.BodyParser(&shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := validateShiftWeek(&shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := database.GetDB().Save(&shiftWeek).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.Employee").
		First(&shiftWeek, id)

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessUpdate, shiftWeek))
}

// @Summary Schichtwoche löschen
// @Description Löscht eine Schichtwoche und zugehörige Schichttage
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id} [delete]
func HandleDeleteShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if shiftWeek.Status != models.StatusDraft {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrDraftOnly))
	}

	tx := database.GetDB().Begin()

	if err := tx.Where("shift_week_id = ?", id).Delete(&models.ShiftDay{}).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := tx.Delete(&shiftWeek).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	tx.Commit()

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessDelete, nil))
}

// @Summary Schichtwochen einer Abteilung abrufen
// @Description Ruft alle Schichtwochen einer bestimmten Abteilung ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftWeek}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/department/{id} [get]
func HandleGetDepartmentShiftWeeks(c *fiber.Ctx) error {
	departmentID := c.Params("id")
	var shiftWeeks []models.ShiftWeek

	result := database.GetDB().
		Where("department_id = ?", departmentID).
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Order("date")
		}).
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.Employee").
		Order("year DESC, calendar_week DESC").
		Find(&shiftWeeks)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftWeeks))
}

// @Summary Status einer Schichtwoche aktualisieren
// @Description Aktualisiert den Status einer Schichtwoche (draft/published/archived)
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Param status body string true "Neuer Status"
// @Success 200 {object} responses.APIResponse{data=models.ShiftWeek}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id}/status [put]
func HandleUpdateShiftWeekStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	var input struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if !shiftWeek.IsValidStatus() {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültiger Status"))
	}

	shiftWeek.Status = input.Status
	if err := database.GetDB().Save(&shiftWeek).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessUpdate, shiftWeek))
}

// @Summary Statistiken einer Schichtwoche abrufen
// @Description Ruft statistische Daten zu einer Schichtwoche ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id}/stats [get]
func HandleShiftWeekStats(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().
		Preload("ShiftDays").
		Preload("ShiftDays.Employee").
		Preload("ShiftDays.ShiftType").
		First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	stats := map[string]interface{}{
		"total_shifts":        len(shiftWeek.ShiftDays),
		"assigned_shifts":     0,
		"unassigned_shifts":   0,
		"shifts_per_type":     make(map[uint]int),
		"shifts_per_employee": make(map[uint]int),
	}

	for _, day := range shiftWeek.ShiftDays {
		if day.EmployeeID != nil {
			stats["assigned_shifts"] = stats["assigned_shifts"].(int) + 1
			stats["shifts_per_employee"].(map[uint]int)[*day.EmployeeID]++
		} else {
			stats["unassigned_shifts"] = stats["unassigned_shifts"].(int) + 1
		}
		stats["shifts_per_type"].(map[uint]int)[day.ShiftTypeID]++
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, stats))
}

func validateShiftWeek(shiftWeek *models.ShiftWeek) error {
	if shiftWeek.CalendarWeek < 1 || shiftWeek.CalendarWeek > 53 {
		return fmt.Errorf("kalenderwoche muss zwischen 1 und 53 liegen")
	}

	if shiftWeek.Year < 2000 {
		return fmt.Errorf("jahr muss nach 2000 liegen")
	}

	if shiftWeek.DepartmentID == nil {
		return fmt.Errorf("abteilung ist erforderlich")
	}

	var department models.Department
	if err := database.GetDB().First(&department, shiftWeek.DepartmentID).Error; err != nil {
		return fmt.Errorf("abteilung nicht gefunden")
	}

	var existingWeek models.ShiftWeek
	if err := database.GetDB().
		Where("department_id = ? AND id != ? AND year = ? AND calendar_week = ?",
			shiftWeek.DepartmentID,
			shiftWeek.ID,
			shiftWeek.Year,
			shiftWeek.CalendarWeek).
		First(&existingWeek).Error; err == nil {
		return fmt.Errorf("es existiert bereits eine schichtwoche für diese kalenderwoche in dieser abteilung")
	}

	return nil
}
