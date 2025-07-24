package utils

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestNewValidator(t *testing.T) {
	validator := NewValidator()
	assert.NotNil(t, validator)
	assert.Empty(t, validator.rules)
}

func TestRequiredString(t *testing.T) {
	validator := NewValidator()

	// Test mit leerem String
	validator.RequiredString("Name", "", "Name ist ein Pflichtfeld")
	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 1)
	assert.Equal(t, "Name ist ein Pflichtfeld", result.Errors[0])

	// Test mit gültigem String
	validator = NewValidator()
	validator.RequiredString("Name", "Test", "Name ist ein Pflichtfeld")
	result = validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)
}

func TestRequiredUint(t *testing.T) {
	validator := NewValidator()

	// Test mit 0
	validator.RequiredUint("ID", 0, "ID ist ein Pflichtfeld")
	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 1)
	assert.Equal(t, "ID ist ein Pflichtfeld", result.Errors[0])

	// Test mit gültigem Wert
	validator = NewValidator()
	validator.RequiredUint("ID", 1, "ID ist ein Pflichtfeld")
	result = validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)
}

func TestRequiredTime(t *testing.T) {
	validator := NewValidator()

	// Test mit Zero Time
	validator.RequiredTime("StartDate", time.Time{}, "StartDate ist ein Pflichtfeld")
	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 1)
	assert.Equal(t, "StartDate ist ein Pflichtfeld", result.Errors[0])

	// Test mit gültiger Time
	validator = NewValidator()
	validator.RequiredTime("StartDate", time.Now(), "StartDate ist ein Pflichtfeld")
	result = validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)
}

func TestTimeRange(t *testing.T) {
	validator := NewValidator()

	// Test mit ungültigem Zeitbereich (Start nach End)
	startTime := time.Date(2025, 1, 2, 10, 0, 0, 0, time.UTC)
	endTime := time.Date(2025, 1, 1, 10, 0, 0, 0, time.UTC)

	validator.TimeRange("StartDate", "EndDate", startTime, endTime, "StartDate muss vor EndDate liegen")
	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 1)
	assert.Equal(t, "StartDate muss vor EndDate liegen", result.Errors[0])

	// Test mit gültigem Zeitbereich
	validator = NewValidator()
	startTime = time.Date(2025, 1, 1, 10, 0, 0, 0, time.UTC)
	endTime = time.Date(2025, 1, 2, 10, 0, 0, 0, time.UTC)

	validator.TimeRange("StartDate", "EndDate", startTime, endTime, "StartDate muss vor EndDate liegen")
	result = validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)
}

func TestNumberRange(t *testing.T) {
	validator := NewValidator()

	// Test mit ungültigem Zahlenbereich (Min > Max)
	validator.NumberRange("MinDuration", "MaxDuration", 10, 5, "MinDuration darf nicht größer als MaxDuration sein")
	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 1)
	assert.Equal(t, "MinDuration darf nicht größer als MaxDuration sein", result.Errors[0])

	// Test mit gültigem Zahlenbereich
	validator = NewValidator()
	validator.NumberRange("MinDuration", "MaxDuration", 5, 10, "MinDuration darf nicht größer als MaxDuration sein")
	result = validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)

	// Test mit gleichen Werten
	validator = NewValidator()
	validator.NumberRange("MinDuration", "MaxDuration", 5, 5, "MinDuration darf nicht größer als MaxDuration sein")
	result = validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)
}

func TestMultipleValidations(t *testing.T) {
	validator := NewValidator()

	// Test mit mehreren Validierungen
	validator.RequiredString("Name", "", "Name ist ein Pflichtfeld")
	validator.RequiredUint("ID", 0, "ID ist ein Pflichtfeld")
	validator.RequiredTime("StartDate", time.Time{}, "StartDate ist ein Pflichtfeld")

	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 3)
	assert.Contains(t, result.Errors, "Name ist ein Pflichtfeld")
	assert.Contains(t, result.Errors, "ID ist ein Pflichtfeld")
	assert.Contains(t, result.Errors, "StartDate ist ein Pflichtfeld")
}

func TestValidateAndRespond(t *testing.T) {
	e := echo.New()

	// Test mit ungültiger Validierung
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	validator := NewValidator()
	validator.RequiredString("Name", "", "Name ist ein Pflichtfeld")

	err := validator.ValidateAndRespond(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "Name ist ein Pflichtfeld")

	// Test mit gültiger Validierung
	req = httptest.NewRequest(http.MethodPost, "/", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	validator = NewValidator()
	validator.RequiredString("Name", "Test", "Name ist ein Pflichtfeld")

	err = validator.ValidateAndRespond(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestValidateRequiredFields(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	fields := map[string]interface{}{
		"Name": "",
		"ID":   0,
		"Time": time.Time{},
	}

	err := ValidateRequiredFields(c, fields)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "ist ein Pflichtfeld")
}

func TestValidateTimeRange(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	startTime := time.Date(2025, 1, 2, 10, 0, 0, 0, time.UTC)
	endTime := time.Date(2025, 1, 1, 10, 0, 0, 0, time.UTC)

	err := ValidateTimeRange(c, "StartDate", "EndDate", startTime, endTime)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "muss vor")
}

func TestValidateNumberRange(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := ValidateNumberRange(c, "MinDuration", "MaxDuration", 10, 5)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "darf nicht größer als")
}

func TestValidatorChaining(t *testing.T) {
	validator := NewValidator().
		RequiredString("Name", "Test", "Name ist ein Pflichtfeld").
		RequiredUint("ID", 1, "ID ist ein Pflichtfeld").
		RequiredTime("StartDate", time.Now(), "StartDate ist ein Pflichtfeld")

	result := validator.Validate()
	assert.True(t, result.IsValid)
	assert.Empty(t, result.Errors)
}

func TestValidatorWithMixedValidations(t *testing.T) {
	validator := NewValidator().
		RequiredString("Name", "Test", "Name ist ein Pflichtfeld").
		RequiredString("Email", "", "Email ist ein Pflichtfeld").
		RequiredUint("ID", 1, "ID ist ein Pflichtfeld")

	result := validator.Validate()
	assert.False(t, result.IsValid)
	assert.Len(t, result.Errors, 1)
	assert.Equal(t, "Email ist ein Pflichtfeld", result.Errors[0])
}
