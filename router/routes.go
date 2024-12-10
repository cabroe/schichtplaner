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
	departments.Get("/:id", handlers.HandleGetOneDepartment)
	departments.Post("/", handlers.HandleCreateDepartment)
	departments.Put("/:id", handlers.HandleUpdateDepartment)
	departments.Delete("/:id", handlers.HandleDeleteDepartment)

	// ShiftDay routes
	shiftDays := app.Group("/shiftdays")
	shiftDays.Get("/", handlers.HandleAllShiftDays)
	shiftDays.Get("/:id", handlers.HandleGetOneShiftDay)
	shiftDays.Post("/", handlers.HandleCreateShiftDay)
	shiftDays.Put("/:id", handlers.HandleUpdateShiftDay)
	shiftDays.Delete("/:id", handlers.HandleDeleteShiftDay)

	// ShiftType routes
	shiftTypes := app.Group("/shifttypes")
	shiftTypes.Get("/", handlers.HandleAllShiftTypes)
	shiftTypes.Get("/:id", handlers.HandleGetOneShiftType)
	shiftTypes.Post("/", handlers.HandleCreateShiftType)
	shiftTypes.Put("/:id", handlers.HandleUpdateShiftType)
	shiftTypes.Delete("/:id", handlers.HandleDeleteShiftType)

	// ShiftWeek routes
	shiftWeeks := app.Group("/shiftweeks")
	shiftWeeks.Get("/", handlers.HandleAllShiftWeeks)
	shiftWeeks.Get("/:id", handlers.HandleGetOneShiftWeek)
	shiftWeeks.Post("/", handlers.HandleCreateShiftWeek)
	shiftWeeks.Put("/:id", handlers.HandleUpdateShiftWeek)
	shiftWeeks.Delete("/:id", handlers.HandleDeleteShiftWeek)
}
