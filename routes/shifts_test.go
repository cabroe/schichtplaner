package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestRegisterShiftRoutes(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Test-Daten erstellen
	testUser := models.User{
		Username:  "testuser",
		Email:     "test@example.com",
		FirstName: "Test",
		LastName:  "User",
		IsActive:  true,
		Role:      "user",
	}
	err := database.DB.Create(&testUser).Error
	assert.NoError(t, err)

	testSchedule := models.Schedule{
		Name:        "Test Schedule",
		Description: "Test Schedule Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().AddDate(0, 1, 0),
		IsActive:    true,
	}
	err = database.DB.Create(&testSchedule).Error
	assert.NoError(t, err)

	testShift := models.Shift{
		UserID:      testUser.ID,
		ScheduleID:  testSchedule.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Test Shift",
		IsActive:    true,
	}
	err = database.DB.Create(&testShift).Error
	assert.NoError(t, err)

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Shift-Routen registrieren
	RegisterShiftRoutes(api)

	// Test-Fälle für alle registrierten Routen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/shifts sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/shifts",
			expected: http.StatusOK,
		},
		{
			name:     "GET /api/shifts/:id sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/shifts/1",
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/shifts sollte registriert sein",
			method:   http.MethodPost,
			path:     "/api/shifts",
			expected: http.StatusOK,
		},
		{
			name:     "PUT /api/shifts/:id sollte registriert sein",
			method:   http.MethodPut,
			path:     "/api/shifts/1",
			expected: http.StatusOK,
		},
		{
			name:     "DELETE /api/shifts/:id sollte registriert sein",
			method:   http.MethodDelete,
			path:     "/api/shifts/1",
			expected: http.StatusOK,
		},
		{
			name:     "GET /api/users/:user_id/shifts sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/users/1/shifts",
			expected: http.StatusOK,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Request erstellen
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()

			// Request durch Echo verarbeiten
			e.ServeHTTP(rec, req)

			// Prüfen, dass die Route existiert (nicht 404)
			assert.NotEqual(t, http.StatusNotFound, rec.Code,
				"Route %s %s sollte registriert sein", tc.method, tc.path)
		})
	}
}

func TestRegisterShiftRoutes_InvalidRoutes(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Shift-Routen registrieren
	RegisterShiftRoutes(api)

	// Test-Fälle für nicht registrierte Routen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/shifts/invalid sollte 400 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/shifts/invalid",
			expected: http.StatusBadRequest,
		},
		{
			name:     "POST /api/shifts/invalid sollte 405 zurückgeben",
			method:   http.MethodPost,
			path:     "/api/shifts/invalid",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "GET /api/invalid sollte 404 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/invalid",
			expected: http.StatusNotFound,
		},
		{
			name:     "GET /api/users/invalid/shifts sollte 400 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/users/invalid/shifts",
			expected: http.StatusBadRequest,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Request erstellen
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()

			// Request durch Echo verarbeiten
			e.ServeHTTP(rec, req)

			// Prüfen, dass die Route nicht existiert (404)
			assert.Equal(t, tc.expected, rec.Code,
				"Route %s %s sollte %d zurückgeben", tc.method, tc.path, tc.expected)
		})
	}
}

func TestRegisterShiftRoutes_RouteMethods(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Shift-Routen registrieren
	RegisterShiftRoutes(api)

	// Test-Fälle für verschiedene HTTP-Methoden auf derselben Route
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/shifts sollte funktionieren",
			method:   http.MethodGet,
			path:     "/api/shifts",
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/shifts sollte funktionieren",
			method:   http.MethodPost,
			path:     "/api/shifts",
			expected: http.StatusOK,
		},
		{
			name:     "PUT /api/shifts sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodPut,
			path:     "/api/shifts",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "DELETE /api/shifts sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodDelete,
			path:     "/api/shifts",
			expected: http.StatusMethodNotAllowed,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Request erstellen
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()

			// Request durch Echo verarbeiten
			e.ServeHTTP(rec, req)

			// Prüfen, dass die Route mit der richtigen Methode existiert
			if tc.expected == http.StatusOK {
				assert.NotEqual(t, http.StatusNotFound, rec.Code,
					"Route %s %s sollte registriert sein", tc.method, tc.path)
			} else {
				assert.Equal(t, tc.expected, rec.Code,
					"Route %s %s sollte %d zurückgeben", tc.method, tc.path, tc.expected)
			}
		})
	}
}

