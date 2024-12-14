package config

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	_ "github.com/ptmmeiningen/schichtplaner/docs"
)

func AddSwaggerRoutes(app *fiber.App) {
	// Swagger UI und JSON-Dokumentation
	app.Get("/api/v1/swagger/*", swagger.New(swagger.Config{
		URL:         "doc.json",
		DeepLinking: true,
		Title:       "Schichtplaner API Dokumentation",
	}))
}
