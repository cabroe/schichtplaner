package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// @Summary Alle Benutzer abrufen
// @Description Ruft alle Benutzer mit ihren Berechtigungen und Schichten ab
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/users [get]
func HandleAllUsers(c *fiber.Ctx) error {
	var users []models.User
	result := database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, color")
		}).
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, date, shift_type_id, user_id, shift_week_id")
		}).
		Preload("ShiftDays.ShiftType", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, description, duration, color")
		}).
		Find(&users)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich abgerufen", users))
}

// @Summary Benutzer erstellen
// @Description Erstellt einen neuen Benutzer mit Validierungen
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.User true "Benutzer-Daten"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/users [post]
func HandleCreateUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateUser(user); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	// Prüfe ob die E-Mail bereits existiert
	var existingUser models.User
	if err := database.GetDB().Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return c.Status(400).JSON(responses.ErrorResponse("E-Mail wird bereits verwendet"))
	}

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		return c.Status(500).JSON(responses.ErrorResponse("Fehler beim Verschlüsseln des Passworts"))
	}
	user.Password = hashedPassword

	result := database.GetDB().Create(&user)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	// Lade die Beziehungen nach der Erstellung
	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&user, user.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Benutzer erfolgreich erstellt", user))
}

// @Summary Einzelnen Benutzer abrufen
// @Description Ruft einen spezifischen Benutzer mit allen Details ab
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "Benutzer-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/users/{id} [get]
func HandleGetOneUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&user, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich abgerufen", user))
}

// @Summary Benutzer aktualisieren
// @Description Aktualisiert einen bestehenden Benutzer
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "Benutzer-ID"
// @Param user body models.User true "Aktualisierte Benutzer-Daten"
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

	if err := validateUser(&user); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	// Prüfe E-Mail-Eindeutigkeit bei Änderung
	var existingUser models.User
	if err := database.GetDB().Where("email = ? AND id != ?", user.Email, id).First(&existingUser).Error; err == nil {
		return c.Status(400).JSON(responses.ErrorResponse("E-Mail wird bereits verwendet"))
	}

	// Nur Passwort aktualisieren wenn es geändert wurde
	if user.Password != "" {
		hashedPassword, err := hashPassword(user.Password)
		if err != nil {
			return c.Status(500).JSON(responses.ErrorResponse("Fehler beim Verschlüsseln des Passworts"))
		}
		user.Password = hashedPassword
	}

	if err := database.GetDB().Save(&user).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	// Lade aktualisierte Beziehungen
	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		First(&user, id)

	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich aktualisiert", user))
}

// @Summary Benutzer löschen
// @Description Löscht einen Benutzer und seine zugehörigen Daten
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "Benutzer-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/users/{id} [delete]
func HandleDeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	if err := database.GetDB().First(&user, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	// Prüfe ob noch Schichttage existieren
	var shiftDayCount int64
	database.GetDB().Model(&models.ShiftDay{}).Where("user_id = ?", id).Count(&shiftDayCount)
	if shiftDayCount > 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer kann nicht gelöscht werden, da noch Schichttage zugeordnet sind"))
	}

	result := database.GetDB().Delete(&user)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Benutzer erfolgreich gelöscht", nil))
}

// Hilfsfunktionen für Validierung und Sicherheit
func validateUser(user *models.User) error {
	if user.FirstName == "" {
		return fmt.Errorf("Vorname ist erforderlich")
	}
	if user.LastName == "" {
		return fmt.Errorf("Nachname ist erforderlich")
	}
	if user.Email == "" {
		return fmt.Errorf("E-Mail ist erforderlich")
	}
	if user.DepartmentID == 0 {
		return fmt.Errorf("Abteilung ist erforderlich")
	}
	if user.Color == "" {
		return fmt.Errorf("Farbe ist erforderlich")
	}

	// Prüfe ob die Abteilung existiert
	var department models.Department
	if err := database.GetDB().First(&department, user.DepartmentID).Error; err != nil {
		return fmt.Errorf("Abteilung nicht gefunden")
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
