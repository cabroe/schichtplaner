# Standardziel, wenn nur 'make' aufgerufen wird
.DEFAULT_GOAL := help

# Phony targets (nicht als Dateien behandeln)
.PHONY: build dev test clean install help

build: ## Erstellt die Anwendung für Produktion
	cd frontend && yarn build
	ENV=prod go build -buildvcs=false -o ./bin/go-vite ./main.go

dev: ## Startet die Entwicklungsumgebung
	concurrently "cd frontend && yarn dev" "air"

test: ## Führt alle Tests aus
	go test ./...
	cd frontend && yarn test --run

clean: ## Entfernt alle generierten Dateien
	rm -rf ./bin
	rm -rf ./tmp
	rm -rf ./frontend/dist
	rm -rf ./frontend/node_modules
	rm -f ./schichtplaner
	rm -f ./database/*.db
	go clean -cache -testcache

install: ## Installiert alle Abhängigkeiten
	go mod download
	go mod tidy
	cd frontend && yarn install

help: ## Zeigt diese Hilfe an
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'