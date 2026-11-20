# Mock Server Guide

The mock server (`backend/src/mock-server.ts`) allows full frontend testing without running PostgreSQL, Redis, or RabbitMQ.

## Features
- In-memory ledger transactions and consent verification
- Simulated OTP generation and validation
- Credit score generation using rule-based algorithms
- Pre-seeded users: Borrower, Merchant Lender, Bank Officer

## Running
```bash
npm run start:mock
```
Default port: `4000`
