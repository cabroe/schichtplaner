FROM node:20 AS build-frontend
WORKDIR /build

COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./frontend .
RUN yarn build

FROM golang:1.24 AS build

# Set the Current Working Directory inside the container
WORKDIR /build

# Copy the modules files
COPY go.mod .
COPY go.sum .

# Download the modules
RUN go mod download

# Copy rest fo the code
COPY . .

# Copt the frontend build into the expected folder
COPY --from=build-frontend /build/dist ./frontend/dist

RUN CGO_ENABLED=0 ENV=prod go build -buildvcs=false -o ./bin/go-vite ./main.go

FROM alpine:3.14

# Install ca-certificates for HTTPS support
RUN apk --no-cache add ca-certificates

# Create app user and data directory
RUN addgroup -g 1001 -S app && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G app app && \
    mkdir -p /app/data && \
    chown -R app:app /app

WORKDIR /app

COPY --from=build /build/bin/go-vite /app/go-vite

# Switch to non-root user
USER app

# Create volume for persistent database storage
VOLUME ["/app/data"]

# This container exposes port 3000 to the outside world
EXPOSE 3000

# Run the executable
CMD ["./go-vite"]