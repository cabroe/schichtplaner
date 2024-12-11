package config

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"

	// Swagger-Dokumentation importieren
	_ "github.com/ptmmeiningen/schichtplaner/docs"
)

// AddSwaggerRoutes konfiguriert die Swagger-UI Routen
func AddSwaggerRoutes(app *fiber.App) {
	// Swagger-Handler unter /api/v1/swagger einrichten
	// Dies ermöglicht den Zugriff auf die API-Dokumentation im Browser
	app.Get("/api/v1/swagger/*", swagger.HandlerDefault)
}
