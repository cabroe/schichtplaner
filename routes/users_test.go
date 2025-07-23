package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestRegisterUserRoutes(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Test-User erstellen für ID-basierte Tests
	testUser := models.User{
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
		Color:         "#ff0000",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}
	err := database.DB.Create(&testUser).Error
	assert.NoError(t, err)

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// User-Routen registrieren
	RegisterUserRoutes(api)

	// Test-Fälle für alle registrierten Routen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/users sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/users",
			expected: http.StatusOK, // Handler wird aufgerufen, aber Status hängt vom Handler ab
		},
		{
			name:     "GET /api/users/active sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/users/active",
			expected: http.StatusOK,
		},
		{
			name:     "GET /api/users/:id sollte registriert sein",
			method:   http.MethodGet,
			path:     "/api/users/1", // Verwende ID 1 vom erstellten Test-User
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/users sollte registriert sein",
			method:   http.MethodPost,
			path:     "/api/users",
			expected: http.StatusOK,
		},
		{
			name:     "PUT /api/users/:id sollte registriert sein",
			method:   http.MethodPut,
			path:     "/api/users/1", // Verwende ID 1 vom erstellten Test-User
			expected: http.StatusOK,
		},
		{
			name:     "DELETE /api/users/:id sollte registriert sein",
			method:   http.MethodDelete,
			path:     "/api/users/1", // Verwende ID 1 vom erstellten Test-User
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

func TestRegisterUserRoutes_InvalidRoutes(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// User-Routen registrieren
	RegisterUserRoutes(api)

	// Test-Fälle für nicht registrierte Routen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/users/invalid sollte 400 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/users/invalid",
			expected: http.StatusBadRequest,
		},
		{
			name:     "POST /api/users/invalid sollte 405 zurückgeben",
			method:   http.MethodPost,
			path:     "/api/users/invalid",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "GET /api/invalid sollte 404 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/invalid",
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

			// Prüfen, dass die Route nicht existiert (404)
			assert.Equal(t, tc.expected, rec.Code,
				"Route %s %s sollte nicht registriert sein", tc.method, tc.path)
		})
	}
}

func TestRegisterUserRoutes_RouteMethods(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// User-Routen registrieren
	RegisterUserRoutes(api)

	// Test-Fälle für verschiedene HTTP-Methoden auf derselben Route
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET /api/users sollte funktionieren",
			method:   http.MethodGet,
			path:     "/api/users",
			expected: http.StatusOK,
		},
		{
			name:     "POST /api/users sollte funktionieren",
			method:   http.MethodPost,
			path:     "/api/users",
			expected: http.StatusOK,
		},
		{
			name:     "PUT /api/users sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodPut,
			path:     "/api/users",
			expected: http.StatusMethodNotAllowed,
		},
		{
			name:     "DELETE /api/users sollte 405 zurückgeben (nicht registriert)",
			method:   http.MethodDelete,
			path:     "/api/users",
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

func TestRegisterUserRoutes_APIGroup(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// User-Routen registrieren
	RegisterUserRoutes(api)

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
			path:     "/api/users",
			expected: true,
		},
		{
			name:     "Route ohne /api Pfad sollte nicht funktionieren",
			method:   http.MethodGet,
			path:     "/users",
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

func TestRegisterUserRoutes_NotFoundBehavior(t *testing.T) {
	// Test-Datenbank initialisieren
	setupTestDB(t)
	defer cleanupTestDB()

	// Echo-Instanz für Tests erstellen
	e := echo.New()
	api := e.Group("/api")

	// User-Routen registrieren
	RegisterUserRoutes(api)

	// Test-Fälle für 404-Verhalten bei nicht existierenden Ressourcen
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{
			name:     "GET nicht existierender User sollte 404 zurückgeben",
			method:   http.MethodGet,
			path:     "/api/users/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "PUT nicht existierender User sollte 404 zurückgeben",
			method:   http.MethodPut,
			path:     "/api/users/999",
			expected: http.StatusNotFound,
		},
		{
			name:     "DELETE nicht existierender User sollte 404 zurückgeben",
			method:   http.MethodDelete,
			path:     "/api/users/999",
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
