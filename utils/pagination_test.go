package utils

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetPaginationParams(t *testing.T) {
	e := echo.New()

	// Test mit Standard-Parametern
	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	params := GetPaginationParams(c)
	assert.Equal(t, 1, params.Page)
	assert.Equal(t, 10, params.PageSize)
	assert.Equal(t, 0, params.Offset)

	// Test mit benutzerdefinierten Parametern
	req = httptest.NewRequest(http.MethodGet, "/users?page=3&page_size=20", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 3, params.Page)
	assert.Equal(t, 20, params.PageSize)
	assert.Equal(t, 40, params.Offset) // (3-1) * 20

	// Test mit ungültigen Parametern (sollte auf Standardwerte zurückfallen)
	req = httptest.NewRequest(http.MethodGet, "/users?page=invalid&page_size=invalid", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 1, params.Page)
	assert.Equal(t, 10, params.PageSize)
	assert.Equal(t, 0, params.Offset)

	// Test mit negativen Parametern
	req = httptest.NewRequest(http.MethodGet, "/users?page=-1&page_size=-5", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 1, params.Page)
	assert.Equal(t, 10, params.PageSize)
	assert.Equal(t, 0, params.Offset)

	// Test mit sehr großen Parametern
	req = httptest.NewRequest(http.MethodGet, "/users?page=999999&page_size=999999", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 999999, params.Page)
	assert.Equal(t, 100, params.PageSize)    // Max PageSize ist 100
	assert.Equal(t, 99999800, params.Offset) // (999999-1) * 100
}

func TestCreatePaginatedResponse(t *testing.T) {
	// Test mit leeren Daten
	data := []string{}
	total := 0
	params := PaginationParams{Page: 1, PageSize: 10, Offset: 0}

	response := CreatePaginatedResponse(data, total, params)
	assert.Equal(t, data, response.Data)
	assert.Equal(t, total, response.Pagination.Total)
	assert.Equal(t, params.Page, response.Pagination.Page)
	assert.Equal(t, params.PageSize, response.Pagination.PageSize)
	assert.Equal(t, 0, response.Pagination.TotalPages)

	// Test mit Daten
	data = []string{"item1", "item2", "item3"}
	total = 25
	params = PaginationParams{Page: 2, PageSize: 10, Offset: 10}

	response = CreatePaginatedResponse(data, total, params)
	assert.Equal(t, data, response.Data)
	assert.Equal(t, total, response.Pagination.Total)
	assert.Equal(t, params.Page, response.Pagination.Page)
	assert.Equal(t, params.PageSize, response.Pagination.PageSize)
	assert.Equal(t, 3, response.Pagination.TotalPages) // ceil(25/10) = 3

	// Test mit letzter Seite
	params = PaginationParams{Page: 3, PageSize: 10, Offset: 20}

	response = CreatePaginatedResponse(data, total, params)
	assert.Equal(t, 3, response.Pagination.TotalPages)

	// Test mit erster Seite
	params = PaginationParams{Page: 1, PageSize: 10, Offset: 0}

	response = CreatePaginatedResponse(data, total, params)
	assert.Equal(t, 3, response.Pagination.TotalPages)

	// Test mit exakter Teilung
	data = []string{"item1", "item2", "item3", "item4", "item5"}
	total = 10
	params = PaginationParams{Page: 1, PageSize: 5, Offset: 0}

	response = CreatePaginatedResponse(data, total, params)
	assert.Equal(t, 2, response.Pagination.TotalPages) // 10/5 = 2
}

func TestPaginationEdgeCases(t *testing.T) {
	e := echo.New()

	// Test mit sehr großen Seitenzahlen
	req := httptest.NewRequest(http.MethodGet, "/users?page=1000000&page_size=50", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	params := GetPaginationParams(c)
	assert.Equal(t, 1000000, params.Page)
	assert.Equal(t, 50, params.PageSize)
	assert.Equal(t, 49999950, params.Offset) // (1000000-1) * 50

	// Test mit maximaler PageSize
	req = httptest.NewRequest(http.MethodGet, "/users?page_size=100", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 100, params.PageSize)

	// Test mit PageSize über Maximum
	req = httptest.NewRequest(http.MethodGet, "/users?page_size=150", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 100, params.PageSize) // Sollte auf Maximum begrenzt werden

	// Test mit PageSize unter Minimum
	req = httptest.NewRequest(http.MethodGet, "/users?page_size=0", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	params = GetPaginationParams(c)
	assert.Equal(t, 10, params.PageSize) // Sollte auf Minimum gesetzt werden
}

func TestPaginationResponseStructure(t *testing.T) {
	// Test der Struktur der PaginatedResponse
	data := []map[string]interface{}{
		{"id": 1, "name": "User 1"},
		{"id": 2, "name": "User 2"},
	}
	total := 50
	params := PaginationParams{Page: 2, PageSize: 10, Offset: 10}

	response := CreatePaginatedResponse(data, total, params)

	// Test aller Felder
	assert.Equal(t, data, response.Data)
	assert.Equal(t, total, response.Pagination.Total)
	assert.Equal(t, params.Page, response.Pagination.Page)
	assert.Equal(t, params.PageSize, response.Pagination.PageSize)
	assert.Equal(t, 5, response.Pagination.TotalPages) // ceil(50/10) = 5
}

func TestPaginationWithComplexData(t *testing.T) {
	// Test mit komplexen Datenstrukturen
	type User struct {
		ID    uint   `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	users := []User{
		{ID: 1, Name: "User 1", Email: "user1@example.com"},
		{ID: 2, Name: "User 2", Email: "user2@example.com"},
		{ID: 3, Name: "User 3", Email: "user3@example.com"},
	}

	total := 15
	params := PaginationParams{Page: 1, PageSize: 3, Offset: 0}

	response := CreatePaginatedResponse(users, total, params)

	assert.Len(t, response.Data, 3)
	assert.Equal(t, 15, response.Pagination.Total)
	assert.Equal(t, 5, response.Pagination.TotalPages) // ceil(15/3) = 5
}

func TestPaginationBoundaryConditions(t *testing.T) {
	// Test mit genau einer Seite
	data := []string{"item1", "item2"}
	total := 2
	params := PaginationParams{Page: 1, PageSize: 10, Offset: 0}

	response := CreatePaginatedResponse(data, total, params)
	assert.Equal(t, 1, response.Pagination.TotalPages)

	// Test mit leerem Total aber Daten
	data = []string{"item1"}
	total = 0
	params = PaginationParams{Page: 1, PageSize: 10, Offset: 0}

	response = CreatePaginatedResponse(data, total, params)
	assert.Equal(t, 0, response.Pagination.TotalPages)

	// Test mit sehr kleinem Total
	data = []string{"item1"}
	total = 1
	params = PaginationParams{Page: 1, PageSize: 10, Offset: 0}

	response = CreatePaginatedResponse(data, total, params)
	assert.Equal(t, 1, response.Pagination.TotalPages)
}
