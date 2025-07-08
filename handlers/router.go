package handlers

import (
	"github.com/labstack/echo/v4"
)

func RegisterRoutes(api *echo.Group) {
	// Health and general endpoints
	RegisterHealthRoutes(api)
	
	// Business logic endpoints
	RegisterShiftRoutes(api)
	RegisterEmployeeRoutes(api)
	RegisterReportRoutes(api)
}
