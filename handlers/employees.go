package handlers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// @Summary Alle Mitarbeiter abrufen
// @Description Ruft alle Mitarbeiter mit ihren Berechtigungen und Schichten ab
// @Tags employees
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse{data=[]models.Employee}
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/employees [get]
func HandleAllEmployees(c *fiber.Ctx) error {
	var employees []models.Employee
	result := database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, color").
				Order("name")
		}).
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, date, shift_type_id, employee_id, shift_week_id").
				Order("date DESC")
		}).
		Preload("ShiftDays.ShiftType").
		// Nach Vornamen sortieren
		Order("first_name").
		Find(&employees)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, employees))
}

// @Summary Mitarbeiter erstellen
// @Description Erstellt einen neuen Mitarbeiter mit Validierungen
// @Tags employees
// @Accept json
// @Produce json
// @Param employee body models.Employee true "Mitarbeiter-Daten"
// @Success 201 {object} responses.APIResponse{data=models.Employee}
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/employees [post]
func HandleCreateEmployee(c *fiber.Ctx) error {
	employee := new(models.Employee)
	if err := c.BodyParser(employee); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := validateEmployee(employee); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	hashedPassword, err := hashPassword(employee.Password)
	if err != nil {
		return c.Status(500).JSON(responses.ErrorResponse("Fehler beim Verschlüsseln des Passworts"))
	}
	employee.Password = hashedPassword

	result := database.GetDB().Create(&employee)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&employee, employee.ID)

	return c.Status(201).JSON(responses.SuccessResponse(responses.MsgSuccessCreate, employee))
}

// @Summary Einzelnen Mitarbeiter abrufen
// @Description Ruft einen spezifischen Mitarbeiter mit Details ab
// @Tags employees
// @Accept json
// @Produce json
// @Param id path int true "Mitarbeiter-ID"
// @Success 200 {object} responses.APIResponse{data=models.Employee}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/employees/{id} [get]
func HandleGetOneEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&employee, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, employee))
}

// @Summary Mitarbeiter aktualisieren
// @Description Aktualisiert einen bestehenden Mitarbeiter
// @Tags employees
// @Accept json
// @Produce json
// @Param id path int true "Mitarbeiter-ID"
// @Param employee body models.Employee true "Aktualisierte Mitarbeiter-Daten"
// @Success 200 {object} responses.APIResponse{data=models.Employee}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/employees/{id} [put]
func HandleUpdateEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	if err := database.GetDB().First(&employee, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if err := c.BodyParser(&employee); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := validateEmployee(&employee); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	if employee.Password != "" {
		hashedPassword, err := hashPassword(employee.Password)
		if err != nil {
			return c.Status(500).JSON(responses.ErrorResponse("Fehler beim Verschlüsseln des Passworts"))
		}
		employee.Password = hashedPassword
	}

	if err := database.GetDB().Save(&employee).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&employee, id)

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessUpdate, employee))
}

// @Summary Mitarbeiter löschen
// @Description Löscht einen Mitarbeiter und seine Beziehungen
// @Tags employees
// @Accept json
// @Produce json
// @Param id path int true "Mitarbeiter-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/employees/{id} [delete]
func HandleDeleteEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	if err := database.GetDB().First(&employee, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	tx := database.GetDB().Begin()

	if err := tx.Model(&models.ShiftDay{}).Where("employee_id = ?", id).Update("employee_id", nil).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := tx.Delete(&employee).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	tx.Commit()

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessDelete, nil))
}

// @Summary Verfügbare Mitarbeiter abrufen
// @Description Ruft alle Mitarbeiter ab, die an einem bestimmten Datum noch keine Schicht haben
// @Tags employees
// @Accept json
// @Produce json
// @Param date path string true "Datum (YYYY-MM-DD)"
// @Success 200 {object} responses.APIResponse{data=[]models.Employee}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/employees/available/{date} [get]
func HandleGetAvailableEmployees(c *fiber.Ctx) error {
	dateStr := c.Params("date")
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültiges Datumsformat. Bitte YYYY-MM-DD verwenden"))
	}

	var availableEmployees []models.Employee
	result := database.GetDB().
		Joins("LEFT JOIN shift_days ON employees.id = shift_days.employee_id AND shift_days.date = ?", date).
		Where("shift_days.id IS NULL").
		Preload("Department").
		Find(&availableEmployees)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Verfügbare Mitarbeiter erfolgreich abgerufen", availableEmployees))
}

// @Summary Schichten eines Mitarbeiters abrufen
// @Description Ruft alle Schichten eines bestimmten Mitarbeiters ab
// @Tags employees
// @Accept json
// @Produce json
// @Param id path int true "Mitarbeiter-ID"
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftDay}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/employees/{id}/shifts [get]
func HandleEmployeeShifts(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	result := database.GetDB().
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&employee, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	return c.JSON(responses.SuccessResponse("Schichten erfolgreich abgerufen", employee.ShiftDays))
}

// @Summary Mitarbeiter einer Abteilung abrufen
// @Description Ruft alle Mitarbeiter einer bestimmten Abteilung ab
// @Tags employees
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Success 200 {object} responses.APIResponse{data=[]models.Employee}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/employees/department/{id} [get]
func HandleGetDepartmentEmployees(c *fiber.Ctx) error {
	departmentID := c.Params("id")
	var employees []models.Employee

	result := database.GetDB().
		Where("department_id = ?", departmentID).
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Order("date DESC")
		}).
		Preload("ShiftDays.ShiftType").
		Order("last_name, first_name").
		Find(&employees)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, employees))
}

func validateEmployee(employee *models.Employee) error {
	if employee.FirstName == "" {
		return fmt.Errorf("vorname ist erforderlich")
	}
	if employee.LastName == "" {
		return fmt.Errorf("nachname ist erforderlich")
	}
	if employee.Email == "" {
		return fmt.Errorf("e-mail ist erforderlich")
	}
	if employee.Color == "" {
		return fmt.Errorf("farbe ist erforderlich")
	}

	var existingEmployee models.Employee
	if err := database.GetDB().Where("email = ? AND id != ?", employee.Email, employee.ID).First(&existingEmployee).Error; err == nil {
		return fmt.Errorf("e-mail wird bereits verwendet")
	}

	return nil
}

func hashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}
