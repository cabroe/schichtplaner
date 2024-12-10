package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

// @Summary Get all departments
// @Description Fetch all departments
// @Tags departments
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /departments [get]
func HandleAllDepartments(c *fiber.Ctx) error {
	var departments []models.Department
	result := database.GetDB().Find(&departments)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Departments successfully retrieved",
		Data:    departments,
	})
}

// @Summary Create a department
// @Description Create a new department
// @Tags departments
// @Accept json
// @Produce json
// @Param department body models.Department true "Department information"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /departments [post]
func HandleCreateDepartment(c *fiber.Ctx) error {
	department := new(models.Department)
	if err := c.BodyParser(department); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	result := database.GetDB().Create(&department)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Department successfully created",
		Data:    department,
	})
}

// @Summary Get a single department
// @Description Get department details by ID
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Department ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /departments/{id} [get]
func HandleGetOneDepartment(c *fiber.Ctx) error {
	id := c.Params("id")

	var department models.Department
	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "Department not found",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Department successfully retrieved",
		Data:    department,
	})
}

// @Summary Update a department
// @Description Update department information by ID
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Department ID"
// @Param department body models.Department true "Updated department information"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /departments/{id} [put]
func HandleUpdateDepartment(c *fiber.Ctx) error {
	id := c.Params("id")

	var department models.Department
	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "Department not found",
		})
	}

	if err := c.BodyParser(&department); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	database.GetDB().Save(&department)
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Department successfully updated",
		Data:    department,
	})
}

// @Summary Delete a department
// @Description Delete department by ID
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Department ID"
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /departments/{id} [delete]
func HandleDeleteDepartment(c *fiber.Ctx) error {
	id := c.Params("id")

	result := database.GetDB().Delete(&models.Department{}, id)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Department successfully deleted",
	})
}
