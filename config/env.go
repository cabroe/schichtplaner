package config

import (
	"os"

	"github.com/joho/godotenv"
)

// LoadENV lädt die Umgebungsvariablen basierend auf der Ausführungsumgebung
func LoadENV() error {
	// GO_ENV prüfen
	goEnv := os.Getenv("GO_ENV")

	// Lade .env Datei in Entwicklungsumgebung
	if goEnv == "" || goEnv == "development" {
		// .env für lokale Entwicklung laden
		if err := godotenv.Load(); err != nil {
			return err
		}
	}

	// Lade .env.test für Testumgebung
	if goEnv == "test" {
		if err := godotenv.Load(".env.test"); err != nil {
			return err
		}
	}

	return nil
}
