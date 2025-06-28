package api

import (
	"net/http"
	"strconv"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/labstack/echo/v4"
)

// RegisterHandlers registriert alle API-Routen
func RegisterHandlers(e *echo.Echo) {
	// Setup the API Group
	api := e.Group("/api")

	// Message endpoints
	api.GET("/message", getLatestMessage)
	api.GET("/messages", getAllMessages)

	// User endpoints
	api.GET("/users", getAllUsers)
	api.GET("/users/:id", getUserByID)
	api.POST("/users", createUser)
	api.PUT("/users/:id", updateUser)
	api.DELETE("/users/:id", deleteUser)

	// Team endpoints
	api.GET("/teams", getAllTeams)
	api.GET("/teams/:id", getTeamByID)
	api.POST("/teams", createTeam)
	api.PUT("/teams/:id", updateTeam)
	api.DELETE("/teams/:id", deleteTeam)

	// TeamMember endpoints
	api.GET("/team-members", getAllTeamMembers)
	api.GET("/team-members/:id", getTeamMemberByID)
	api.POST("/team-members", createTeamMember)
	api.PUT("/team-members/:id", updateTeamMember)
	api.DELETE("/team-members/:id", deleteTeamMember)

	// ShiftType endpoints
	api.GET("/shift-types", getAllShiftTypes)
	api.GET("/shift-types/:id", getShiftTypeByID)
	api.POST("/shift-types", createShiftType)
	api.PUT("/shift-types/:id", updateShiftType)
	api.DELETE("/shift-types/:id", deleteShiftType)
}

// getLatestMessage returns the most recent message from the database
func getLatestMessage(c echo.Context) error {
	var message models.Message
	
	// Get the latest message from database
	result := db.DB.Order("created_at DESC").First(&message)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "No message found"})
	}

	// Return the message in the expected format for frontend compatibility
	return c.JSON(http.StatusOK, map[string]string{"message": message.Content})
}

// getAllMessages returns all messages from the database
func getAllMessages(c echo.Context) error {
	var messages []models.Message
	
	// Get all messages from database
	result := db.DB.Order("created_at DESC").Find(&messages)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch messages"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"messages": messages,
		"count":    len(messages),
	})
}

// User handlers
func getAllUsers(c echo.Context) error {
	var users []models.User
	
	result := db.DB.Find(&users)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch users"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"users": users,
		"count": len(users),
	})
}

func getUserByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var user models.User
	result := db.DB.Preload("TeamMembers").First(&user, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, user)
}

func createUser(c echo.Context) error {
	var user models.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result := db.DB.Create(&user)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user"})
	}

	return c.JSON(http.StatusCreated, user)
}

func updateUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var user models.User
	result := db.DB.First(&user, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}

	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result = db.DB.Save(&user)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update user"})
	}

	return c.JSON(http.StatusOK, user)
}

func deleteUser(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	result := db.DB.Delete(&models.User{}, id)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete user"})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "User deleted successfully"})
}

// Team handlers
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

// TeamMember handlers
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

// ShiftType handlers
func getAllShiftTypes(c echo.Context) error {
	var shiftTypes []models.ShiftType
	
	result := db.DB.Preload("Team").Preload("CreatedByUser").Find(&shiftTypes)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch shift types"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"shiftTypes": shiftTypes,
		"count":      len(shiftTypes),
	})
}

func getShiftTypeByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid shift type ID"})
	}

	var shiftType models.ShiftType
	result := db.DB.Preload("Team").Preload("CreatedByUser").First(&shiftType, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Shift type not found"})
	}

	return c.JSON(http.StatusOK, shiftType)
}

func createShiftType(c echo.Context) error {
	var shiftType models.ShiftType
	if err := c.Bind(&shiftType); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result := db.DB.Create(&shiftType)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create shift type"})
	}

	return c.JSON(http.StatusCreated, shiftType)
}

func updateShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid shift type ID"})
	}

	var shiftType models.ShiftType
	result := db.DB.First(&shiftType, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Shift type not found"})
	}

	if err := c.Bind(&shiftType); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result = db.DB.Save(&shiftType)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update shift type"})
	}

	return c.JSON(http.StatusOK, shiftType)
}

func deleteShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid shift type ID"})
	}

	result := db.DB.Delete(&models.ShiftType{}, id)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete shift type"})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Shift type not found"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Shift type deleted successfully"})
}
