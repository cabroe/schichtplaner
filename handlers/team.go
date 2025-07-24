package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/database"
	"schichtplaner/models"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// GetTeams gibt alle Teams mit Pagination zurück
func GetTeams(c echo.Context) error {
	params := utils.GetPaginationParams(c)

	var teams []models.Team
	var total int64

	// Zähle die Gesamtanzahl
	database.DB.Model(&models.Team{}).Count(&total)

	// Lade die paginierten Daten, sortiert nach SortOrder und Name
	if err := database.DB.Preload("Users").Order("sort_order ASC, name ASC").Offset(params.Offset).Limit(params.PageSize).Find(&teams).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Teams",
		})
	}

	response := utils.CreatePaginatedResponse(teams, int(total), params)
	return c.JSON(http.StatusOK, response)
}

// GetActiveTeams gibt nur aktive Teams zurück
func GetActiveTeams(c echo.Context) error {
	var teams []models.Team

	if err := database.DB.Where("is_active = ?", true).Preload("Users").Order("sort_order ASC, name ASC").Find(&teams).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der aktiven Teams",
		})
	}

	return c.JSON(http.StatusOK, teams)
}

// GetTeam gibt ein spezifisches Team zurück
func GetTeam(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	var team models.Team
	if err := database.DB.Preload("Users").First(&team, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Team nicht gefunden",
		})
	}

	return c.JSON(http.StatusOK, team)
}

// CreateTeam erstellt ein neues Team
func CreateTeam(c echo.Context) error {
	var team models.Team

	if err := c.Bind(&team); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-Daten",
		})
	}

	if err := database.DB.Create(&team).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Erstellen des Teams",
		})
	}

	return c.JSON(http.StatusCreated, team)
}

// UpdateTeam aktualisiert ein bestehendes Team
func UpdateTeam(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	var team models.Team
	if err := database.DB.First(&team, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Team nicht gefunden",
		})
	}

	var updateData models.Team
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-Daten",
		})
	}

	if err := database.DB.Model(&team).Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren des Teams",
		})
	}

	return c.JSON(http.StatusOK, team)
}

// DeleteTeam löscht ein Team
func DeleteTeam(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	var team models.Team
	if err := database.DB.First(&team, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Team nicht gefunden",
		})
	}

	// Prüfe, ob das Team noch Mitglieder hat
	var count int64
	database.DB.Model(&models.User{}).Where("team_id = ?", id).Count(&count)
	if count > 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Team kann nicht gelöscht werden, da es noch Mitglieder hat",
		})
	}

	if err := database.DB.Delete(&team).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Löschen des Teams",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Team erfolgreich gelöscht",
	})
}

// ToggleTeamActive aktiviert/deaktiviert ein Team
func ToggleTeamActive(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	var team models.Team
	if err := database.DB.First(&team, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Team nicht gefunden",
		})
	}

	team.IsActive = !team.IsActive

	if err := database.DB.Save(&team).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Ändern des Status",
		})
	}

	return c.JSON(http.StatusOK, team)
}

// AddUserToTeam fügt einen Benutzer zu einem Team hinzu
func AddUserToTeam(c echo.Context) error {
	teamID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	var requestData struct {
		UserID uint `json:"user_id"`
	}

	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Anfrage-Daten",
		})
	}

	// Prüfe, ob das Team existiert
	var team models.Team
	if err := database.DB.First(&team, teamID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Team nicht gefunden",
		})
	}

	// Prüfe, ob der Benutzer existiert
	var user models.User
	if err := database.DB.First(&user, requestData.UserID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Benutzer nicht gefunden",
		})
	}

	// Füge den Benutzer zum Team hinzu
	user.TeamID = &team.ID
	if err := database.DB.Save(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Hinzufügen des Benutzers zum Team",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Benutzer erfolgreich zum Team hinzugefügt",
	})
}

// RemoveUserFromTeam entfernt einen Benutzer aus einem Team
func RemoveUserFromTeam(c echo.Context) error {
	teamID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Benutzer-ID",
		})
	}

	// Prüfe, ob der Benutzer im Team ist
	var user models.User
	if err := database.DB.Where("id = ? AND team_id = ?", userID, teamID).First(&user).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Benutzer nicht im Team gefunden",
		})
	}

	// Entferne den Benutzer aus dem Team
	user.TeamID = nil
	if err := database.DB.Save(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Entfernen des Benutzers aus dem Team",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Benutzer erfolgreich aus dem Team entfernt",
	})
}

// GetTeamMembers gibt alle Mitglieder eines Teams zurück
func GetTeamMembers(c echo.Context) error {
	teamID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Team-ID",
		})
	}

	var users []models.User
	if err := database.DB.Where("team_id = ?", teamID).Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Laden der Team-Mitglieder",
		})
	}

	return c.JSON(http.StatusOK, users)
}

// UpdateTeamOrder aktualisiert die Sortierreihenfolge von Teams
func UpdateTeamOrder(c echo.Context) error {
	var orderData struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}

	if err := c.Bind(&orderData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Ungültige Sortierdaten",
		})
	}

	var team models.Team
	if err := database.DB.First(&team, orderData.ID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Team nicht gefunden",
		})
	}

	team.SortOrder = orderData.SortOrder

	if err := database.DB.Save(&team).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Fehler beim Aktualisieren der Sortierung",
		})
	}

	return c.JSON(http.StatusOK, team)
}
