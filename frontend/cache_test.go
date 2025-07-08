package frontend

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestStaticCacheHeaders(t *testing.T) {
	e := echo.New()
	
	// Setup middleware
	e.Use(staticWithCacheHeaders())
	
	// Test handler that just returns 200
	testHandler := func(c echo.Context) error {
		return c.String(http.StatusOK, "test")
	}
	
	tests := []struct {
		name           string
		path           string
		expectedCache  string
		shouldHaveETag bool
	}{
		{
			name:           "JavaScript file should have long cache",
			path:           "/assets/main-abc123.js",
			expectedCache:  "public, max-age=31536000, immutable",
			shouldHaveETag: true,
		},
		{
			name:           "CSS file should have long cache",
			path:           "/assets/style-def456.css",
			expectedCache:  "public, max-age=31536000, immutable",
			shouldHaveETag: true,
		},
		{
			name:           "Font file should have long cache",
			path:           "/assets/font.woff2",
			expectedCache:  "public, max-age=31536000, immutable",
			shouldHaveETag: true,
		},
		{
			name:           "Image file should have medium cache",
			path:           "/assets/logo.png",
			expectedCache:  "public, max-age=2592000",
			shouldHaveETag: true,
		},
		{
			name:           "SVG file should have medium cache",
			path:           "/assets/icon.svg",
			expectedCache:  "public, max-age=2592000",
			shouldHaveETag: true,
		},
		{
			name:           "HTML file should have no cache",
			path:           "/about.html",
			expectedCache:  "no-cache, no-store, must-revalidate",
			shouldHaveETag: false,
		},
		{
			name:           "Index page should have no cache",
			path:           "/",
			expectedCache:  "no-cache, no-store, must-revalidate",
			shouldHaveETag: false,
		},
		{
			name:           "Index.html should have no cache",
			path:           "/index.html",
			expectedCache:  "no-cache, no-store, must-revalidate",
			shouldHaveETag: false,
		},
		{
			name:           "Other files should have short cache",
			path:           "/some-file.txt",
			expectedCache:  "public, max-age=3600",
			shouldHaveETag: true,
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tt.path, nil)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			
			// Create a handler chain
			handler := staticWithCacheHeaders()(testHandler)
			
			err := handler(c)
			assert.NoError(t, err)
			
			// Check cache control header
			cacheControl := rec.Header().Get("Cache-Control")
			assert.Equal(t, tt.expectedCache, cacheControl)
			
			// Check ETag header
			etag := rec.Header().Get("ETag")
			if tt.shouldHaveETag {
				assert.NotEmpty(t, etag)
				assert.Equal(t, `"`+tt.path+`"`, etag)
			} else {
				assert.Empty(t, etag)
			}
			
			// Check Expires header (should be set when cache duration > 0)
			expires := rec.Header().Get("Expires")
			if tt.expectedCache != "no-cache, no-store, must-revalidate" {
				assert.NotEmpty(t, expires)
			}
		})
	}
}

func TestStaticCacheHeadersSkipsAPI(t *testing.T) {
	e := echo.New()
	
	// Setup middleware
	e.Use(staticWithCacheHeaders())
	
	// Test handler that just returns 200
	testHandler := func(c echo.Context) error {
		return c.String(http.StatusOK, "test")
	}
	
	tests := []struct {
		name string
		path string
	}{
		{
			name: "API endpoint should not have cache headers",
			path: "/api/health",
		},
		{
			name: "Metrics endpoint should not have cache headers",
			path: "/metrics",
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tt.path, nil)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			
			// Create a handler chain
			handler := staticWithCacheHeaders()(testHandler)
			
			err := handler(c)
			assert.NoError(t, err)
			
			// Should not have cache headers
			cacheControl := rec.Header().Get("Cache-Control")
			assert.Empty(t, cacheControl)
			
			etag := rec.Header().Get("ETag")
			assert.Empty(t, etag)
			
			expires := rec.Header().Get("Expires")
			assert.Empty(t, expires)
		})
	}
}
