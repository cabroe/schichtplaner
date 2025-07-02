package api

import (
	"net/http"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/labstack/echo/v4"
)

// getLatestMessage returns the most recent message from the database
func getLatestMessage(c echo.Context) error {
	var message models.Message
	
	// Get the latest message from database
	result := db.DB.Order("created_at DESC").First(&message)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "No message found"})
	}

	// Return the message in the expected format for frontend compatibility
	return c.JSON(http.StatusOK, map[string]string{"message": message.Content})
}

// getAllMessages returns all messages from the database
func getAllMessages(c echo.Context) error {
	var messages []models.Message
	
	// Get all messages from database
	result := db.DB.Order("created_at DESC").Find(&messages)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch messages"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"messages": messages,
		"count":    len(messages),
	})
}
