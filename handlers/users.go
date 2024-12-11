package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Get all users
// @Description Fetch all users with their relationships
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/users [get]
func HandleAllUsers(c *fiber.Ctx) error {
	var users []models.User
	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		Find(&users)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich abgerufen", users))
}

// @Summary Create a new user
// @Description Create a new user with validations
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.User true "User information"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/users [post]
func HandleCreateUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if user.FirstName == "" || user.LastName == "" || user.Email == "" {
		return c.Status(400).JSON(responses.ErrorResponse("Vorname, Nachname und E-Mail sind erforderlich"))
	}

	if user.DepartmentID == 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung ist erforderlich"))
	}

	var department models.Department
	if err := database.GetDB().First(&department, user.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	result := database.GetDB().Create(&user)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&user, user.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Benutzer erfolgreich erstellt", user))
}

// @Summary Get a single user
// @Description Get user details by ID with relationships
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/users/{id} [get]
func HandleGetOneUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&user, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich abgerufen", user))
}

// @Summary Update a user
// @Description Update user information by ID with validations
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body models.User true "Updated user information"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/users/{id} [put]
func HandleUpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.GetDB().First(&user, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if user.FirstName == "" || user.LastName == "" || user.Email == "" {
		return c.Status(400).JSON(responses.ErrorResponse("Vorname, Nachname und E-Mail sind erforderlich"))
	}

	if user.DepartmentID == 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung ist erforderlich"))
	}

	if err := database.GetDB().First(&models.Department{}, user.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	if err := database.GetDB().Save(&user).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.ShiftWeek").
		First(&user, id)

	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich aktualisiert", user))
}

// @Summary Delete a user
// @Description Delete user by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/users/{id} [delete]
func HandleDeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := database.GetDB().First(&user, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	result := database.GetDB().Delete(&user)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich gelöscht", nil))
}
