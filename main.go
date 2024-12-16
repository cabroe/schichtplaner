package main

import (
	"log"

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
	app, err := app.SetupAndRunApp()
	if err != nil {
		log.Fatalf("Fehler beim Starten der Anwendung: %v", err)
	}

	log.Fatal(app.Listen(":8080"))
}
