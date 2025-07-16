package utils

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

// PaginationParams enthält die Pagination-Parameter
type PaginationParams struct {
	Page     int `json:"page"`
	PageSize int `json:"page_size"`
	Offset   int `json:"offset"`
}

// PaginatedResponse ist die Standard-Response für paginierte Daten
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Pagination struct {
		Page       int `json:"page"`
		PageSize   int `json:"page_size"`
		Total      int `json:"total"`
		TotalPages int `json:"total_pages"`
	} `json:"pagination"`
}

// GetPaginationParams extrahiert Pagination-Parameter aus der Request
func GetPaginationParams(c echo.Context) PaginationParams {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page <= 0 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(c.QueryParam("page_size"))
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}

	offset := (page - 1) * pageSize

	return PaginationParams{
		Page:     page,
		PageSize: pageSize,
		Offset:   offset,
	}
}

// CreatePaginatedResponse erstellt eine paginierte Response
func CreatePaginatedResponse(data interface{}, total int, params PaginationParams) PaginatedResponse {
	totalPages := (total + params.PageSize - 1) / params.PageSize

	response := PaginatedResponse{
		Data: data,
	}
	response.Pagination.Page = params.Page
	response.Pagination.PageSize = params.PageSize
	response.Pagination.Total = total
	response.Pagination.TotalPages = totalPages

	return response
}
