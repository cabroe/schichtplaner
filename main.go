package main

import (
	"fmt"

	"github.com/danhawkins/go-vite-react-example/frontend"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/danhawkins/go-vite-react-example/routes"
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
