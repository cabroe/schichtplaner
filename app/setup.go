package app

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/ptmmeiningen/schichtplaner/config"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/router"
)

// SetupAndRunApp initialisiert und startet die Anwendung
func SetupAndRunApp() (*fiber.App, error) {
	// Umgebungsvariablen laden
	if err := config.LoadENV(); err != nil {
		return nil, err
	}

	// Datenbankverbindung herstellen
	if err := database.StartDB(); err != nil {
		return nil, err
	}

	// Datenbank-Migrationen durchführen
	if err := database.AutoMigrate(); err != nil {
		return nil, err
	}

	// Fiber-App mit Konfiguration erstellen
	app := fiber.New(fiber.Config{
		AppName: "Schichtplaner",
	})

	// Middleware für Panic Recovery einbinden
	app.Use(recover.New())

	// Logger-Middleware mit Zeitstempeln konfigurieren
	app.Use(logger.New(logger.Config{
		Format:     "[${time}] ${ip}:${port} ${status} - ${method} ${path} ${latency}\n",
		TimeFormat: "2006-01-02 15:04:05",
	}))

	// CORS-Middleware für API-Zugriff konfigurieren
	app.Use(cors.New(cors.Config{
		AllowOrigins:  "*",                                        // Alle Ursprünge erlauben
		AllowMethods:  "GET,POST,PUT,DELETE,OPTIONS",              // HTTP-Methoden definieren
		AllowHeaders:  "Origin,Content-Type,Accept,Authorization", // Erlaubte Header
		ExposeHeaders: "Content-Length",                           // Exponierte Header
		MaxAge:        86400,                                      // Cache-Dauer für CORS-Preflight
	}))

	// Routen und Swagger einrichten
	router.SetupRoutes(app)
	config.AddSwaggerRoutes(app)

	// Server-Port aus Umgebungsvariablen oder Standard
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Server im Hintergrund starten
	go app.Listen(":" + port)

	return app, nil
}
