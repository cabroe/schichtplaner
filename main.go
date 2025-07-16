package main

import (
	"fmt"

	"schichtplaner/frontend"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"schichtplaner/routes"
)

func main() {
	// Create a new echo server
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())

	// Setup the frontend handlers to service vite static assets
	frontend.RegisterHandlers(e)

	// Setup the API Group
	// Die API-Routen werden jetzt in routes/api.go registriert
	routes.RegisterAPIRoutes(e)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", 3000)))
}
