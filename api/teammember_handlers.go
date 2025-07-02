package api

import (
	"net/http"
	"strconv"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/labstack/echo/v4"
)

// getAllTeamMembers returns all team members from the database
func getAllTeamMembers(c echo.Context) error {
	var teamMembers []models.TeamMember
	
	result := db.DB.Preload("Team").Preload("User").Find(&teamMembers)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch team members"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"teamMembers": teamMembers,
		"count":       len(teamMembers),
	})
}

// getTeamMemberByID returns a specific team member by ID
func getTeamMemberByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid team member ID"})
	}

	var teamMember models.TeamMember
	result := db.DB.Preload("Team").Preload("User").First(&teamMember, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Team member not found"})
	}

	return c.JSON(http.StatusOK, teamMember)
}

// createTeamMember creates a new team member
func createTeamMember(c echo.Context) error {
	var teamMember models.TeamMember
	if err := c.Bind(&teamMember); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result := db.DB.Create(&teamMember)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create team member"})
	}

	return c.JSON(http.StatusCreated, teamMember)
}

// updateTeamMember updates an existing team member
func updateTeamMember(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid team member ID"})
	}

	var teamMember models.TeamMember
	result := db.DB.First(&teamMember, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Team member not found"})
	}

	if err := c.Bind(&teamMember); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result = db.DB.Save(&teamMember)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update team member"})
	}

	return c.JSON(http.StatusOK, teamMember)
}

// deleteTeamMember deletes a team member by ID
func deleteTeamMember(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid team member ID"})
	}

	result := db.DB.Delete(&models.TeamMember{}, id)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete team member"})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Team member not found"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Team member deleted successfully"})
}
