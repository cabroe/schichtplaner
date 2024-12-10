.PHONY: dev swagger build test clean seed

dev:
	air

swagger:
	swag init --dir ./,./handlers

build:
	go build -o bin/schichtplaner

test:
	go test -v ./...

clean:
	rm -rf bin/
	rm -rf tmp/

seed:
	go run cmd/seed.go

install:
	go mod download
	go mod tidy
