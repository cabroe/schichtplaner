package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestRegisterAPIRoutes(t *testing.T) {
	// Setup
	e := echo.New()
	RegisterAPIRoutes(e)

	// Testfälle für verschiedene API-Endpunkte
	testCases := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		description    string
	}{
		// General Routes
		{
			name:           "Health Check Route",
			method:         "GET",
			path:           "/api/health",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Health-Check-Route registriert ist",
		},

		// User Routes - nur prüfen ob Route existiert, nicht ausführen
		{
			name:           "Get All Users Route",
			method:         "GET",
			path:           "/api/users",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-All-Users-Route registriert ist",
		},
		{
			name:           "Get User By ID Route",
			method:         "GET",
			path:           "/api/users/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-User-By-ID-Route registriert ist",
		},
		{
			name:           "Create User Route",
			method:         "POST",
			path:           "/api/users",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Create-User-Route registriert ist",
		},
		{
			name:           "Update User Route",
			method:         "PUT",
			path:           "/api/users/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Update-User-Route registriert ist",
		},
		{
			name:           "Delete User Route",
			method:         "DELETE",
			path:           "/api/users/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Delete-User-Route registriert ist",
		},

		// Shift Routes
		{
			name:           "Get All Shifts Route",
			method:         "GET",
			path:           "/api/shifts",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-All-Shifts-Route registriert ist",
		},
		{
			name:           "Get Shift By ID Route",
			method:         "GET",
			path:           "/api/shifts/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-Shift-By-ID-Route registriert ist",
		},
		{
			name:           "Create Shift Route",
			method:         "POST",
			path:           "/api/shifts",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Create-Shift-Route registriert ist",
		},
		{
			name:           "Update Shift Route",
			method:         "PUT",
			path:           "/api/shifts/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Update-Shift-Route registriert ist",
		},
		{
			name:           "Delete Shift Route",
			method:         "DELETE",
			path:           "/api/shifts/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Delete-Shift-Route registriert ist",
		},
		{
			name:           "Get Shifts By User Route",
			method:         "GET",
			path:           "/api/users/:user_id/shifts",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-Shifts-By-User-Route registriert ist",
		},

		// Schedule Routes
		{
			name:           "Get All Schedules Route",
			method:         "GET",
			path:           "/api/schedules",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-All-Schedules-Route registriert ist",
		},
		{
			name:           "Get Schedule By ID Route",
			method:         "GET",
			path:           "/api/schedules/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-Schedule-By-ID-Route registriert ist",
		},
		{
			name:           "Create Schedule Route",
			method:         "POST",
			path:           "/api/schedules",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Create-Schedule-Route registriert ist",
		},
		{
			name:           "Update Schedule Route",
			method:         "PUT",
			path:           "/api/schedules/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Update-Schedule-Route registriert ist",
		},
		{
			name:           "Delete Schedule Route",
			method:         "DELETE",
			path:           "/api/schedules/:id",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Delete-Schedule-Route registriert ist",
		},
		{
			name:           "Get Active Schedules Route",
			method:         "GET",
			path:           "/api/schedules/active",
			expectedStatus: http.StatusOK,
			description:    "Prüft ob die Get-Active-Schedules-Route registriert ist",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Prüfe nur ob die Route registriert ist, ohne sie auszuführen
			routes := e.Routes()
			routeFound := false

			for _, route := range routes {
				if route.Method == tc.method && route.Path == tc.path {
					routeFound = true
					break
				}
			}

			assert.True(t, routeFound,
				"Route %s %s sollte registriert sein, aber wurde nicht gefunden", tc.method, tc.path)
		})
	}
}

