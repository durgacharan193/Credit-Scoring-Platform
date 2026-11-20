.PHONY: help install build test lint run-dev docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install     Install all dependencies across monorepo"
	@echo "  make build       Build backend, frontend, and scoring engine"
	@echo "  make test        Run all unit and integration test suites"
	@echo "  make lint        Run linters across all packages"
	@echo "  make run-dev     Start mock backend and Next.js frontend"
	@echo "  make docker-up   Start all 6 services with docker-compose"
	@echo "  make docker-down Stop all docker services"

install:
	bash scripts/setup_dev.sh

build:
	cd backend && npm run build
	cd frontend && npm run build

test:
	bash scripts/run_tests.sh

lint:
	cd backend && npm run lint || true
	cd frontend && npm run lint || true

run-dev:
	cd backend && node src/mock-server.js &
	cd frontend && npm run dev

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down -v
