package main

import (
	"fmt"

	"schichtplaner/frontend"
	"schichtplaner/handlers"

	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

func main() {
	// Create a new echo server
	e := echo.New()

	// Add standard middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Gzip())
	e.Use(middleware.CORS())
	e.Use(echoprometheus.NewMiddleware("schichtplaner"))

	// Setup the frontend handlers to service vite static assets
	frontend.RegisterHandlers(e)

	// Setup the API Group with rate limiting
	api := e.Group("/api")
	api.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(20))))
	handlers.RegisterRoutes(api)

	// Add Prometheus metrics endpoint
	e.GET("/metrics", echoprometheus.NewHandler())

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", 3000)))
}
