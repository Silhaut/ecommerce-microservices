.DEFAULT_GOAL := help
.PHONY: help install up down logs clean ci

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install workspace dependencies (also sets up git hooks)
	pnpm install

up: ## Start local infra (postgres, redis, rabbitmq)
	cp -n .env.example .env || true
	docker compose up -d

down: ## Stop local infra, keep data
	docker compose down

logs: ## Tail logs from all local infra containers
	docker compose logs -f

clean: ## Stop local infra and wipe all data (volumes)
	docker compose down -v

ci: ## Run what CI runs, locally
	pnpm nx affected -t lint test build typecheck
