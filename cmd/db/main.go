package main

import (
	"flag"
	"log"
	"os"

	"schichtplaner/database"
)

func main() {
	// Parse command line flags
	reset := flag.Bool("reset", false, "Setzt die Datenbank zurück (löscht alle Daten)")
	seed := flag.Bool("seed", false, "Füllt die Datenbank mit Seed-Daten")
	resetAndSeed := flag.Bool("reset-and-seed", false, "Setzt die Datenbank zurück und füllt sie mit Seed-Daten")

	flag.Parse()

	// Initialisiere die Datenbank
	database.InitDatabase()
	defer database.CloseDatabase()

	// Führe die gewünschte Operation aus
	if *resetAndSeed {
		log.Println("Führe Reset und Seed aus...")
		if err := database.ResetAndSeedDatabase(); err != nil {
			log.Fatal("Fehler beim Reset und Seed:", err)
		}
		log.Println("Reset und Seed erfolgreich abgeschlossen")
	} else if *reset {
		log.Println("Führe Reset aus...")
		if err := database.ResetDatabase(); err != nil {
			log.Fatal("Fehler beim Reset:", err)
		}
		log.Println("Reset erfolgreich abgeschlossen")
	} else if *seed {
		log.Println("Führe Seed aus...")
		if err := database.SeedDatabase(); err != nil {
			log.Fatal("Fehler beim Seed:", err)
		}
		log.Println("Seed erfolgreich abgeschlossen")
	} else {
		log.Println("Verwendung:")
		log.Println("  ./db -reset              # Setzt die Datenbank zurück")
		log.Println("  ./db -seed               # Füllt die Datenbank mit Seed-Daten")
		log.Println("  ./db -reset-and-seed     # Reset und Seed in einem Schritt")
		os.Exit(1)
	}
}
