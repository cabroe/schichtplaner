# Standardziel, wenn nur 'make' aufgerufen wird
all: help

help: ## Zeigt diese Hilfe an
	@grep -E '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $1, $2}'

install: ## Installiert alle Abhängigkeiten (Go Module + Frontend yarn)
	go mod tidy
	cd frontend && yarn install

build: ## Baut das Frontend und Backend
	cd frontend && yarn build
	ENV=prod go build -buildvcs=false -o ./bin/go-vite ./main.go

dev: install ## Startet die Entwicklungsumgebung
	$(MAKE) build
	concurrently "cd frontend && yarn dev" "air"

test-backend: ## Führt Backend-Tests aus
	go test -v ./...

test-frontend: ## Führt Frontend-Tests (Lint + Build) aus
	cd frontend && yarn lint
	cd frontend && yarn build

test: test-frontend test-backend ## Führt alle Tests aus