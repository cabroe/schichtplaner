package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/handlers"
)

func SetupRoutes(app *fiber.App) {
	// API v1 routes
	v1 := app.Group("/api/v1")

	// Health check
	v1.Get("/health", handlers.HandleHealthCheck)

	// User routes
	users := v1.Group("/users")
	users.Get("/", handlers.HandleAllUsers)
	users.Post("/", handlers.HandleCreateUser)
	users.Get("/:id", handlers.HandleGetOneUser)
	users.Put("/:id", handlers.HandleUpdateUser)
	users.Delete("/:id", handlers.HandleDeleteUser)

	// Department routes
	departments := v1.Group("/departments")
	departments.Get("/", handlers.HandleAllDepartments)
	departments.Get("/:id", handlers.HandleGetOneDepartment)
	departments.Post("/", handlers.HandleCreateDepartment)
	departments.Put("/:id", handlers.HandleUpdateDepartment)
	departments.Delete("/:id", handlers.HandleDeleteDepartment)

	// ShiftDay routes
	shiftDays := v1.Group("/shiftdays")
	shiftDays.Get("/", handlers.HandleAllShiftDays)
	shiftDays.Get("/:id", handlers.HandleGetOneShiftDay)
	shiftDays.Post("/", handlers.HandleCreateShiftDay)
	shiftDays.Put("/:id", handlers.HandleUpdateShiftDay)
	shiftDays.Delete("/:id", handlers.HandleDeleteShiftDay)

	// ShiftType routes
	shiftTypes := v1.Group("/shifttypes")
	shiftTypes.Get("/", handlers.HandleAllShiftTypes)
	shiftTypes.Get("/:id", handlers.HandleGetOneShiftType)
	shiftTypes.Post("/", handlers.HandleCreateShiftType)
	shiftTypes.Put("/:id", handlers.HandleUpdateShiftType)
	shiftTypes.Delete("/:id", handlers.HandleDeleteShiftType)

	// ShiftWeek routes
	shiftWeeks := v1.Group("/shiftweeks")
	shiftWeeks.Get("/", handlers.HandleAllShiftWeeks)
	shiftWeeks.Get("/:id", handlers.HandleGetOneShiftWeek)
	shiftWeeks.Post("/", handlers.HandleCreateShiftWeek)
	shiftWeeks.Put("/:id", handlers.HandleUpdateShiftWeek)
	shiftWeeks.Delete("/:id", handlers.HandleDeleteShiftWeek)

	// Hier können Sie weitere API-Versionen hinzufügen
	// Beispiel für v2:
	// v2 := app.Group("/api/v2")
	// ... v2 Routen
}
