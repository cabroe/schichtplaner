package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"schichtplaner/database"
	"schichtplaner/frontend"
	"schichtplaner/routes"

	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Initialisiere die Datenbank
	database.InitDatabase()
	defer database.CloseDatabase()

	// Echo-Server erstellen
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())

	// Prometheus Middleware aktivieren
	e.Use(echoprometheus.NewMiddleware("schichtplaner"))

	// /api/metrics-Endpoint für Prometheus (VOR dem Frontend)
	e.GET("/api/metrics", echoprometheus.NewHandler())

	// Setup the API Group FIRST (vor dem Frontend)
	// Die API-Routen werden jetzt in routes/routes.go registriert
	routes.RegisterAPIRoutes(e)

	// Setup the frontend handlers to service vite static assets LAST
	frontend.RegisterHandlers(e)

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
	if err := e.Shutdown(context.TODO()); err != nil {
		e.Logger.Fatal(err)
	}
}
