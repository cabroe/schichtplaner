package utils

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetPaginationParams(t *testing.T) {
	// Test 1: Standard-Parameter
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	params := GetPaginationParams(c)
	assert.Equal(t, 1, params.Page)
	assert.Equal(t, 10, params.PageSize)
	assert.Equal(t, 0, params.Offset)

	// Test 2: Benutzerdefinierte Parameter
	req = httptest.NewRequest(http.MethodGet, "/api/users?page=3&page_size=20", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 3, params.Page)
	assert.Equal(t, 20, params.PageSize)
	assert.Equal(t, 40, params.Offset)

	// Test 3: Ungültige Parameter
	req = httptest.NewRequest(http.MethodGet, "/api/users?page=0&page_size=0", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 1, params.Page)
	assert.Equal(t, 10, params.PageSize)
	assert.Equal(t, 0, params.Offset)

	// Test 4: Zu große page_size
	req = httptest.NewRequest(http.MethodGet, "/api/users?page_size=150", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 100, params.PageSize)
}

func TestCreatePaginatedResponse(t *testing.T) {
	// Test-Daten
	data := []string{"item1", "item2", "item3"}
	total := 25
	params := PaginationParams{
		Page:     2,
		PageSize: 10,
		Offset:   10,
	}

	response := CreatePaginatedResponse(data, total, params)

	assert.Equal(t, data, response.Data)
	assert.Equal(t, 2, response.Pagination.Page)
	assert.Equal(t, 10, response.Pagination.PageSize)
	assert.Equal(t, 25, response.Pagination.Total)
	assert.Equal(t, 3, response.Pagination.TotalPages) // 25 items / 10 per page = 3 pages
}
