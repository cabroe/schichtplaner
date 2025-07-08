package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"schichtplaner/models"

	"github.com/stretchr/testify/assert"
)

func TestCRUDEmployees(t *testing.T) {
	CleanupTestData() // Clean up before test
	e := SetupTestEcho()

	// Test creating an employee
	employeeJSON := `{"name":"John Doe","email":"john@example.com","position":"Developer"}`
	req := httptest.NewRequest(http.MethodPost, "/employees", strings.NewReader(employeeJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := createEmployee(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var createdEmployee models.Employee
	json.Unmarshal(rec.Body.Bytes(), &createdEmployee)
	assert.Equal(t, "John Doe", createdEmployee.Name)
	assert.Equal(t, "john@example.com", createdEmployee.Email)
	assert.Equal(t, "Developer", createdEmployee.Position)
	assert.Equal(t, 1, createdEmployee.ID)

	// Test getting all employees
	req = httptest.NewRequest(http.MethodGet, "/employees", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = getEmployees(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var employees []*models.Employee
	json.Unmarshal(rec.Body.Bytes(), &employees)
	assert.Equal(t, 1, len(employees))
	assert.Equal(t, "John Doe", employees[0].Name)

	// Test getting specific employee
	req = httptest.NewRequest(http.MethodGet, "/employees/1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = getEmployee(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var employee models.Employee
	json.Unmarshal(rec.Body.Bytes(), &employee)
	assert.Equal(t, "John Doe", employee.Name)
	assert.Equal(t, 1, employee.ID)

	// Test updating employee
	updateJSON := `{"name":"Jane Doe","position":"Senior Developer"}`
	req = httptest.NewRequest(http.MethodPut, "/employees/1", strings.NewReader(updateJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = updateEmployee(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var updatedEmployee models.Employee
	json.Unmarshal(rec.Body.Bytes(), &updatedEmployee)
	assert.Equal(t, "Jane Doe", updatedEmployee.Name)
	assert.Equal(t, "Senior Developer", updatedEmployee.Position)
	assert.Equal(t, "john@example.com", updatedEmployee.Email) // Should remain unchanged

	// Test deleting employee
	req = httptest.NewRequest(http.MethodDelete, "/employees/1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = deleteEmployee(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNoContent, rec.Code)

	// Verify employee is deleted
	req = httptest.NewRequest(http.MethodGet, "/employees/1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = getEmployee(c)
	assert.Error(t, err)
}

func TestEmployeeValidation(t *testing.T) {
	e := SetupTestEcho()

	// Test creating employee with invalid email
	employeeJSON := `{"name":"John Doe","email":"invalid-email","position":"Developer"}`
	req := httptest.NewRequest(http.MethodPost, "/employees", strings.NewReader(employeeJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := createEmployee(c)
	assert.Error(t, err)

	// Test creating employee without required fields
	employeeJSON = `{"position":"Developer"}`
	req = httptest.NewRequest(http.MethodPost, "/employees", strings.NewReader(employeeJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = createEmployee(c)
	assert.Error(t, err)
}
