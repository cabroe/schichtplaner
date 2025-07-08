package main

import (
	"fmt"

	"schichtplaner/frontend"
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Create a new echo server
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Gzip())
	e.Use(middleware.CORS())

	// Setup the frontend handlers to service vite static assets
	frontend.RegisterHandlers(e)

	// Setup the API Group
	api := e.Group("/api")
	handlers.RegisterRoutes(api)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", 3000)))
}
