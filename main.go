package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/ptmmeiningen/schichtplaner/app"
)

// @title           Schichtplaner API
// @version         1.0
// @description     REST-API für die Verwaltung von Schichtplänen
// @contact.name    Carsten Bröckert
// @license.name    MIT
// @host            localhost:8080
// @BasePath        /
func main() {
	shutdownSignal := make(chan os.Signal, 1)
	signal.Notify(shutdownSignal, os.Interrupt, syscall.SIGTERM)

	app, err := app.SetupAndRunApp()
	if err != nil {
		log.Fatalf("Fehler beim Starten der Anwendung: %v", err)
	}

	<-shutdownSignal
	log.Println("Server wird heruntergefahren...")

	if err := app.Shutdown(); err != nil {
		log.Printf("Fehler beim Herunterfahren: %v", err)
	}

	log.Println("Server erfolgreich beendet")
}
