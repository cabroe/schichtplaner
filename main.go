package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"schichtplaner/database"
	"schichtplaner/frontend"
	"schichtplaner/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Initialisiere die Datenbank
	database.InitDatabase()
	defer database.CloseDatabase()

	// Create a new echo server
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())

	// Setup the frontend handlers to service vite static assets
	frontend.RegisterHandlers(e)

	// Setup the API Group
	// Die API-Routen werden jetzt in routes/api.go registriert
	routes.RegisterAPIRoutes(e)

	// Graceful Shutdown
	go func() {
		if err := e.Start(fmt.Sprintf(":%d", 3000)); err != nil {
			e.Logger.Info("Server gestoppt")
		}
	}()

	// Warte auf Interrupt Signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// Graceful Shutdown
	if err := e.Shutdown(nil); err != nil {
		e.Logger.Fatal(err)
	}
}
