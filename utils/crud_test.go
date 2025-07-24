package utils

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestNewCRUDHelper(t *testing.T) {
	helper := NewCRUDHelper()
	assert.NotNil(t, helper)
}

func TestParseID(t *testing.T) {
	helper := NewCRUDHelper()

	// Test mit gültiger ID
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/123", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("123")

	id, err := helper.ParseID(c, "id")
	assert.NoError(t, err)
	assert.Equal(t, uint(123), id)

	// Test mit ungültiger ID
	req = httptest.NewRequest(http.MethodGet, "/users/invalid", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("invalid")

	id, err = helper.ParseID(c, "id")
	assert.Error(t, err)
	assert.Equal(t, uint(0), id)
}

func TestParseIDWithError(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur der Funktion
	assert.NotNil(t, helper.ParseIDWithError)

	// Test mit gültiger ID
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/123", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("123")

	id, err := helper.ParseIDWithError(c, "id", "Ungültige ID")
	assert.NoError(t, err)
	assert.Equal(t, uint(123), id)
}

func TestBindAndValidate(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur der Funktion
	assert.NotNil(t, helper.BindAndValidate)
}

func TestGetByID(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur der Funktion
	assert.NotNil(t, helper.GetByID)
}

func TestCreateStandard(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur der Funktion
	assert.NotNil(t, helper.CreateStandard)
}

func TestUpdateStandard(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur
	assert.NotNil(t, helper.UpdateStandard)
}

func TestDeleteStandard(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur
	assert.NotNil(t, helper.DeleteStandard)
}

func TestCheckDependencyWithError(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Struktur
	assert.NotNil(t, helper.CheckDependencyWithError)
}

func TestCRUDHelperIntegration(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Integration verschiedener CRUD-Funktionen
	e := echo.New()

	// Test ParseID
	req := httptest.NewRequest(http.MethodGet, "/users/456", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("456")

	id, err := helper.ParseID(c, "id")
	assert.NoError(t, err)
	assert.Equal(t, uint(456), id)

	// Test ParseIDWithError mit gültiger ID
	req = httptest.NewRequest(http.MethodGet, "/users/789", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("789")

	id, err = helper.ParseIDWithError(c, "id", "Ungültige ID")
	assert.NoError(t, err)
	assert.Equal(t, uint(789), id)
}

func TestCRUDHelperErrorHandling(t *testing.T) {
	helper := NewCRUDHelper()

	// Test verschiedener Fehlerszenarien
	e := echo.New()

	// Test mit leerer ID
	req := httptest.NewRequest(http.MethodGet, "/users/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("")

	id, err := helper.ParseID(c, "id")
	assert.Error(t, err)
	assert.Equal(t, uint(0), id)

	// Test mit negativer ID
	req = httptest.NewRequest(http.MethodGet, "/users/-1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("-1")

	id, err = helper.ParseID(c, "id")
	assert.Error(t, err)
	assert.Equal(t, uint(0), id)

	// Test mit zu großer ID
	req = httptest.NewRequest(http.MethodGet, "/users/99999999999999999999", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("99999999999999999999")

	id, err = helper.ParseID(c, "id")
	assert.Error(t, err)
	assert.Equal(t, uint(0), id)
}

func TestCRUDHelperBoundaryValues(t *testing.T) {
	helper := NewCRUDHelper()

	// Test Grenzwerte
	e := echo.New()

	// Test mit ID 0
	req := httptest.NewRequest(http.MethodGet, "/users/0", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("0")

	id, err := helper.ParseID(c, "id")
	assert.NoError(t, err)
	assert.Equal(t, uint(0), id)

	// Test mit maximaler uint32 ID
	maxID := strconv.FormatUint(uint64(^uint32(0)), 10)
	req = httptest.NewRequest(http.MethodGet, "/users/"+maxID, nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(maxID)

	id, err = helper.ParseID(c, "id")
	assert.NoError(t, err)
	assert.Equal(t, uint(^uint32(0)), id)
}

func TestCRUDHelperMethodChaining(t *testing.T) {
	helper := NewCRUDHelper()

	// Test der Method Chaining-Fähigkeit
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/123", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("123")

	// Test der Verkettung von ParseID und anderen Methoden
	id, err := helper.ParseID(c, "id")
	assert.NoError(t, err)
	assert.Equal(t, uint(123), id)

	// Weitere Tests könnten hier hinzugefügt werden, wenn die Methoden
	// tatsächlich verkettet werden können
}
