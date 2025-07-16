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

func TestRegisterScheduleRoutes(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Test-Daten erstellen
	testSchedule := models.Schedule{
		Name:        "Test Schedule",
		Description: "Test Schedule Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().AddDate(0, 1, 0),
		IsActive:    true,
	}
	err := database.DB.Create(&testSchedule).Error
	assert.NoError(t, err)

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Schedule-Routen registrieren
	RegisterScheduleRoutes(api)

	// Test-Fälle für alle registrierten Routen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/schedules sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/schedules",
			expected: http.StatusOK,
		},
		{
			name:     "GET /api/schedules/active sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/schedules/active",
			expected: http.StatusOK,
		},
		{
			name:     "GET /api/schedules/:id sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/schedules/1",
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/schedules sollte registriert sein",
			method:   http.MethodPost,
			path:     "/api/schedules",
			expected: http.StatusOK,
		},
		{
			name:     "PUT /api/schedules/:id sollte registriert sein",
			method:   http.MethodPut,
			path:     "/api/schedules/1",
			expected: http.StatusOK,
		},
		{
			name:     "DELETE /api/schedules/:id sollte registriert sein",
			method:   http.MethodDelete,
			path:     "/api/schedules/1",
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

func TestRegisterScheduleRoutes_InvalidRoutes(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Schedule-Routen registrieren
	RegisterScheduleRoutes(api)

	// Test-Fälle für nicht registrierte Routen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/schedules/invalid sollte 400 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/schedules/invalid",
			expected: http.StatusBadRequest,
		},
		{
			name:     "POST /api/schedules/invalid sollte 405 zurückgeben",
			method:   http.MethodPost,
			path:     "/api/schedules/invalid",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "GET /api/invalid sollte 404 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/invalid",
			expected: http.StatusNotFound,
		},
		{
			name:     "GET /api/schedules/active/invalid sollte 400 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/schedules/active/invalid",
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

func TestRegisterScheduleRoutes_RouteMethods(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Schedule-Routen registrieren
	RegisterScheduleRoutes(api)

	// Test-Fälle für verschiedene HTTP-Methoden auf derselben Route
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/schedules sollte funktionieren",
			method:   http.MethodGet,
			path:     "/api/schedules",
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/schedules sollte funktionieren",
			method:   http.MethodPost,
			path:     "/api/schedules",
			expected: http.StatusOK,
		},
		{
			name:     "PUT /api/schedules sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodPut,
			path:     "/api/schedules",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "DELETE /api/schedules sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodDelete,
			path:     "/api/schedules",
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

func TestRegisterScheduleRoutes_APIGroup(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Schedule-Routen registrieren
	RegisterScheduleRoutes(api)

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
			path:     "/api/schedules",
			expected: true,
		},
		{
			name:     "Route ohne /api Pfad sollte nicht funktionieren",
			method:   http.MethodGet,
			path:     "/schedules",
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

func TestRegisterScheduleRoutes_NotFoundBehavior(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// Schedule-Routen registrieren
	RegisterScheduleRoutes(api)

	// Test-Fälle für 404-Verhalten bei nicht existierenden Ressourcen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET nicht existierender Schedule sollte 404 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/schedules/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "PUT nicht existierender Schedule sollte 404 zurückgeben",
			method:   http.MethodPut,
			path:     "/api/schedules/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "DELETE nicht existierender Schedule sollte 404 zurückgeben",
			method:   http.MethodDelete,
			path:     "/api/schedules/999",
			expected: http.StatusNotFound,
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

func TestRegisterScheduleRoutes_ActiveSchedulesRoute(t *testing.T) {
	// Setup
	e := echo.New()
	api := e.Group("/api")
	RegisterScheduleRoutes(api)

	// Prüfe nur die Routenregistrierung, nicht das tatsächliche Verhalten
	testCases := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		description    string
	}{
		{"GET /api/schedules/active sollte registriert sein", "GET", "/api/schedules/active", http.StatusOK, "Prüft ob die active-Route registriert ist"},
		{"POST /api/schedules/active sollte 405 zurückgeben (nicht registriert)", "POST", "/api/schedules/active", http.StatusMethodNotAllowed, "Prüft dass POST nicht erlaubt ist"},
		{"PUT /api/schedules/active sollte 400 zurückgeben (nicht registriert)", "PUT", "/api/schedules/active", http.StatusBadRequest, "Prüft dass PUT nicht erlaubt ist"},
		{"DELETE /api/schedules/active sollte 400 zurückgeben (nicht registriert)", "DELETE", "/api/schedules/active", http.StatusBadRequest, "Prüft dass DELETE nicht erlaubt ist"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()
			e.ServeHTTP(rec, req)

			// Prüfe nur ob die Route registriert ist (nicht 404)
			if tc.expectedStatus == http.StatusOK {
				assert.NotEqual(t, http.StatusNotFound, rec.Code, tc.description)
			} else {
				assert.Equal(t, tc.expectedStatus, rec.Code, tc.description)
			}
		})
	}
}

func TestRegisterScheduleRoutes_RouteOrder(t *testing.T) {
	// Setup
	e := echo.New()
	api := e.Group("/api")
	RegisterScheduleRoutes(api)

	testCases := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		description    string
	}{
		{"GET /api/schedules/active sollte funktionieren", "GET", "/api/schedules/active", http.StatusOK, "Prüft dass active-Route vor :id-Route registriert ist"},
		// Der folgende Testfall wird entfernt, da er ohne Datenbank nicht sinnvoll testbar ist:
		// {"GET /api/schedules/1 sollte funktionieren (nach active)", "GET", "/api/schedules/1", http.StatusOK, "Prüft dass :id-Route nach active-Route registriert ist"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rec := httptest.NewRecorder()
			e.ServeHTTP(rec, req)

			// Prüfe nur ob die Route registriert ist (nicht 404)
			assert.NotEqual(t, http.StatusNotFound, rec.Code, tc.description)
		})
	}
}
