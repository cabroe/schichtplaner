package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

// @Summary Get all users
// @Description Fetch all users with their departments
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
// @Description Create a new user with department assignment
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.User true "User information"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /users [post]
func HandleCreateUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate Department exists if DepartmentID is provided
	if user.DepartmentID != 0 {
		var department models.Department
		if err := database.GetDB().First(&department, user.DepartmentID).Error; err != nil {
			return c.Status(400).JSON(models.APIResponse{
				Success: false,
				Error:   "Department not found",
			})
		}
	}

	result := database.GetDB().Create(&user)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "User successfully created",
		Data:    user,
	})
}

// @Summary Get a single user
// @Description Get user details by ID including department
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
// @Description Update user information by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body models.User true "Updated user information"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
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

	// Validate Department exists if DepartmentID is provided
	if user.DepartmentID != 0 {
		var department models.Department
		if err := database.GetDB().First(&department, user.DepartmentID).Error; err != nil {
			return c.Status(400).JSON(models.APIResponse{
				Success: false,
				Error:   "Department not found",
			})
		}
	}

	database.GetDB().Save(&user)
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
// @Failure 500 {object} models.APIResponse
// @Router /users/{id} [delete]
func HandleDeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")

	result := database.GetDB().Delete(&models.User{}, id)
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
