# Alternative Credit Scoring Platform

> **Empowering New-to-Credit borrowers** through alternative data analysis of cash transactions — no traditional credit history required.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start (Local)](#quick-start-local)
5. [Service URLs](#service-urls)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)
8. [Scoring Algorithm](#scoring-algorithm)
9. [AWS Deployment Guide](#aws-deployment-guide)
10. [Security Features](#security-features)
11. [Contributing](#contributing)

---

## Project Overview

Traditional credit scoring relies on credit history that many people simply don't have. This platform analyses **cash transaction patterns** — payment regularity, cash flow consistency, merchant diversity and seasonal behaviour — to generate a credit score for first-time borrowers.

**Technology Stack**

| Layer | Technology |
|---|---|
| Backend API | NestJS 10 (Node 20, TypeScript) |
| Frontend | Next.js 14 (React 18, App Router) |
| Scoring Engine | Python 3.11 + FastAPI |
| Primary DB | PostgreSQL 15 (via Prisma ORM) |
| Cache | Redis 7 |
| Message Broker | RabbitMQ 3.12 |
| Infrastructure | AWS ECS Fargate + Terraform |
| CI/CD | GitHub Actions |

---

## Architecture

```
                        ┌──────────────────────────────────────┐
                        │           Internet / Users            │
                        └──────────────┬───────────────────────┘
                                       │ HTTPS :443 / HTTP :80
                        ┌──────────────▼───────────────────────┐
                        │       Application Load Balancer       │
                        │        (AWS ALB, public subnets)      │
                        └──────┬───────────────────┬───────────┘
                               │                   │
              ┌────────────────▼──┐     ┌──────────▼──────────────┐
              │  Frontend (3000)  │     │   Backend API (3001)     │
              │  Next.js 14       │────▶│   NestJS + Prisma        │
              │  ECS Fargate      │     │   ECS Fargate            │
              └───────────────────┘     └────┬────────┬────────────┘
                                             │        │
                        ┌────────────────────▼──┐  ┌──▼─────────────────┐
                        │  Scoring Service (8000)│  │  PostgreSQL 15 RDS │
                        │  Python FastAPI         │  │  (private subnet)  │
                        │  ECS Fargate           │  └────────────────────┘
                        └──────────┬────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
  ┌───────────▼──────┐  ┌──────────▼───────┐  ┌────────▼──────────┐
  │  Redis 7         │  │  RabbitMQ 3.12   │  │  PostgreSQL 15    │
  │  ElastiCache     │  │  Amazon MQ       │  │  (scoring reads)  │
  │  (session/cache) │  │  (async scoring) │  └───────────────────┘
  └──────────────────┘  └──────────────────┘

  ══════════════════════════════════════════════
  All ECS services run in private subnets.
  RDS, ElastiCache and MQ are never publicly
  accessible. KMS encrypts all data at rest.
  ══════════════════════════════════════════════
```

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Docker & Docker Compose | 24.x / v2.x |
| Node.js | 20.x LTS |
| Python | 3.11+ |
| Terraform | 1.5+ |
| AWS CLI | 2.x (for deployment) |

---

## Quick Start (Local)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/credit-scoring-platform.git
cd credit-scoring-platform

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env — at minimum set JWT_SECRET to a 64-char random string:
#   openssl rand -hex 64

# 3. Build and start all services
docker compose up --build

# 4. Run database migrations (first time only)
docker compose exec backend npx prisma migrate deploy

# 5. (Optional) Seed demo data
docker compose exec backend npm run seed
```

All services are now running. See [Service URLs](#service-urls) below.

To stop everything:

```bash
docker compose down          # keep volumes
docker compose down -v       # also remove volumes (clean slate)
```

---

## Service URLs

| Service | Local URL | Description |
|---|---|---|
| Frontend | http://localhost:3000 | Next.js web app |
| Backend API | http://localhost:3001 | NestJS REST API |
| API Docs (Swagger) | http://localhost:3001/api | OpenAPI documentation |
| Scoring Service | http://localhost:8000 | FastAPI scoring engine |
| Scoring Docs | http://localhost:8000/docs | FastAPI Swagger UI |
| RabbitMQ Management | http://localhost:15672 | Message broker UI (credituser / creditpass) |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://credituser:creditpass@localhost:5432/creditdb?schema=public` | Prisma connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `RABBITMQ_URL` | `amqp://credituser:creditpass@localhost:5672` | RabbitMQ AMQP URL |
| `JWT_SECRET` | *(required)* | HS256 signing secret — min 64 chars |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `OTP_TTL_SECONDS` | `600` | OTP expiry (10 minutes) |
| `PORT` | `3001` | Backend HTTP port |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Frontend → Backend URL |
| `AWS_REGION` | `us-east-1` | AWS region |
| `ECR_REGISTRY` | *(set by CI)* | ECR registry host |
| `SCORING_SERVICE_URL` | `http://localhost:8000` | Backend → Scoring Service URL |
| `LOG_LEVEL` | `info` | Logging verbosity |

> **Never commit `.env` to source control.** Use AWS Secrets Manager or SSM Parameter Store for production secrets.

---

## API Endpoints

### Auth (`/auth`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new borrower (phone + name) |
| `POST` | `/auth/send-otp` | Send OTP to phone number |
| `POST` | `/auth/verify-otp` | Verify OTP and receive JWT |
| `POST` | `/auth/refresh` | Refresh access token |

### Borrowers (`/borrowers`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/borrowers/me` | Get current borrower profile |
| `PATCH` | `/borrowers/me` | Update profile |
| `GET` | `/borrowers/me/score` | Get latest credit score |

### Transactions (`/transactions`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/transactions` | Submit a cash transaction |
| `GET` | `/transactions` | List transactions (paginated) |
| `GET` | `/transactions/:id` | Get a single transaction |
| `DELETE` | `/transactions/:id` | Delete a transaction |

### Scoring (`/scoring`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/scoring/request` | Request a new credit score calculation |
| `GET` | `/scoring/history` | Get score history |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health check (ALB target) |

---

## Scoring Algorithm

The scoring engine (`scoring-service`) uses a **multi-factor model** to generate a score in the range **300 – 850**.

### Input Features

| Feature | Weight | Description |
|---|---|---|
| **Transaction Regularity** | 30% | Consistency of transaction timing (std-dev of intervals) |
| **Cash Flow Stability** | 25% | Variance in monthly net cash flow |
| **Merchant Diversity** | 15% | Number of unique merchants / categories |
| **Average Transaction Value** | 15% | Normalised mean transaction amount |
| **Account Age** | 10% | Months since first recorded transaction |
| **Large Transaction Ratio** | 5% | Ratio of transactions > 3× median |

### Score Bands

| Band | Range | Risk Category |
|---|---|---|
| Excellent | 750 – 850 | Very Low |
| Good | 670 – 749 | Low |
| Fair | 580 – 669 | Medium |
| Poor | 300 – 579 | High |

### Processing Flow

```
Borrower submits transactions
        │
        ▼
Backend publishes scoring.request to RabbitMQ
        │
        ▼
Scoring Service consumes message
        │
        ├─▶ Feature extraction (SQL window functions)
        ├─▶ Normalisation (MinMax per feature)
        ├─▶ Weighted sum → raw score [0,1]
        └─▶ Scale to [300, 850]
        │
        ▼
Scoring Service publishes scoring.result to RabbitMQ
        │
        ▼
Backend persists score, notifies borrower
```

---

## AWS Deployment Guide

### 1. Bootstrap Terraform state (one-time)

```bash
# Create an S3 bucket for remote state (replace YOUR_BUCKET)
aws s3 mb s3://YOUR_BUCKET-tfstate --region us-east-1
aws s3api put-bucket-versioning \
  --bucket YOUR_BUCKET-tfstate \
  --versioning-configuration Status=Enabled
```

### 2. Configure GitHub Secrets

Add the following secrets in **Settings → Secrets → Actions**:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM access key with ECR + ECS + RDS permissions |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret key |
| `ECR_REGISTRY` | `<account>.dkr.ecr.us-east-1.amazonaws.com` |

### 3. Apply Terraform

```bash
cd infra/terraform

terraform init

terraform plan \
  -var="db_password=STRONG_DB_PASSWORD" \
  -var="rabbitmq_password=STRONG_MQ_PASSWORD" \
  -var="jwt_secret=STRONG_JWT_SECRET_64_CHARS"

terraform apply \
  -var="db_password=STRONG_DB_PASSWORD" \
  -var="rabbitmq_password=STRONG_MQ_PASSWORD" \
  -var="jwt_secret=STRONG_JWT_SECRET_64_CHARS"
```

### 4. Run Migrations on ECS

```bash
# After first deploy, exec into the backend task to migrate
aws ecs execute-command \
  --cluster credit-scoring-production \
  --task <TASK_ARN> \
  --container backend \
  --command "npx prisma migrate deploy" \
  --interactive
```

### 5. Push to `main` to Trigger CI/CD

The GitHub Actions pipeline will:
1. Run a **Trivy security scan** — fails on CRITICAL/HIGH CVEs.
2. Build and push all three Docker images to ECR.
3. Force new ECS deployments for all three services.

---

## Security Features

| Feature | Implementation |
|---|---|
| **Authentication** | Phone-based OTP → short-lived JWT (HS256) |
| **Non-root containers** | All Dockerfiles create `appuser:appgroup` and drop privileges before `CMD` |
| **Network isolation** | ECS tasks in private subnets; only ALB is internet-facing |
| **Encryption at rest** | RDS `storage_encrypted = true` with customer-managed KMS key; KMS key rotation enabled |
| **Secrets management** | Sensitive variables passed via ECS environment (can be replaced with SSM SecretString) |
| **Vulnerability scanning** | Trivy fs scan on every push to `main`; ECR `scan_on_push = true` |
| **Dependency auditing** | `npm ci` (locked installs); Python `requirements.txt` pinned |
| **Minimal base images** | `node:20-alpine`, `python:3.11-slim` to reduce attack surface |
| **Health checks** | All infrastructure services (Postgres, Redis, RabbitMQ) have Docker healthchecks; ALB health checks on `/health` |
| **Rate limiting** | NestJS Throttler guard on all public endpoints |
| **Input validation** | class-validator + class-transformer DTOs on every controller |

---

## Contributing

1. Fork the repository and create a feature branch.
2. Run the full stack locally with `docker compose up --build`.
3. Write tests (`npm test` for backend, `pytest` for scoring service).
4. Ensure `docker compose` is clean and all healthchecks pass.
5. Open a pull request against `main`.

---

*Built with ❤️ to expand financial inclusion.*
