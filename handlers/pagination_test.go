package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEmployeePagination(t *testing.T) {
	// Setup
	models.ResetStores()
	e := echo.New()

	// Create test employees
	for i := 1; i <= 25; i++ {
		models.CreateEmployee(&models.EmployeeCreateRequest{
			Name:     fmt.Sprintf("Employee %d", i),
			Email:    fmt.Sprintf("employee%d@test.com", i),
			Position: "Developer",
		})
	}

	t.Run("returns paginated employees", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/employees?limit=10&offset=0", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getEmployees(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.PaginatedResponse
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		require.NoError(t, err)

		assert.Equal(t, 25, response.Total)
		assert.Equal(t, 10, response.Limit)
		assert.Equal(t, 0, response.Offset)
		assert.True(t, response.HasMore)
		assert.Equal(t, 3, response.TotalPages)

		// Check that we got the right amount of data
		dataBytes, _ := json.Marshal(response.Data)
		var employees []*models.Employee
		json.Unmarshal(dataBytes, &employees)
		assert.Len(t, employees, 10)
	})

	t.Run("returns second page", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/employees?limit=10&offset=10", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getEmployees(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.PaginatedResponse
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		require.NoError(t, err)

		assert.Equal(t, 25, response.Total)
		assert.Equal(t, 10, response.Limit)
		assert.Equal(t, 10, response.Offset)
		assert.True(t, response.HasMore)

		dataBytes, _ := json.Marshal(response.Data)
		var employees []*models.Employee
		json.Unmarshal(dataBytes, &employees)
		assert.Len(t, employees, 10)
	})

	t.Run("returns last page", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/employees?limit=10&offset=20", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getEmployees(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.PaginatedResponse
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		require.NoError(t, err)

		assert.Equal(t, 25, response.Total)
		assert.Equal(t, 10, response.Limit)
		assert.Equal(t, 20, response.Offset)
		assert.False(t, response.HasMore)

		dataBytes, _ := json.Marshal(response.Data)
		var employees []*models.Employee
		json.Unmarshal(dataBytes, &employees)
		assert.Len(t, employees, 5)
	})

	t.Run("returns all employees without pagination params", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/employees", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getEmployees(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var employees []*models.Employee
		err = json.Unmarshal(rec.Body.Bytes(), &employees)
		require.NoError(t, err)

		assert.Len(t, employees, 25)
	})
}

func TestShiftPagination(t *testing.T) {
	// Setup
	models.ResetStores()
	e := echo.New()

	// Create test employee
	employee := models.CreateEmployee(&models.EmployeeCreateRequest{
		Name:     "Test Employee",
		Email:    "test@test.com",
		Position: "Developer",
	})

	// Create test shifts
	for i := 1; i <= 15; i++ {
		models.CreateShift(&models.ShiftCreateRequest{
			EmployeeID: employee.ID,
			StartTime:  "2024-01-01T08:00:00Z",
			EndTime:    "2024-01-01T16:00:00Z",
			Position:   "Developer",
			Notes:      fmt.Sprintf("Shift %d", i),
		})
	}

	t.Run("returns paginated shifts", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/shifts?limit=5&offset=0", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getShifts(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.PaginatedResponse
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		require.NoError(t, err)

		assert.Equal(t, 15, response.Total)
		assert.Equal(t, 5, response.Limit)
		assert.Equal(t, 0, response.Offset)
		assert.True(t, response.HasMore)
		assert.Equal(t, 3, response.TotalPages)

		dataBytes, _ := json.Marshal(response.Data)
		var shifts []*models.Shift
		json.Unmarshal(dataBytes, &shifts)
		assert.Len(t, shifts, 5)
	})

	t.Run("handles out of range offset", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/shifts?limit=5&offset=100", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getShifts(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.PaginatedResponse
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		require.NoError(t, err)

		assert.Equal(t, 15, response.Total)
		assert.Equal(t, 5, response.Limit)
		assert.Equal(t, 100, response.Offset)
		assert.False(t, response.HasMore)

		dataBytes, _ := json.Marshal(response.Data)
		var shifts []*models.Shift
		json.Unmarshal(dataBytes, &shifts)
		assert.Len(t, shifts, 0)
	})

	t.Run("uses default values for invalid params", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/shifts?limit=invalid&offset=invalid", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getShifts(c)
		require.NoError(t, err)

		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.PaginatedResponse
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		require.NoError(t, err)

		assert.Equal(t, 15, response.Total)
		assert.Equal(t, 10, response.Limit)
		assert.Equal(t, 0, response.Offset)
		assert.True(t, response.HasMore)

		dataBytes, _ := json.Marshal(response.Data)
		var shifts []*models.Shift
		json.Unmarshal(dataBytes, &shifts)
		assert.Len(t, shifts, 10)
	})
}
