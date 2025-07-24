package utils

import (
	"net/http"
	"strconv"

	"schichtplaner/database"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// CRUDHelper bietet Hilfsfunktionen für CRUD-Operationen
type CRUDHelper struct{}

// NewCRUDHelper erstellt einen neuen CRUDHelper
func NewCRUDHelper() *CRUDHelper {
	return &CRUDHelper{}
}

// ParseID parst eine ID aus den URL-Parametern
func (h *CRUDHelper) ParseID(c echo.Context, paramName string) (uint, error) {
	id, err := strconv.ParseUint(c.Param(paramName), 10, 32)
	if err != nil {
		return 0, err
	}
	return uint(id), nil
}

// ParseIDWithError parst eine ID und gibt einen JSON-Fehler zurück
func (h *CRUDHelper) ParseIDWithError(c echo.Context, paramName, errorMessage string) (uint, error) {
	id, err := h.ParseID(c, paramName)
	if err != nil {
		return 0, c.JSON(http.StatusBadRequest, map[string]string{
			"error": errorMessage,
		})
	}
	return id, nil
}

// FindByID findet einen Datensatz anhand der ID
func (h *CRUDHelper) FindByID(model interface{}, id uint, preloads ...string) error {
	query := database.DB
	for _, preload := range preloads {
		query = query.Preload(preload)
	}
	return query.First(model, id).Error
}

// FindByIDWithError findet einen Datensatz und gibt einen JSON-Fehler zurück
func (h *CRUDHelper) FindByIDWithError(c echo.Context, model interface{}, id uint, notFoundMessage string, preloads ...string) error {
	err := h.FindByID(model, id, preloads...)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": notFoundMessage,
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Datenbankfehler: " + err.Error(),
		})
	}
	return nil
}

// Create erstellt einen neuen Datensatz
func (h *CRUDHelper) Create(model interface{}, errorMessage string) error {
	if err := database.DB.Create(model).Error; err != nil {
		return err
	}
	return nil
}

// CreateWithError erstellt einen Datensatz und gibt einen JSON-Fehler zurück
func (h *CRUDHelper) CreateWithError(c echo.Context, model interface{}, errorMessage string) error {
	err := h.Create(model, errorMessage)
	if err != nil {
		c.Logger().Errorf("%s: %v", errorMessage, err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": errorMessage + ": " + err.Error(),
		})
	}
	return nil
}

// Update aktualisiert einen Datensatz
func (h *CRUDHelper) Update(model interface{}, updateData interface{}, errorMessage string) error {
	if err := database.DB.Model(model).Updates(updateData).Error; err != nil {
		return err
	}
	return nil
}

// UpdateWithError aktualisiert einen Datensatz und gibt einen JSON-Fehler zurück
func (h *CRUDHelper) UpdateWithError(c echo.Context, model interface{}, updateData interface{}, errorMessage string) error {
	err := h.Update(model, updateData, errorMessage)
	if err != nil {
		c.Logger().Errorf("%s: %v", errorMessage, err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": errorMessage + ": " + err.Error(),
		})
	}
	return nil
}

// Delete löscht einen Datensatz
func (h *CRUDHelper) Delete(model interface{}, errorMessage string) error {
	if err := database.DB.Delete(model).Error; err != nil {
		return err
	}
	return nil
}

// DeleteWithError löscht einen Datensatz und gibt einen JSON-Fehler zurück
func (h *CRUDHelper) DeleteWithError(c echo.Context, model interface{}, errorMessage string) error {
	err := h.Delete(model, errorMessage)
	if err != nil {
		c.Logger().Errorf("%s: %v", errorMessage, err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": errorMessage + ": " + err.Error(),
		})
	}
	return nil
}

// CheckDependency prüft, ob eine Abhängigkeit existiert
func (h *CRUDHelper) CheckDependency(model interface{}, condition string, args ...interface{}) (int64, error) {
	var count int64
	err := database.DB.Model(model).Where(condition, args...).Count(&count).Error
	return count, err
}

// CheckDependencyWithError prüft eine Abhängigkeit und gibt einen JSON-Fehler zurück
func (h *CRUDHelper) CheckDependencyWithError(c echo.Context, model interface{}, condition string, errorMessage string, args ...interface{}) (int64, error) {
	count, err := h.CheckDependency(model, condition, args...)
	if err != nil {
		return 0, c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Datenbankfehler: " + err.Error(),
		})
	}
	if count > 0 {
		return count, c.JSON(http.StatusBadRequest, map[string]string{
			"error": errorMessage,
		})
	}
	return count, nil
}

// BindAndValidate bindet und validiert Request-Daten
func (h *CRUDHelper) BindAndValidate(c echo.Context, data interface{}, errorMessage string) error {
	if err := c.Bind(data); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": errorMessage,
		})
	}
	return nil
}

// Standard CRUD-Operationen für häufige Fälle

// GetByID ist eine Standard-GetByID-Operation
func (h *CRUDHelper) GetByID(c echo.Context, model interface{}, paramName, idErrorMessage, notFoundMessage string, preloads ...string) error {
	id, err := h.ParseIDWithError(c, paramName, idErrorMessage)
	if err != nil {
		return err
	}

	return h.FindByIDWithError(c, model, id, notFoundMessage, preloads...)
}

// CreateStandard ist eine Standard-Create-Operation
func (h *CRUDHelper) CreateStandard(c echo.Context, model interface{}, errorMessage string) error {
	return h.CreateWithError(c, model, errorMessage)
}

// UpdateStandard ist eine Standard-Update-Operation
func (h *CRUDHelper) UpdateStandard(c echo.Context, model interface{}, updateData interface{}, errorMessage string) error {
	return h.UpdateWithError(c, model, updateData, errorMessage)
}

// DeleteStandard ist eine Standard-Delete-Operation
func (h *CRUDHelper) DeleteStandard(c echo.Context, model interface{}, errorMessage string) error {
	return h.DeleteWithError(c, model, errorMessage)
}
