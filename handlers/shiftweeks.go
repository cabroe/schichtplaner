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
		Order("start_date DESC").
		Find(&shiftWeeks)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftWeeks))
}

// @Summary Schichtwoche erstellen
// @Description Erstellt eine neue Schichtwoche mit Validierungen
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

// @Summary Status einer Schichtwoche aktualisieren
// @Description Aktualisiert den Status einer Schichtwoche (draft/published/archived)
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Param status body object true "Status-Update"
// @Success 200 {object} responses.APIResponse{data=models.ShiftWeek}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id}/status [put]
func HandleUpdateShiftWeekStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	type StatusUpdate struct {
		Status string `json:"status"`
	}
	var update StatusUpdate
	if err := c.BodyParser(&update); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if !isValidStatus(update.Status) {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültiger Status"))
	}

	shiftWeek.Status = update.Status
	if err := database.GetDB().Save(&shiftWeek).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	return c.JSON(responses.SuccessResponse("Status erfolgreich aktualisiert", shiftWeek))
}

// @Summary Schichtwoche kopieren
// @Description Erstellt eine Kopie einer bestehenden Schichtwoche
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Quell-Schichtwoche-ID"
// @Success 201 {object} responses.APIResponse{data=models.ShiftWeek}
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/copy/{id} [post]
func HandleCopyShiftWeek(c *fiber.Ctx) error {
	sourceID := c.Params("id")
	var sourceWeek models.ShiftWeek

	if err := database.GetDB().
		Preload("ShiftDays").
		First(&sourceWeek, sourceID).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	newWeek := models.ShiftWeek{
		StartDate:    sourceWeek.StartDate.AddDate(0, 0, 7),
		EndDate:      sourceWeek.EndDate.AddDate(0, 0, 7),
		DepartmentID: sourceWeek.DepartmentID,
		Status:       models.StatusDraft,
		Notes:        "Kopie von: " + sourceWeek.Notes,
	}

	tx := database.GetDB().Begin()

	if err := tx.Create(&newWeek).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	for _, sourceDay := range sourceWeek.ShiftDays {
		newDay := models.ShiftDay{
			Date:        sourceDay.Date.AddDate(0, 0, 7),
			ShiftWeekID: &newWeek.ID,
			ShiftTypeID: sourceDay.ShiftTypeID,
			EmployeeID:  nil, // Mitarbeiter werden nicht mitkopiert
			Status:      models.StatusDraft,
		}
		if err := tx.Create(&newDay).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
		}
	}

	tx.Commit()

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&newWeek, newWeek.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichtwoche erfolgreich kopiert", newWeek))
}

// @Summary Statistiken einer Schichtwoche abrufen
// @Description Ruft statistische Daten einer Schichtwoche ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse{data=map[string]interface{}}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id}/stats [get]
func HandleShiftWeekStats(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	result := database.GetDB().
		Preload("ShiftDays.Employee").
		Preload("ShiftDays.ShiftType").
		First(&shiftWeek, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	stats := calculateShiftWeekStats(&shiftWeek)
	return c.JSON(responses.SuccessResponse("Statistiken erfolgreich abgerufen", stats))
}

// @Summary Schichtwochen einer Abteilung abrufen
// @Description Ruft alle Schichtwochen einer spezifischen Abteilung ab
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
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.Employee").
		Order("start_date DESC").
		Find(&shiftWeeks)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Keine Schichtwochen in dieser Abteilung gefunden"))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftWeeks))
}

func calculateShiftWeekStats(week *models.ShiftWeek) map[string]interface{} {
	employeeMap := make(map[uint]bool)
	shiftTypeMap := make(map[uint]int)
	unassignedShifts := 0

	for _, day := range week.ShiftDays {
		if day.EmployeeID != nil {
			employeeMap[*day.EmployeeID] = true
			shiftTypeMap[day.ShiftTypeID]++
		} else {
			unassignedShifts++
		}
	}

	return map[string]interface{}{
		"totalShifts":           len(week.ShiftDays),
		"assignedShifts":        len(week.ShiftDays) - unassignedShifts,
		"unassignedShifts":      unassignedShifts,
		"uniqueEmployees":       len(employeeMap),
		"shiftTypeDistribution": shiftTypeMap,
	}
}

func validateShiftWeek(shiftWeek *models.ShiftWeek) error {
	if shiftWeek.StartDate.IsZero() || shiftWeek.EndDate.IsZero() {
		return fmt.Errorf("start- und enddatum sind erforderlich")
	}

	if shiftWeek.EndDate.Before(shiftWeek.StartDate) {
		return fmt.Errorf("enddatum muss nach dem startdatum liegen")
	}

	if shiftWeek.DepartmentID == nil {
		return fmt.Errorf("abteilung ist erforderlich")
	}

	// Prüfe ob die Abteilung existiert
	var department models.Department
	if err := database.GetDB().First(&department, shiftWeek.DepartmentID).Error; err != nil {
		return fmt.Errorf("abteilung nicht gefunden")
	}

	// Prüfe auf Überschneidungen mit anderen Schichtwochen
	var existingWeek models.ShiftWeek
	if err := database.GetDB().
		Where("department_id = ? AND id != ? AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))",
			shiftWeek.DepartmentID,
			shiftWeek.ID,
			shiftWeek.StartDate,
			shiftWeek.EndDate,
			shiftWeek.StartDate,
			shiftWeek.EndDate).
		First(&existingWeek).Error; err == nil {
		return fmt.Errorf("es existiert bereits eine überlappende schichtwoche in dieser abteilung")
	}

	return nil
}

func isValidStatus(status string) bool {
	validStatuses := []string{models.StatusDraft, models.StatusPublished, models.StatusArchived}
	for _, s := range validStatuses {
		if s == status {
			return true
		}
	}
	return false
}
