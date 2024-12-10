package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

type CreateDepartmentDTO struct {
	Name string `json:"name"`
}

// @Summary Get all departments
// @Tags departments
// @Produce json
// @Success 200 {object} models.APIResponse
// @Router /departments [get]
func HandleAllDepartments(c *fiber.Ctx) error {
	var departments []models.Department
	result := database.GetDB().Preload("Users").Find(&departments)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Data:    departments,
	})
}

// @Summary Create department
// @Tags departments
// @Accept json
// @Produce json
// @Param department body CreateDepartmentDTO true "Department Data"
// @Success 200 {object} models.APIResponse
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
		Data:    department,
	})
}
