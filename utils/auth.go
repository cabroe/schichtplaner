package utils

import (
	"net/http"
	"strings"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// AuthenticatedUser represents the authenticated user context
type AuthenticatedUser struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	IsAdmin  bool   `json:"is_admin"`
}

// BasicAuthMiddleware provides basic authentication middleware
func BasicAuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Skip authentication for health checks and metrics
			if strings.HasPrefix(c.Request().URL.Path, "/api/metrics") ||
				strings.HasPrefix(c.Request().URL.Path, "/api/health") {
				return next(c)
			}

			// Get Authorization header
			auth := c.Request().Header.Get("Authorization")
			if auth == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Missing Authorization header",
				})
			}

			// Check if it's Basic auth
			if !strings.HasPrefix(auth, "Basic ") {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid Authorization header format",
				})
			}

			// Extract credentials (simplified - in production use proper base64 decoding)
			credentials := strings.TrimPrefix(auth, "Basic ")
			
			// For demonstration, expect format "username:password" in base64
			// In a real implementation, you would decode base64 and extract username/password
			// For now, we'll use a simple API key approach
			
			// Check if it's a valid API key format or implement proper basic auth
			if credentials == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid credentials format",
				})
			}

			// For now, we'll implement a simple check - in production, implement proper authentication
			// This is a placeholder that should be replaced with proper authentication logic
			
			return next(c)
		}
	}
}

// AdminOnlyMiddleware ensures only admin users can access certain endpoints
func AdminOnlyMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Get user from context (would be set by authentication middleware)
			user, ok := c.Get("user").(*AuthenticatedUser)
			if !ok || !user.IsAdmin {
				return c.JSON(http.StatusForbidden, map[string]string{
					"error": "Admin access required",
				})
			}
			return next(c)
		}
	}
}

// ValidateUserCredentials validates username and password
func ValidateUserCredentials(username, password string) (*models.User, error) {
	var user models.User
	if err := database.DB.Where("username = ? AND is_active = ?", username, true).First(&user).Error; err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err
	}

	return &user, nil
}