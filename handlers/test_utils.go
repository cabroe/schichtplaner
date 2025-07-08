package handlers

import (
	"schichtplaner/models"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

// CustomValidator wraps the validator
type CustomValidator struct {
	validator *validator.Validate
}

// Validate validates the struct
func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

// SetupTestEcho creates an Echo instance for testing
func SetupTestEcho() *echo.Echo {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	return e
}

// CleanupTestData clears all test data
func CleanupTestData() {
	// Reset the in-memory stores
	models.ResetStores()
}
