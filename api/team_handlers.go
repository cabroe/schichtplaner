package api

import (
	"net/http"
	"strconv"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/labstack/echo/v4"
)

// getAllTeams returns all teams from the database
func getAllTeams(c echo.Context) error {
	var teams []models.Team
	
	result := db.DB.Find(&teams)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch teams"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"teams": teams,
		"count": len(teams),
	})
}

// getTeamByID returns a specific team by ID
func getTeamByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid team ID"})
	}

	var team models.Team
	result := db.DB.Preload("TeamMembers").Preload("ShiftTypes").First(&team, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Team not found"})
	}

	return c.JSON(http.StatusOK, team)
}

// createTeam creates a new team
func createTeam(c echo.Context) error {
	var team models.Team
	if err := c.Bind(&team); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result := db.DB.Create(&team)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create team"})
	}

	return c.JSON(http.StatusCreated, team)
}

// updateTeam updates an existing team
func updateTeam(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid team ID"})
	}

	var team models.Team
	result := db.DB.First(&team, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Team not found"})
	}

	if err := c.Bind(&team); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result = db.DB.Save(&team)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update team"})
	}

	return c.JSON(http.StatusOK, team)
}

// deleteTeam deletes a team by ID
func deleteTeam(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid team ID"})
	}

	result := db.DB.Delete(&models.Team{}, id)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete team"})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Team not found"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Team deleted successfully"})
}
