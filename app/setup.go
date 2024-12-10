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

func SetupAndRunApp() (*fiber.App, error) {
	// load env
	err := config.LoadENV()
	if err != nil {
		return nil, err
	}

	// start database
	err = database.StartDB()
	if err != nil {
		return nil, err
	}

	// start automigration
	err = database.AutoMigrate()
	if err != nil {
		return nil, err
	}

	// defer closing database
	defer database.CloseDB()

	// create app
	app := fiber.New()

	// attach logger middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path} ${latency}\n",
	}))

	// attach CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	// setup routes
	router.SetupRoutes(app)

	// attach swagger
	config.AddSwaggerRoutes(app)

	// get the port and start
	port := os.Getenv("PORT")
	go app.Listen(":" + port)

	return app, nil
}
