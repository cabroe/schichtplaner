package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterTeamRoutes registriert alle Team-bezogenen API-Routen
func RegisterTeamRoutes(api *echo.Group) {
	// Team endpoints
	api.GET("/teams", handlers.GetTeams)
	api.GET("/teams/active", handlers.GetActiveTeams)
	api.GET("/teams/:id", handlers.GetTeam)
	api.POST("/teams", handlers.CreateTeam)
	api.PUT("/teams/:id", handlers.UpdateTeam)
	api.DELETE("/teams/:id", handlers.DeleteTeam)
	api.PATCH("/teams/:id/toggle", handlers.ToggleTeamActive)
	api.PUT("/teams/order", handlers.UpdateTeamOrder)

	// Team-Mitglieder-Management
	api.POST("/teams/:id/members", handlers.AddUserToTeam)
	api.DELETE("/teams/:id/members/:user_id", handlers.RemoveUserFromTeam)
	api.GET("/teams/:id/members", handlers.GetTeamMembers)
}
