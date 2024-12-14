package handlers

import (
	"runtime"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// SystemStats enthält grundlegende Systemstatistiken
type SystemStats struct {
	Alloc      uint64 `json:"alloc"`
	TotalAlloc uint64 `json:"total_alloc"`
	Sys        uint64 `json:"sys"`
	NumGC      uint32 `json:"num_gc"`
}

// HealthData definiert die Struktur der Gesundheitsdaten
type HealthData struct {
	Status      string      `json:"status"`
	Database    string      `json:"database"`
	Timestamp   time.Time   `json:"timestamp"`
	Version     string      `json:"version"`
	APIPath     string      `json:"api_path"`
	Environment string      `json:"environment"`
	GoVersion   string      `json:"go_version"`
	NumCPU      int         `json:"num_cpu"`
	Goroutines  int         `json:"goroutines"`
	MemStats    SystemStats `json:"mem_stats"`
}

// @Summary Systemstatus abrufen
// @Description Gibt detaillierte Informationen über den Systemzustand zurück
// @Tags health
// @Accept */*
// @Produce json
// @Success 200 {object} responses.APIResponse{data=HealthData}
// @Failure 503 {object} responses.APIResponse
// @Router /api/v1/health [get]
func HandleHealthCheck(c *fiber.Ctx) error {
	dbStatus := "online"
	systemStatus := "gesund"

	if err := database.ValidateConnection(); err != nil {
		dbStatus = "offline"
		systemStatus = "ungesund"
		return c.Status(503).JSON(responses.ErrorResponse("System ist nicht verfügbar"))
	}

	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)

	systemStats := SystemStats{
		Alloc:      memStats.Alloc,
		TotalAlloc: memStats.TotalAlloc,
		Sys:        memStats.Sys,
		NumGC:      memStats.NumGC,
	}

	healthData := HealthData{
		Status:      systemStatus,
		Database:    dbStatus,
		Timestamp:   time.Now(),
		Version:     "1.0.0",
		APIPath:     "/api/v1",
		Environment: getEnvironment(),
		GoVersion:   runtime.Version(),
		NumCPU:      runtime.NumCPU(),
		Goroutines:  runtime.NumGoroutine(),
		MemStats:    systemStats,
	}

	return c.JSON(responses.SuccessResponse("System läuft einwandfrei", healthData))
}

// getEnvironment ermittelt die aktuelle Ausführungsumgebung
func getEnvironment() string {
	env := "production"
	if runtime.GOOS == "darwin" || runtime.GOOS == "windows" {
		env = "development"
	}
	return env
}
