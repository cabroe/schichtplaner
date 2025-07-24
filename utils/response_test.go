package utils

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestNewResponseHelper(t *testing.T) {
	helper := NewResponseHelper()
	assert.NotNil(t, helper)
}

func TestSuccessResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	data := map[string]string{"message": "success"}
	err := NewResponseHelper().SuccessResponse(c, http.StatusOK, data)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "success", response["message"])
}

func TestCreatedResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	data := map[string]string{"id": "123"}
	err := NewResponseHelper().CreatedResponse(c, data)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "123", response["id"])
}

func TestOKResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	data := map[string]string{"status": "ok"}
	err := NewResponseHelper().OKResponse(c, data)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "ok", response["status"])
}

func TestErrorResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().ErrorResponse(c, http.StatusBadRequest, "Invalid data")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Invalid data", response["error"])
}

func TestBadRequestResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().BadRequestResponse(c, "Bad request")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Bad request", response["error"])
}

func TestNotFoundResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().NotFoundResponse(c, "Not found")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Not found", response["error"])
}

func TestInternalServerErrorResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().InternalServerErrorResponse(c, "Internal error")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusInternalServerError, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Internal error", response["error"])
}

func TestValidationErrorResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().ValidationErrorResponse(c, "Name", "Name ist ein Pflichtfeld")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Name ist ein Pflichtfeld", response["error"])
}

func TestDatabaseErrorResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	dbError := assert.AnError
	err := NewResponseHelper().DatabaseErrorResponse(c, "Laden der Daten", dbError)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusInternalServerError, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response["error"], "Fehler bei Laden der Daten")
}

func TestMessageResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().MessageResponse(c, "Success message")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Success message", response["message"])
}

func TestDeletedResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().DeletedResponse(c, "User")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "User erfolgreich gelöscht", response["message"])
}

func TestUpdatedResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().UpdatedResponse(c, "User")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "User erfolgreich aktualisiert", response["message"])
}

func TestCreatedMessageResponse(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := NewResponseHelper().CreatedMessageResponse(c, "User")

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "User erfolgreich erstellt", response["message"])
}

func TestResponseWithComplexData(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	type User struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	user := User{ID: 1, Name: "Test User"}
	err := NewResponseHelper().OKResponse(c, user)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response User
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), response.ID)
	assert.Equal(t, "Test User", response.Name)
}

func TestResponseWithArray(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	users := []string{"User1", "User2", "User3"}
	err := NewResponseHelper().OKResponse(c, users)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response []string
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response, 3)
	assert.Equal(t, "User1", response[0])
	assert.Equal(t, "User2", response[1])
	assert.Equal(t, "User3", response[2])
}

func TestStandardErrorResponses(t *testing.T) {
	assert.Equal(t, "Ungültige ID", StandardErrorResponses.InvalidID)
	assert.Equal(t, "Datensatz nicht gefunden", StandardErrorResponses.NotFound)
	assert.Equal(t, "Ungültige Daten", StandardErrorResponses.InvalidData)
	assert.Equal(t, "Datenbankfehler", StandardErrorResponses.DatabaseError)
	assert.Equal(t, "Validierungsfehler", StandardErrorResponses.ValidationError)
}

func TestStandardSuccessResponses(t *testing.T) {
	assert.Equal(t, "erfolgreich erstellt", StandardSuccessResponses.Created)
	assert.Equal(t, "erfolgreich aktualisiert", StandardSuccessResponses.Updated)
	assert.Equal(t, "erfolgreich gelöscht", StandardSuccessResponses.Deleted)
}
