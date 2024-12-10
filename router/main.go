package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/handlers"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/health", handlers.HandleHealthCheck)

	// User routes
	users := app.Group("/users")
	users.Get("/", handlers.HandleAllUsers)
	users.Post("/", handlers.HandleCreateUser)
	users.Get("/:id", handlers.HandleGetOneUser)
	users.Put("/:id", handlers.HandleUpdateUser)
	users.Delete("/:id", handlers.HandleDeleteUser)

	// Department routes
	departments := app.Group("/departments")
	departments.Get("/", handlers.HandleAllDepartments)
	departments.Post("/", handlers.HandleCreateDepartment)

	// ShiftType routes
	shiftTypes := app.Group("/shifttypes")
	shiftTypes.Get("/", handlers.HandleAllShiftTypes)
	shiftTypes.Post("/", handlers.HandleCreateShiftType)

	// ShiftWeek routes
	shiftWeeks := app.Group("/shiftweeks")
	shiftWeeks.Get("/", handlers.HandleAllShiftWeeks)
	shiftWeeks.Post("/", handlers.HandleCreateShiftWeek)

	// ShiftDay routes
	shiftDays := app.Group("/shiftdays")
	shiftDays.Get("/", handlers.HandleAllShiftDays)
	shiftDays.Post("/", handlers.HandleCreateShiftDay)
}
