package utils

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// ResponseHelper bietet Hilfsfunktionen für HTTP-Responses
type ResponseHelper struct{}

// NewResponseHelper erstellt einen neuen ResponseHelper
func NewResponseHelper() *ResponseHelper {
	return &ResponseHelper{}
}

// SuccessResponse gibt eine erfolgreiche JSON-Antwort zurück
func (h *ResponseHelper) SuccessResponse(c echo.Context, statusCode int, data interface{}) error {
	return c.JSON(statusCode, data)
}

// CreatedResponse gibt eine 201 Created-Antwort zurück
func (h *ResponseHelper) CreatedResponse(c echo.Context, data interface{}) error {
	return h.SuccessResponse(c, http.StatusCreated, data)
}

// OKResponse gibt eine 200 OK-Antwort zurück
func (h *ResponseHelper) OKResponse(c echo.Context, data interface{}) error {
	return h.SuccessResponse(c, http.StatusOK, data)
}

// ErrorResponse gibt eine Fehler-JSON-Antwort zurück
func (h *ResponseHelper) ErrorResponse(c echo.Context, statusCode int, message string) error {
	return c.JSON(statusCode, map[string]string{
		"error": message,
	})
}

// BadRequestResponse gibt eine 400 Bad Request-Antwort zurück
func (h *ResponseHelper) BadRequestResponse(c echo.Context, message string) error {
	return h.ErrorResponse(c, http.StatusBadRequest, message)
}

// NotFoundResponse gibt eine 404 Not Found-Antwort zurück
func (h *ResponseHelper) NotFoundResponse(c echo.Context, message string) error {
	return h.ErrorResponse(c, http.StatusNotFound, message)
}

// InternalServerErrorResponse gibt eine 500 Internal Server Error-Antwort zurück
func (h *ResponseHelper) InternalServerErrorResponse(c echo.Context, message string) error {
	return h.ErrorResponse(c, http.StatusInternalServerError, message)
}

// ValidationErrorResponse gibt eine Validierungsfehler-Antwort zurück
func (h *ResponseHelper) ValidationErrorResponse(c echo.Context, field, message string) error {
	return h.BadRequestResponse(c, field+" ist ein Pflichtfeld")
}

// DatabaseErrorResponse gibt eine Datenbankfehler-Antwort zurück
func (h *ResponseHelper) DatabaseErrorResponse(c echo.Context, operation string, err error) error {
	c.Logger().Errorf("Fehler bei %s: %v", operation, err)
	return h.InternalServerErrorResponse(c, "Fehler bei "+operation+": "+err.Error())
}

// MessageResponse gibt eine Nachrichten-Antwort zurück
func (h *ResponseHelper) MessageResponse(c echo.Context, message string) error {
	return h.OKResponse(c, map[string]string{
		"message": message,
	})
}

// DeletedResponse gibt eine erfolgreiche Lösch-Antwort zurück
func (h *ResponseHelper) DeletedResponse(c echo.Context, entityName string) error {
	return h.MessageResponse(c, entityName+" erfolgreich gelöscht")
}

// UpdatedResponse gibt eine erfolgreiche Update-Antwort zurück
func (h *ResponseHelper) UpdatedResponse(c echo.Context, entityName string) error {
	return h.MessageResponse(c, entityName+" erfolgreich aktualisiert")
}

// CreatedMessageResponse gibt eine erfolgreiche Erstellungs-Antwort zurück
func (h *ResponseHelper) CreatedMessageResponse(c echo.Context, entityName string) error {
	return h.MessageResponse(c, entityName+" erfolgreich erstellt")
}

// Standard-Response-Funktionen für häufige Fälle

// StandardErrorResponses bietet Standard-Fehlermeldungen
var StandardErrorResponses = struct {
	InvalidID       string
	NotFound        string
	InvalidData     string
	DatabaseError   string
	ValidationError string
}{
	InvalidID:       "Ungültige ID",
	NotFound:        "Datensatz nicht gefunden",
	InvalidData:     "Ungültige Daten",
	DatabaseError:   "Datenbankfehler",
	ValidationError: "Validierungsfehler",
}

// StandardSuccessResponses bietet Standard-Erfolgsmeldungen
var StandardSuccessResponses = struct {
	Created string
	Updated string
	Deleted string
}{
	Created: "erfolgreich erstellt",
	Updated: "erfolgreich aktualisiert",
	Deleted: "erfolgreich gelöscht",
}
