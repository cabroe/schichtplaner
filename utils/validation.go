package utils

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// ValidationRule definiert eine Validierungsregel
type ValidationRule struct {
	Field   string
	Value   interface{}
	Message string
	Test    func(interface{}) bool
}

// ValidationResult enthält das Ergebnis einer Validierung
type ValidationResult struct {
	IsValid bool
	Errors  []string
}

// Validator ist ein Hilfsmittel für die Validierung
type Validator struct {
	rules []ValidationRule
}

// NewValidator erstellt einen neuen Validator
func NewValidator() *Validator {
	return &Validator{
		rules: make([]ValidationRule, 0),
	}
}

// Required fügt eine Required-Validierung hinzu
func (v *Validator) Required(field string, value interface{}, message string) *Validator {
	v.rules = append(v.rules, ValidationRule{
		Field:   field,
		Value:   value,
		Message: message,
		Test: func(val interface{}) bool {
			switch v := val.(type) {
			case string:
				return v != ""
			case uint:
				return v != 0
			case int:
				return v != 0
			case time.Time:
				return !v.IsZero()
			default:
				return val != nil
			}
		},
	})
	return v
}

// RequiredString fügt eine Required-Validierung für Strings hinzu
func (v *Validator) RequiredString(field string, value string, message string) *Validator {
	v.rules = append(v.rules, ValidationRule{
		Field:   field,
		Value:   value,
		Message: message,
		Test: func(val interface{}) bool {
			if str, ok := val.(string); ok {
				return str != ""
			}
			return false
		},
	})
	return v
}

// RequiredUint fügt eine Required-Validierung für Uint hinzu
func (v *Validator) RequiredUint(field string, value uint, message string) *Validator {
	v.rules = append(v.rules, ValidationRule{
		Field:   field,
		Value:   value,
		Message: message,
		Test: func(val interface{}) bool {
			if u, ok := val.(uint); ok {
				return u != 0
			}
			return false
		},
	})
	return v
}

// RequiredTime fügt eine Required-Validierung für Time hinzu
func (v *Validator) RequiredTime(field string, value time.Time, message string) *Validator {
	v.rules = append(v.rules, ValidationRule{
		Field:   field,
		Value:   value,
		Message: message,
		Test: func(val interface{}) bool {
			if t, ok := val.(time.Time); ok {
				return !t.IsZero()
			}
			return false
		},
	})
	return v
}

// TimeRange fügt eine Zeitbereich-Validierung hinzu
func (v *Validator) TimeRange(startField, endField string, startTime, endTime time.Time, message string) *Validator {
	v.rules = append(v.rules, ValidationRule{
		Field:   startField + "_" + endField,
		Value:   []time.Time{startTime, endTime},
		Message: message,
		Test: func(val interface{}) bool {
			if times, ok := val.([]time.Time); ok && len(times) == 2 {
				return !times[0].After(times[1])
			}
			return false
		},
	})
	return v
}

// NumberRange fügt eine Zahlenbereich-Validierung hinzu
func (v *Validator) NumberRange(minField, maxField string, min, max int, message string) *Validator {
	v.rules = append(v.rules, ValidationRule{
		Field:   minField + "_" + maxField,
		Value:   []int{min, max},
		Message: message,
		Test: func(val interface{}) bool {
			if numbers, ok := val.([]int); ok && len(numbers) == 2 {
				return numbers[0] <= numbers[1]
			}
			return false
		},
	})
	return v
}

// Validate führt alle Validierungsregeln aus
func (v *Validator) Validate() ValidationResult {
	result := ValidationResult{
		IsValid: true,
		Errors:  make([]string, 0),
	}

	for _, rule := range v.rules {
		if !rule.Test(rule.Value) {
			result.IsValid = false
			result.Errors = append(result.Errors, rule.Message)
		}
	}

	return result
}

// ValidateAndRespond führt Validierung aus und gibt JSON-Antwort zurück
func (v *Validator) ValidateAndRespond(c echo.Context) error {
	result := v.Validate()
	if !result.IsValid {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": result.Errors[0], // Erste Fehlermeldung
		})
	}
	return nil
}

// Helper-Funktionen für häufige Validierungen

// ValidateRequiredFields validiert mehrere Pflichtfelder auf einmal
func ValidateRequiredFields(c echo.Context, fields map[string]interface{}) error {
	validator := NewValidator()

	for field, value := range fields {
		validator.Required(field, value, field+" ist ein Pflichtfeld")
	}

	return validator.ValidateAndRespond(c)
}

// ValidateTimeRange validiert einen Zeitbereich
func ValidateTimeRange(c echo.Context, startField, endField string, startTime, endTime time.Time) error {
	validator := NewValidator()
	validator.TimeRange(startField, endField, startTime, endTime, startField+" muss vor "+endField+" liegen")

	return validator.ValidateAndRespond(c)
}

// ValidateNumberRange validiert einen Zahlenbereich
func ValidateNumberRange(c echo.Context, minField, maxField string, min, max int) error {
	validator := NewValidator()
	validator.NumberRange(minField, maxField, min, max, minField+" darf nicht größer als "+maxField+" sein")

	return validator.ValidateAndRespond(c)
}
