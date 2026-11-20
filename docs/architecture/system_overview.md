# Architecture System Overview

## System Components

1. **Frontend**: Next.js 14 App Router with Tailwind CSS and responsive role-based interfaces (Borrower, Merchant Lender, Bank Officer).
2. **Core Backend**: NestJS API with Prisma ORM, PostgreSQL database, Redis caching/OTP store, and RabbitMQ message broker.
3. **Scoring Service**: Python FastAPI microservice with async event consumers and a modular scoring engine.
4. **Data Store**: PostgreSQL 15 for relational consistency and audit records.
5. **Cache & Ephemeral Store**: Redis 7 for high-speed TTL management (OTP verification and 1-hour consent tokens).
6. **Message Broker**: RabbitMQ 3.12 topic exchange (`credit.events`) for asynchronous score re-calculation.
