package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
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
	if err := database.DB.Preload("Shifts").Preload("Team").First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Benutzer nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, user)
}

// CreateUser erstellt einen neuen Benutzer
func CreateUser(c echo.Context) error {
	var userRequest struct {
		Username      string `json:"username"`
		Email         string `json:"email"`
		Password      string `json:"password"`
		AccountNumber string `json:"account_number"`
		Name          string `json:"name"`
		Color         string `json:"color"`
		Role          string `json:"role"`
		IsActive      bool   `json:"is_active"`
		IsAdmin       bool   `json:"is_admin"`
	}

	if err := c.Bind(&userRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzerdaten",
		})
	}

	// Hash das Passwort
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userRequest.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Verschlüsseln des Passworts",
		})
	}

	// Erstelle den neuen Benutzer
	user := models.User{
		Username:      userRequest.Username,
		Email:         userRequest.Email,
		Password:      string(hashedPassword),
		AccountNumber: userRequest.AccountNumber,
		Name:          userRequest.Name,
		Color:         userRequest.Color,
		Role:          userRequest.Role,
		IsActive:      userRequest.IsActive,
		IsAdmin:       userRequest.IsAdmin,
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

	var updateRequest struct {
		Username      string `json:"username"`
		Email         string `json:"email"`
		Password      string `json:"password,omitempty"`
		AccountNumber string `json:"account_number"`
		Name          string `json:"name"`
		Color         string `json:"color"`
		Role          string `json:"role"`
		IsActive      bool   `json:"is_active"`
		IsAdmin       bool   `json:"is_admin"`
	}

	if err := c.Bind(&updateRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzerdaten",
		})
	}

	// Aktualisiere die Felder
	user.Username = updateRequest.Username
	user.Email = updateRequest.Email
	user.AccountNumber = updateRequest.AccountNumber
	user.Name = updateRequest.Name
	user.Color = updateRequest.Color
	user.Role = updateRequest.Role
	user.IsActive = updateRequest.IsActive
	user.IsAdmin = updateRequest.IsAdmin

	// Hash das Passwort nur wenn es geändert wurde
	if updateRequest.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updateRequest.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Fehler beim Verschlüsseln des Passworts",
			})
		}
		user.Password = string(hashedPassword)
	}

	if err := database.DB.Save(&user).Error; err != nil {
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

// ChangePassword ändert das Passwort eines Benutzers
func ChangePassword(c echo.Context) error {
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

	var passwordRequest struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	if err := c.Bind(&passwordRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Passwortdaten",
		})
	}

	// Überprüfe das alte Passwort
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(passwordRequest.OldPassword)); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Falsches aktuelles Passwort",
		})
	}

	// Hash das neue Passwort
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordRequest.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Verschlüsseln des neuen Passworts",
		})
	}

	user.Password = string(hashedPassword)

	if err := database.DB.Save(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren des Passworts",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Passwort erfolgreich geändert",
	})
}

// GetUsersByTeam gibt alle Benutzer eines bestimmten Teams zurück
func GetUsersByTeam(c echo.Context) error {
	teamID, err := strconv.ParseUint(c.Param("team_id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	params := utils.GetPaginationParams(c)

	var users []models.User
	var total int64

	// Zähle die Gesamtanzahl der Benutzer im Team
	database.DB.Model(&models.User{}).Where("team_id = ?", teamID).Count(&total)

	// Lade die paginierten Daten
	if err := database.DB.Where("team_id = ?", teamID).Preload("Team").Offset(params.Offset).Limit(params.PageSize).Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Team-Benutzer",
		})
	}

	response := utils.CreatePaginatedResponse(users, int(total), params)
	return c.JSON(http.StatusOK, response)
}

// GetUsersWithoutTeam gibt alle Benutzer zurück, die keinem Team angehören
func GetUsersWithoutTeam(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var users []models.User
	var total int64

	// Zähle die Gesamtanzahl der Benutzer ohne Team
	database.DB.Model(&models.User{}).Where("team_id IS NULL").Count(&total)

	// Lade die paginierten Daten
	if err := database.DB.Where("team_id IS NULL").Offset(params.Offset).Limit(params.PageSize).Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Benutzer ohne Team",
		})
	}

	response := utils.CreatePaginatedResponse(users, int(total), params)
	return c.JSON(http.StatusOK, response)
}
