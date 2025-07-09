package frontend

import (
	"embed"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	//go:embed dist/*
	dist embed.FS

	//go:embed dist/index.html
	indexHTML embed.FS

	distDirFS     = echo.MustSubFS(dist, "dist")
	distIndexHTML = echo.MustSubFS(indexHTML, "dist")
)

func RegisterHandlers(e *echo.Echo) {
	if os.Getenv("ENV") == "dev" {
		log.Println("Running in dev mode")
		setupDevProxy(e)
		return
	}

	// Setup static file serving with cache headers
	e.Use(staticWithCacheHeaders())

	// Use the static assets from the dist directory
	e.FileFS("/", "index.html", distIndexHTML)
	e.StaticFS("/", distDirFS)

	// This is needed to serve the index.html file for all routes that are not /api/*
	// needed for SPA to work when loading a specific url directly
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Skipper: func(c echo.Context) bool {
			// Skip the static middleware if the prefix is /api or /metrics
			return (len(c.Path()) >= 4 && c.Path()[:4] == "/api") || c.Path() == "/metrics"
		},
		// Root directory from where the static content is served.
		Root: "/",
		// Enable HTML5 mode by forwarding all not-found requests to root so that
		// SPA (single-page application) can handle the routing.
		HTML5:      true,
		Browse:     false,
		IgnoreBase: true,
		Filesystem: http.FS(distDirFS),
	}))
}

// staticWithCacheHeaders returns a middleware that adds appropriate cache headers for static assets
func staticWithCacheHeaders() echo.MiddlewareFunc {
	return echo.MiddlewareFunc(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			path := c.Request().URL.Path

			// Skip API and metrics endpoints
			if strings.HasPrefix(path, "/api") || path == "/metrics" {
				return next(c)
			}

			// Determine cache duration based on file type
			var cacheDuration time.Duration
			var cacheControl string

			ext := strings.ToLower(filepath.Ext(path))
			switch ext {
			case ".js", ".css", ".woff", ".woff2", ".ttf", ".eot":
				// Static assets with hash in filename - cache for 1 year
				cacheDuration = 365 * 24 * time.Hour
				cacheControl = "public, max-age=" + strconv.Itoa(int(cacheDuration.Seconds())) + ", immutable"
			case ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico":
				// Images - cache for 1 month
				cacheDuration = 30 * 24 * time.Hour
				cacheControl = "public, max-age=" + strconv.Itoa(int(cacheDuration.Seconds()))
			case ".html", ".htm":
				// HTML files - no cache (or short cache)
				cacheControl = "no-cache, no-store, must-revalidate"
			default:
				// Default for other files
				if path == "/" || path == "/index.html" {
					// Index page - no cache
					cacheControl = "no-cache, no-store, must-revalidate"
				} else {
					// Other files - cache for 1 hour
					cacheDuration = 1 * time.Hour
					cacheControl = "public, max-age=" + strconv.Itoa(int(cacheDuration.Seconds()))
				}
			}

			// Set cache headers
			c.Response().Header().Set("Cache-Control", cacheControl)
			if cacheDuration > 0 {
				c.Response().Header().Set("Expires", time.Now().Add(cacheDuration).Format(http.TimeFormat))
			}

			// Add ETag for better caching
			if ext != ".html" && ext != ".htm" && path != "/" {
				c.Response().Header().Set("ETag", `"`+path+`"`)
			}

			return next(c)
		}
	})
}

func setupDevProxy(e *echo.Echo) {
	url, err := url.Parse("http://localhost:5173")
	if err != nil {
		log.Fatal(err)
	}
	// Setup a proxy to the vite dev server on localhost:5173
	balancer := middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{
		{
			URL: url,
		},
	})
	e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{
		Balancer: balancer,
		Skipper: func(c echo.Context) bool {
			// Skip the proxy if the prefix is /api or /metrics
			return (len(c.Path()) >= 4 && c.Path()[:4] == "/api") || c.Path() == "/metrics"
		},
	}))
}
