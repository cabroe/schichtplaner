package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Get all departments
// @Description Fetch all departments with their relationships
// @Tags departments
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/departments [get]
func HandleAllDepartments(c *fiber.Ctx) error {
	var departments []models.Department
	result := database.GetDB().
		Preload("Users").
		Preload("ShiftWeeks.ShiftDays.ShiftType").
		Preload("ShiftWeeks.ShiftDays.User").
		Find(&departments)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Abteilungen erfolgreich abgerufen", departments))
}

// @Summary Get a single department
// @Description Get department details by ID including relationships
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Department ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [get]
func HandleGetOneDepartment(c *fiber.Ctx) error {
	id := c.Params("id")

	var department models.Department
	result := database.GetDB().
		Preload("Users").
		Preload("ShiftWeeks.ShiftDays.ShiftType").
		Preload("ShiftWeeks.ShiftDays.User").
		First(&department, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Abteilung erfolgreich abgerufen", department))
}

// @Summary Create a department
// @Description Create a new department
// @Tags departments
// @Accept json
// @Produce json
// @Param department body models.Department true "Department information"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/departments [post]
func HandleCreateDepartment(c *fiber.Ctx) error {
	department := new(models.Department)
	if err := c.BodyParser(department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if department.Name == "" || department.Color == "" {
		return c.Status(400).JSON(responses.ErrorResponse("Name und Farbe sind erforderlich"))
	}

	result := database.GetDB().Create(&department)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Users").
		Preload("ShiftWeeks.ShiftDays.ShiftType").
		Preload("ShiftWeeks.ShiftDays.User").
		First(&department, department.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Abteilung erfolgreich erstellt", department))
}

// @Summary Update a department
// @Description Update department information by ID
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Department ID"
// @Param department body models.Department true "Updated department information"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [put]
func HandleUpdateDepartment(c *fiber.Ctx) error {
	id := c.Params("id")

	var department models.Department
	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	if err := c.BodyParser(&department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if department.Name == "" || department.Color == "" {
		return c.Status(400).JSON(responses.ErrorResponse("Name und Farbe sind erforderlich"))
	}

	if err := database.GetDB().Save(&department).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Users").
		Preload("ShiftWeeks.ShiftDays.ShiftType").
		Preload("ShiftWeeks.ShiftDays.User").
		First(&department, id)

	return c.JSON(responses.SuccessResponse("Abteilung erfolgreich aktualisiert", department))
}

// @Summary Delete a department
// @Description Delete department by ID
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Department ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [delete]
func HandleDeleteDepartment(c *fiber.Ctx) error {
	id := c.Params("id")

	var department models.Department
	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	result := database.GetDB().Delete(&department)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Abteilung erfolgreich gelöscht", nil))
}
