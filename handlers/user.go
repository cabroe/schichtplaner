package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// GetUsers gibt alle Benutzer mit Pagination zurück
func GetUsers(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var users []models.User
	var total int64

	// Zähle die Gesamtanzahl
	database.DB.Model(&models.User{}).Count(&total)

	// Lade die paginierten Daten
	if err := database.DB.Offset(params.Offset).Limit(params.PageSize).Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Benutzer",
		})
	}

	response := utils.CreatePaginatedResponse(users, int(total), params)
	return c.JSON(http.StatusOK, response)
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

// GetActiveUsers gibt alle aktiven Benutzer mit Pagination zurück
func GetActiveUsers(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var users []models.User
	var total int64

	// Zähle die Gesamtanzahl der aktiven Benutzer
	database.DB.Model(&models.User{}).Where("is_active = ?", true).Count(&total)

	// Lade die paginierten Daten
	if err := database.DB.Where("is_active = ?", true).Offset(params.Offset).Limit(params.PageSize).Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Benutzer",
		})
	}

	response := utils.CreatePaginatedResponse(users, int(total), params)
	return c.JSON(http.StatusOK, response)
}