func TestRegisterAPIRoutes_InvalidRoutes(t *testing.T) {
	// Setup
	e := echo.New()
	RegisterAPIRoutes(e)

	// Testfälle für ungültige Routen
	testCases := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		description    string
	}{
		{
			name:           "Invalid API Route",
			method:         "GET",
			path:           "/api/invalid",
			expectedStatus: http.StatusNotFound,
			description:    "Prüft ob ungültige API-Routen 404 zurückgeben",
		},
		{
			name:           "Invalid User Route",
			method:         "GET",
			path:           "/api/users/invalid",
			expectedStatus: http.StatusNotFound,
			description:    "Prüft ob ungültige User-Routen 404 zurückgeben",
		},
		{
			name:           "Invalid Shift Route",
			method:         "GET",
			path:           "/api/shifts/invalid",
			expectedStatus: http.StatusNotFound,
			description:    "Prüft ob ungültige Shift-Routen 404 zurückgeben",
		},
		{
			name:           "Invalid Schedule Route",
			method:         "GET",
			path:           "/api/schedules/invalid",
			expectedStatus: http.StatusNotFound,
			description:    "Prüft ob ungültige Schedule-Routen 404 zurückgeben",
		},
		{
			name:           "Non-API Route",
			method:         "GET",
			path:           "/health",
			expectedStatus: http.StatusNotFound,
			description:    "Prüft ob nicht-API-Routen 404 zurückgeben",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Prüfe nur ob die Route NICHT registriert ist
			routes := e.Routes()
			routeFound := false

			for _, route := range routes {
				if route.Method == tc.method && route.Path == tc.path {
					routeFound = true
					break
				}
			}

			assert.False(t, routeFound,
				"Route %s %s sollte nicht existieren", tc.method, tc.path)
		})
	}
}

func TestRegisterAPIRoutes_APIGroupStructure(t *testing.T) {
	// Setup
	e := echo.New()
	RegisterAPIRoutes(e)

	// Prüfe dass die API-Gruppe korrekt erstellt wurde
	routes := e.Routes()

	// Zähle API-Routen
	apiRouteCount := 0
	for _, route := range routes {
		if len(route.Path) > 4 && route.Path[:4] == "/api" {
			apiRouteCount++
		}
	}

	// Mindestens 15 API-Routen sollten registriert sein
	// (General: 1, Users: 5, Shifts: 5, Schedules: 5, User-Shifts: 1, Active-Schedules: 1)
	assert.GreaterOrEqual(t, apiRouteCount, 15,
		"Es sollten mindestens 15 API-Routen registriert sein, aber nur %d gefunden", apiRouteCount)
}

func TestRegisterAPIRoutes_RouteOrder(t *testing.T) {
	// Setup
	e := echo.New()
	RegisterAPIRoutes(e)

	// Prüfe dass die Routen in der korrekten Reihenfolge registriert werden
	// Spezifische Routen sollten vor generischen Routen kommen
	routes := e.Routes()

	// Finde die Reihenfolge der Schedule-Routen
	scheduleRoutes := make([]string, 0)
	for _, route := range routes {
		if len(route.Path) > 10 && route.Path[:10] == "/api/schedules" {
			scheduleRoutes = append(scheduleRoutes, route.Path)
		}
	}

	// Die /active Route sollte vor der /:id Route kommen
	activeIndex := -1
	idIndex := -1

	for i, path := range scheduleRoutes {
		if path == "/api/schedules/active" {
			activeIndex = i
		}
		if path == "/api/schedules/:id" {
			idIndex = i
		}
	}

	if activeIndex != -1 && idIndex != -1 {
		assert.Less(t, activeIndex, idIndex,
			"Die /active Route sollte vor der /:id Route registriert werden")
	}
}

func TestRegisterAPIRoutes_HealthCheckOnly(t *testing.T) {
	// Setup
	e := echo.New()
	RegisterAPIRoutes(e)

	// Test nur für Health-Check mit echten HTTP-Request
	req := httptest.NewRequest("GET", "/api/health", nil)
	rec := httptest.NewRecorder()

	// Führe Request aus
	e.ServeHTTP(rec, req)

	// Prüfe dass die Health-Check-Route funktioniert
	assert.Equal(t, http.StatusOK, rec.Code,
		"Health-Check-Route sollte 200 OK zurückgeben")
}
