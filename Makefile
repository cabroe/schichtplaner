# Standardziel, wenn nur 'make' aufgerufen wird
.DEFAULT_GOAL := help

# Phony targets (nicht als Dateien behandeln)
.PHONY: build dev test test-ui clean install help db-reset db-seed db-reset-seed docker-up docker-down

build: ## Erstellt die Anwendung für Produktion
	@cd frontend && yarn build
	@ENV=prod go build -buildvcs=false -o ./bin/schichtplaner ./main.go

dev: ## Startet die Entwicklungsumgebung
	@concurrently "cd frontend && yarn dev" "air"

test: test-backend test-frontend ## Führt alle Tests aus (inkl. Datenbank und Frontend)

test-backend: ## Führt nur Backend-Tests aus
	@go test ./...

test-frontend: ## Führt Frontend-Tests aus
	@cd frontend && yarn test --run

test-ui: ## Startet die Test-UI (Vitest UI)
	@cd frontend && yarn test:ui

clean: ## Entfernt alle generierten Dateien
	@rm -rf ./bin
	@rm -rf ./tmp
	@rm -rf ./frontend/dist
	@rm -rf ./frontend/node_modules
	@rm -f ./schichtplaner
	@rm -f ./database/*.db
	@go clean -cache -testcache

install: ## Installiert alle Abhängigkeiten
	@go mod download
	@go mod tidy
	@cd frontend && yarn

db-reset: ## Setzt die Datenbank zurück (löscht alle Daten)
	@go build -o ./bin/db ./cmd/db/main.go
	@./bin/db -reset

db-seed: ## Füllt die Datenbank mit Seed-Daten
	@go build -o ./bin/db ./cmd/db/main.go
	@./bin/db -seed

db-reset-seed: ## Setzt die Datenbank zurück und füllt sie mit Seed-Daten
	@go build -o ./bin/db ./cmd/db/main.go
	@./bin/db -reset-and-seed

docker-up: ## Startet alle Services (Schichtplaner + Monitoring)
	@docker-compose up -d

docker-down: ## Stoppt alle Services
	@docker-compose down

help: ## Zeigt diese Hilfe an
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'