func TestRegisterShiftRoutes_APIGroup(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Shift-Routen registrieren
	RegisterShiftRoutes(api)

	// Prüfen, dass die Routen im korrekten API-Gruppenpfad registriert sind
	testCases := []struct {
		name     string
		method   string
		path     string
		expected bool
	}{
		{
			name:     "Route sollte im /api Pfad registriert sein",
			method:   http.MethodGet,
			path:     "/api/shifts",
			expected: true,
		},
		{
			name:     "Route ohne /api Pfad sollte nicht funktionieren",
			method:   http.MethodGet,
			path:     "/shifts",
			expected: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Request erstellen
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()

			// Request durch Echo verarbeiten
			e.ServeHTTP(rec, req)

			// Prüfen, dass die Route korrekt registriert ist
			if tc.expected {
				assert.NotEqual(t, http.StatusNotFound, rec.Code,
					"Route %s %s sollte registriert sein", tc.method, tc.path)
			} else {
				assert.Equal(t, http.StatusNotFound, rec.Code,
					"Route %s %s sollte nicht registriert sein", tc.method, tc.path)
			}
		})
	}
}

func TestRegisterShiftRoutes_NotFoundBehavior(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Shift-Routen registrieren
	RegisterShiftRoutes(api)

	// Test-Fälle für 404-Verhalten bei nicht existierenden Ressourcen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET nicht existierender Shift sollte 404 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/shifts/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "PUT nicht existierender Shift sollte 404 zurückgeben",
			method:   http.MethodPut,
			path:     "/api/shifts/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "DELETE nicht existierender Shift sollte 404 zurückgeben",
			method:   http.MethodDelete,
			path:     "/api/shifts/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "GET Shifts für nicht existierenden User sollte 400 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/users/999/shifts",
			expected: http.StatusBadRequest,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Request erstellen
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()

			// Request durch Echo verarbeiten
			e.ServeHTTP(rec, req)

			// Prüfen, dass die Route 404 zurückgibt für nicht existierende Ressourcen
			assert.Equal(t, tc.expected, rec.Code,
				"Route %s %s sollte %d zurückgeben", tc.method, tc.path, tc.expected)
		})
	}
}

func TestRegisterShiftRoutes_UserShiftsRoute(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Test-Daten erstellen
	testUser := models.User{
		Username:  "testuser",
		Email:     "test@example.com",
		FirstName: "Test",
		LastName:  "User",
		IsActive:  true,
		Role:      "user",
	}
	err := database.DB.Create(&testUser).Error
	assert.NoError(t, err)

	testSchedule := models.Schedule{
		Name:        "Test Schedule",
		Description: "Test Schedule Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().AddDate(0, 1, 0),
		IsActive:    true,
	}
	err = database.DB.Create(&testSchedule).Error
	assert.NoError(t, err)

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Shift-Routen registrieren
	RegisterShiftRoutes(api)

	// Test-Fälle für User-Shifts Route
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/users/:user_id/shifts sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/users/1/shifts",
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/users/:user_id/shifts sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodPost,
			path:     "/api/users/1/shifts",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "PUT /api/users/:user_id/shifts sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodPut,
			path:     "/api/users/1/shifts",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "DELETE /api/users/:user_id/shifts sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodDelete,
			path:     "/api/users/1/shifts",
			expected: http.StatusMethodNotAllowed,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Request erstellen
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()

			// Request durch Echo verarbeiten
			e.ServeHTTP(rec, req)

			// Prüfen, dass die Route korrekt registriert ist
			if tc.expected == http.StatusOK {
				assert.NotEqual(t, http.StatusNotFound, rec.Code,
					"Route %s %s sollte registriert sein", tc.method, tc.path)
			} else {
				assert.Equal(t, tc.expected, rec.Code,
					"Route %s %s sollte %d zurückgeben", tc.method, tc.path, tc.expected)
			}
		})
	}
}
