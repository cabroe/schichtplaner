package utils

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// ParseIDParam safely parses an ID parameter from the URL
func ParseIDParam(c echo.Context, paramName string) (uint, error) {
	idStr := c.Param(paramName)
	if idStr == "" {
		return 0, fmt.Errorf("missing %s parameter", paramName)
	}

	// Parse as uint64 first
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid %s format", paramName)
	}

	// Check if it fits in uint32 (assuming we're using uint which is typically 32-bit)
	if id64 > 4294967295 { // 2^32 - 1
		return 0, fmt.Errorf("%s value too large", paramName)
	}

	// Check if it's a valid positive ID
	if id64 == 0 {
		return 0, fmt.Errorf("invalid %s value: must be greater than 0", paramName)
	}

	return uint(id64), nil
}

// ParseIDParamWithResponse safely parses an ID parameter and returns JSON error if invalid
func ParseIDParamWithResponse(c echo.Context, paramName string) (uint, error) {
	id, err := ParseIDParam(c, paramName)
	if err != nil {
		return 0, c.JSON(http.StatusBadRequest, map[string]string{
			"error": fmt.Sprintf("Ungültige %s: %s", paramName, err.Error()),
		})
	}
	return id, nil
}

// ParseOptionalUintParam safely parses an optional uint parameter from query params
func ParseOptionalUintParam(c echo.Context, paramName string, defaultValue uint) uint {
	paramStr := c.QueryParam(paramName)
	if paramStr == "" {
		return defaultValue
	}

	value, err := strconv.ParseUint(paramStr, 10, 32)
	if err != nil || value == 0 {
		return defaultValue
	}

	return uint(value)
}