.PHONY: dev swagger build test clean seed install

dev:
	air

swagger:
	swag init

build:
	go build -o bin/schichtplaner

test:
	go test -v ./...

clean:
	rm -rf bin/
	rm -rf tmp/
	rm -f *.db

seed:
	go run cmd/seed.go

install:
	go mod download
	go mod tidy
	go install github.com/swaggo/swag/cmd/swag@latest
