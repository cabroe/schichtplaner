package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/ptmmeiningen/schichtplaner/app"
	_ "github.com/ptmmeiningen/schichtplaner/docs"
)

// @title Schichtplaner
// @version 1.0
// @description Schichtplanung mit Go, Fiber und SQLite
// @contact.name Carsten Bröckert
// @license.name MIT
// @host localhost:8080
// @BasePath /
func main() {
	// Graceful Shutdown Setup
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	// Setup und Start der App
	app, err := app.SetupAndRunApp()
	if err != nil {
		log.Fatalf("Failed to setup and run app: %v", err)
	}

	// Warte auf Shutdown Signal
	<-c
	log.Println("Shutting down gracefully...")
	_ = app.Shutdown()
}
