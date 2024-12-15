package responses

// APIResponse definiert das standardisierte API-Antwortformat
type APIResponse struct {
	Success bool        `json:"success" example:"true"`
	Message string      `json:"message,omitempty" example:"Operation erfolgreich"`
	Error   string      `json:"error,omitempty" example:"Fehler bei der Verarbeitung"`
	Data    interface{} `json:"data,omitempty"`
}

// Vordefinierte Erfolgsmeldungen
const (
	MsgSuccessGet      = "Daten erfolgreich abgerufen"
	MsgSuccessCreate   = "Erfolgreich erstellt"
	MsgSuccessUpdate   = "Erfolgreich aktualisiert"
	MsgSuccessDelete   = "Erfolgreich gelöscht"
	MsgStatusDraft     = "Als Entwurf gespeichert"
	MsgStatusPublished = "Erfolgreich veröffentlicht"
	MsgStatusArchived  = "Erfolgreich archiviert"
)

// Vordefinierte Fehlermeldungen
const (
	ErrInvalidInput     = "Ungültige Eingabe"
	ErrNotFound         = "Nicht gefunden"
	ErrValidation       = "Validierungsfehler"
	ErrStatusTransition = "Ungültiger Statusübergang"
	ErrDraftOnly        = "Nur im Entwurfsmodus möglich"
	ErrConflict         = "Konflikt mit existierenden Daten"
	ErrPermission       = "Keine Berechtigung"
)

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
		Error:   ErrValidation,
		Data:    validationErrors,
	}
}

// StatusResponse erstellt eine Antwort für Statusänderungen
func StatusResponse(status string, data interface{}) APIResponse {
	var message string
	switch status {
	case "draft":
		message = MsgStatusDraft
	case "published":
		message = MsgStatusPublished
	case "archived":
		message = MsgStatusArchived
	default:
		message = MsgSuccessUpdate
	}
	return SuccessResponse(message, data)
}
