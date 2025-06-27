
.PHONY: build dev install test test-go test-frontend test-frontend-watch coverage coverage-go coverage-frontend lint clean docker-build docker-run docker-push help all

# Standardziel, wenn nur 'make' aufgerufen wird
all: help

help: ## Zeigt diese Hilfe an
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Abhängigkeiten installieren
	cd frontend && yarn install

dev: ## Entwicklungsserver starten
	concurrently "cd frontend && yarn dev" "air"

build: ## Projekt bauen
	cd frontend && yarn build
	ENV=prod go build -buildvcs=false -o ./bin/schichtplaner.exe ./main.go

lint: ## Linting durchführen
	cd frontend && yarn lint
	go vet ./...

test: test-frontend test-go ## Alle Tests ausführen (Frontend und Go)

test-frontend: ## Nur Frontend-Tests ausführen (CI-Modus)
	cd frontend && yarn test:run

test-frontend-watch: ## Frontend-Tests im Watch-Modus ausführen
	cd frontend && yarn test

test-go: ## Nur Go-Tests ausführen
	go test -v ./...

coverage: coverage-frontend coverage-go ## Test-Coverage für alle Tests generieren

coverage-frontend: ## Nur Frontend-Test-Coverage generieren
	cd frontend && yarn coverage

coverage-go: ## Nur Go-Test-Coverage generieren
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

docker-build: ## Docker-Image bauen
	docker build -t schichtplaner:latest .

docker-run: ## Docker-Container starten
	docker run -p 3000:3000 schichtplaner:latest

docker-push: ## Docker-Image zu einer Registry pushen (erfordert vorherige Anmeldung)
	docker push schichtplaner:latest

clean: ## Aufräumen (node_modules, build-Verzeichnis und binaries entfernen)
	cd frontend && rm -rf node_modules dist yarn.lock
	rm -rf bin
	rm -f coverage.out coverage.html