package api

import (
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


