package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config enthält alle Konfigurationswerte für die Anwendung
type Config struct {
	// Server Configuration
	ServerPort int
	
	// Security Configuration
	SessionSecret string
	
	// Environment
	Environment string
	
	// Rate Limiting
	RateLimitPerSecond int
}

// LoadConfig lädt die Konfiguration aus Umgebungsvariablen
func LoadConfig() (*Config, error) {
	// Lade .env Datei falls vorhanden (für Entwicklung)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	config := &Config{
		ServerPort:         getEnvAsInt("SERVER_PORT", 3000),
		SessionSecret:      getEnv("SESSION_SECRET", ""),
		Environment:        getEnv("ENVIRONMENT", "development"),
		RateLimitPerSecond: getEnvAsInt("RATE_LIMIT_PER_SECOND", 20),
	}

	// Validierung der kritischen Konfigurationswerte
	if err := config.validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return config, nil
}

// validate prüft die Konfiguration auf Vollständigkeit und Gültigkeit
func (c *Config) validate() error {
	if c.SessionSecret == "" {
		return fmt.Errorf("SESSION_SECRET is required but not set")
	}

	if len(c.SessionSecret) < 32 {
		return fmt.Errorf("SESSION_SECRET must be at least 32 characters long")
	}

	if c.ServerPort <= 0 || c.ServerPort > 65535 {
		return fmt.Errorf("SERVER_PORT must be between 1 and 65535")
	}

	if c.RateLimitPerSecond <= 0 {
		return fmt.Errorf("RATE_LIMIT_PER_SECOND must be greater than 0")
	}

	return nil
}

// IsProduction gibt true zurück wenn die Anwendung in der Produktion läuft
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

// getEnv holt eine Umgebungsvariable oder gibt einen Default-Wert zurück
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt holt eine Umgebungsvariable als Integer oder gibt einen Default-Wert zurück
func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
