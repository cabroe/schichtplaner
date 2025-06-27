package main

import (
	"fmt"

	"github.com/danhawkins/go-vite-react-example/api"
	"github.com/danhawkins/go-vite-react-example/frontend"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Create a new echo server
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())

	// Setup the frontend handlers to service vite static assets
	frontend.RegisterHandlers(e)

	// Setup API handlers
	api.RegisterHandlers(e)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", 3000)))
}
