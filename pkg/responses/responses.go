package responses

// APIResponse Standardisiertes API Antwortformat
type APIResponse struct {
	Success bool        `json:"success" example:"true"`
	Message string      `json:"message,omitempty" example:"Operation erfolgreich durchgeführt"`
	Error   string      `json:"error,omitempty" example:"Ein Fehler ist aufgetreten"`
	Data    interface{} `json:"data,omitempty"`
}

// SuccessResponse Erstellt eine erfolgreiche API-Antwort
func SuccessResponse(message string, data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
}

// ErrorResponse Erstellt eine Fehler-API-Antwort
func ErrorResponse(errorMessage string) APIResponse {
	return APIResponse{
		Success: false,
		Error:   errorMessage,
	}
}
