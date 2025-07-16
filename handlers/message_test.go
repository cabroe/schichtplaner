package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetMessageHandler(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/message", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Handler direkt aufrufen
	if assert.NoError(t, GetMessageHandler(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.JSONEq(t, `{"message": "Hello, from the golang World!"}`, rec.Body.String())
	}
}
