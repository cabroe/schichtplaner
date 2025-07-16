build:
	cd frontend && yarn build
	ENV=prod go build -buildvcs=false -o ./bin/go-vite ./main.go

dev:
	concurrently "cd frontend && yarn dev" "air"

test:
	go test ./...
	cd frontend && yarn test