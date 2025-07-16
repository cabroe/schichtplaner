package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
)

// GetUsers gibt alle Benutzer zurück
func GetUsers(c echo.Context) error {
	var users []models.User

	if err := database.DB.Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Benutzer",
		})
	}

	return c.JSON(http.StatusOK, users)
}

// GetUser gibt einen spezifischen Benutzer zurück
func GetUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzer-ID",
		})
	}

	var user models.User
	if err := database.DB.Preload("Shifts").First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Benutzer nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, user)
}

// CreateUser erstellt einen neuen Benutzer
func CreateUser(c echo.Context) error {
	var user models.User

	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzerdaten",
		})
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Erstellen des Benutzers",
		})
	}

	return c.JSON(http.StatusCreated, user)
}

// UpdateUser aktualisiert einen bestehenden Benutzer
func UpdateUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzer-ID",
		})
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Benutzer nicht gefunden",
		})
	}

	var updateData models.User
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzerdaten",
		})
	}

	if err := database.DB.Model(&user).Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren des Benutzers",
		})
	}

	return c.JSON(http.StatusOK, user)
}

// DeleteUser löscht einen Benutzer
func DeleteUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzer-ID",
		})
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Benutzer nicht gefunden",
		})
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Löschen des Benutzers",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Benutzer erfolgreich gelöscht",
	})
}

// GetActiveUsers gibt alle aktiven Benutzer zurück
func GetActiveUsers(c echo.Context) error {
	var users []models.User

	if err := database.DB.Where("is_active = ?", true).Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Benutzer",
		})
	}

	return c.JSON(http.StatusOK, users)
}
