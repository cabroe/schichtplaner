FROM node:23-alpine AS build-frontend
WORKDIR /build

COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./frontend .
RUN yarn build

FROM golang:1.23-alpine AS build

# Set the Current Working Directory inside the container
WORKDIR /build

# Copy the modules files
COPY go.mod .
COPY go.sum .

# Download the modules
RUN go mod download

# Copy rest of the code
COPY . .

# Copy the frontend build into the expected folder
COPY --from=build-frontend /build/dist ./frontend/dist

RUN CGO_ENABLED=0 ENV=prod go build -buildvcs=false -o ./bin/schichtplaner ./main.go

FROM alpine:3.21

COPY --from=build /build/bin/schichtplaner /usr/bin/schichtplaner

# This container exposes port 3000 to the outside world
EXPOSE 3000

# Run the executable
CMD ["/usr/bin/schichtplaner"]