# Fi-CMMS | Backend Ecosystem

This directory contains the distributed Node.js microservices and the unified database schema for the Fi-CMMS platform.

## Architecture

The backend follows a **Layeraged Microservices** pattern with:

- **API Gateway**: Entry point (Port 3000)
- **Asset Service**: Port 3001
- **WorkOrder Service**: Port 3002
- **Inventory Service**: Port 3003

## Data Layer

- **ORM**: Prisma
- **Database**: SQLite (`prisma/dev.db`)
- **Persistence**: Relational schema with full ACID compliance.

## Environment Setup

Run `npm install` in this directory to manage shared Prisma dependencies.
To sync the database schema:

```bash
npx prisma db push
```
