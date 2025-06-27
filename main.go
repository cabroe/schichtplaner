package main

import (
	"fmt"
	"os"

	"github.com/danhawkins/go-vite-react-example/api"
	"github.com/danhawkins/go-vite-react-example/frontend"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file, using defaults")
	}

	// Get port from environment variable or use default
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	// Create a new echo server
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())

	// Setup the frontend handlers to service vite static assets
	frontend.RegisterHandlers(e)

	// Setup API handlers
	api.RegisterHandlers(e)

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}
