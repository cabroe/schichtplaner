# Betriebssystem-spezifische Binary-Namen
ifeq ($(OS),Windows_NT)
    BINARY_NAME = schichtplaner.exe
else
    BINARY_NAME = schichtplaner
endif

# Standardziel, wenn nur 'make' aufgerufen wird
all: help

help: ## Zeigt diese Hilfe an
	@grep -E '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $1, $2}'

install: ## Installiert alle Abhängigkeiten (Go Module + Frontend yarn)
	go mod tidy
	cd frontend && yarn

build: ## Baut das Frontend und Backend
	cd frontend && yarn build
	ENV=prod go build -buildvcs=false -o ./bin/$(BINARY_NAME) ./main.go

dev: ## Startet die Entwicklungsumgebung
	concurrently "cd frontend && yarn dev" "air"

test-backend: ## Führt Backend-Tests aus
	go test -v ./...

test-frontend: ## Führt Frontend-Tests (Lint + Build) aus
	cd frontend && yarn lint
	cd frontend && yarn build

test: test-frontend test-backend ## Führt alle Tests aus

dev-build: ## Baut für Entwicklung (Frontend + Backend)
	cd frontend && yarn build
	go build -buildvcs=false -o ./bin/$(BINARY_NAME) ./main.go

clean: ## Löscht Build-Artefakte
	rm -f ./bin/$(BINARY_NAME)
	rm -rf ./frontend/dist
	rm -rf ./tmp

.PHONY: all help install build dev dev-build test-backend test-frontend test clean