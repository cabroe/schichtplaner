package config

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"

	_ "github.com/ptmmeiningen/schichtplaner/docs"
)

func AddSwaggerRoutes(app *fiber.App) {
	// setup swagger unter /api/v1/swagger
	app.Get("/api/v1/swagger/*", swagger.HandlerDefault)
}
