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

	// Employee routes
	employees := v1.Group("/employees")
	employees.Get("/", handlers.HandleAllEmployees)
	employees.Post("/", handlers.HandleCreateEmployee)
	employees.Get("/:id", handlers.HandleGetOneEmployee)
	employees.Put("/:id", handlers.HandleUpdateEmployee)
	employees.Delete("/:id", handlers.HandleDeleteEmployee)
	employees.Get("/department/:id", handlers.HandleGetDepartmentEmployees)

	// Department routes
	departments := v1.Group("/departments")
	departments.Get("/", handlers.HandleAllDepartments)
	departments.Post("/", handlers.HandleCreateDepartment)
	departments.Get("/:id", handlers.HandleGetOneDepartment)
	departments.Put("/:id", handlers.HandleUpdateDepartment)
	departments.Delete("/:id", handlers.HandleDeleteDepartment)

	// ShiftDay routes
	shiftDays := v1.Group("/shiftdays")
	shiftDays.Get("/", handlers.HandleAllShiftDays)
	shiftDays.Post("/", handlers.HandleCreateShiftDay)
	shiftDays.Get("/:id", handlers.HandleGetOneShiftDay)
	shiftDays.Put("/:id", handlers.HandleUpdateShiftDay)
	shiftDays.Delete("/:id", handlers.HandleDeleteShiftDay)

	// ShiftType routes
	shiftTypes := v1.Group("/shifttypes")
	shiftTypes.Get("/", handlers.HandleAllShiftTypes)
	shiftTypes.Post("/", handlers.HandleCreateShiftType)
	shiftTypes.Get("/:id", handlers.HandleGetOneShiftType)
	shiftTypes.Put("/:id", handlers.HandleUpdateShiftType)
	shiftTypes.Delete("/:id", handlers.HandleDeleteShiftType)

	// ShiftWeek routes
	shiftWeeks := v1.Group("/shiftweeks")
	shiftWeeks.Get("/", handlers.HandleAllShiftWeeks)
	shiftWeeks.Post("/", handlers.HandleCreateShiftWeek)
	shiftWeeks.Get("/:id", handlers.HandleGetOneShiftWeek)
	shiftWeeks.Put("/:id", handlers.HandleUpdateShiftWeek)
	shiftWeeks.Delete("/:id", handlers.HandleDeleteShiftWeek)
	shiftWeeks.Get("/department/:id", handlers.HandleGetDepartmentShiftWeeks)
}
