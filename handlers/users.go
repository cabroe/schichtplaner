package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

// @Summary Get all users
// @Description Fetch all users with their relationships
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /users [get]
func HandleAllUsers(c *fiber.Ctx) error {
	var users []models.User
	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		Find(&users)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Users successfully retrieved",
		Data:    users,
	})
}

// @Summary Create a new user
// @Description Create a new user with validations
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.User true "User information"
// @Success 201 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Router /users [post]
func HandleCreateUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate required fields
	if user.FirstName == "" || user.LastName == "" || user.Email == "" {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "First name, last name and email are required",
		})
	}

	if user.DepartmentID == 0 {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department ID is required",
		})
	}

	// Validate Department exists
	var department models.Department
	if err := database.GetDB().First(&department, user.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department not found",
		})
	}

	result := database.GetDB().Create(&user)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	// Reload with relationships
	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&user, user.ID)

	return c.Status(201).JSON(models.APIResponse{
		Success: true,
		Message: "User successfully created",
		Data:    user,
	})
}

// @Summary Get a single user
// @Description Get user details by ID with relationships
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /users/{id} [get]
func HandleGetOneUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&user, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "User successfully retrieved",
		Data:    user,
	})
}

// @Summary Update a user
// @Description Update user information by ID with validations
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body models.User true "Updated user information"
// @Success 200 {object} models.APIResponse
// @Failure 400,404 {object} models.APIResponse
// @Router /users/{id} [put]
func HandleUpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.GetDB().First(&user, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate required fields
	if user.FirstName == "" || user.LastName == "" || user.Email == "" {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "First name, last name and email are required",
		})
	}

	if user.DepartmentID == 0 {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department ID is required",
		})
	}

	// Validate Department exists
	if err := database.GetDB().First(&models.Department{}, user.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department not found",
		})
	}

	if err := database.GetDB().Save(&user).Error; err != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
	}

	// Reload with relationships
	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&user, id)

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "User successfully updated",
		Data:    user,
	})
}

// @Summary Delete a user
// @Description Delete user by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} models.APIResponse
// @Failure 404,500 {object} models.APIResponse
// @Router /users/{id} [delete]
func HandleDeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.GetDB().First(&user, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	result := database.GetDB().Delete(&user)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "User successfully deleted",
	})
}
