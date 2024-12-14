package responses

// APIResponse definiert das standardisierte API-Antwortformat
type APIResponse struct {
	Success bool        `json:"success" example:"true"`
	Message string      `json:"message,omitempty" example:"Operation erfolgreich"`
	Error   string      `json:"error,omitempty" example:"Fehler bei der Verarbeitung"`
	Data    interface{} `json:"data,omitempty"`
}

// SuccessResponse erstellt eine erfolgreiche API-Antwort
func SuccessResponse(message string, data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
}

// ErrorResponse erstellt eine Fehler-API-Antwort
func ErrorResponse(errorMessage string) APIResponse {
	return APIResponse{
		Success: false,
		Error:   errorMessage,
	}
}

// ValidationResponse erstellt eine Antwort für Validierungsfehler
func ValidationResponse(validationErrors []string) APIResponse {
	return APIResponse{
		Success: false,
		Error:   "Validierungsfehler",
		Data:    validationErrors,
	}
}
