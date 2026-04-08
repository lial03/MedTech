# Fi-CMMS: Fractal-Informed Maintenance Management System

![Status](https://img.shields.io/badge/Status-Version_1.0-blue)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-success)
![Database](https://img.shields.io/badge/Persistence-SQLite-orange)
![AI](https://img.shields.io/badge/AI-Python_FastAPI-red)

**Fi-CMMS** (Fractal-Informed Computerised Maintenance Management System) is a high-performance hospital equipment management platform designed to bridge the gap between traditional fixed-interval maintenance and modern predictive intelligence.

## 🏛 Project Context

- **Project Name**: MedTech

## 🚀 System Architecture

Fi-CMMS is structured as a **distributed microservices architecture** to ensure scalability, isolation, and technological excellence as specified in the project report.

### 1. Presentation Layer (React/Vite)

A modern, glassmorphic dashboard built with **React 18** and **Tailwind CSS v4**. It communicates exclusively through the central API Gateway.

### 2. API Gateway (Node.js/Express)

The central entry point for the system.

- **Port**: 3000
- **Security**: JWT Authentication & Role-Based Access Control (Admin/Tech/Manager).
- **Orchestration**: Routes traffic to internal domain services.

### 3. Domain Services (Node.js/Prisma)

Three independent backend services managing the core business logic:

- **Asset Service (Port 3001)**: Equipment registry and health state synchronization.
- **Work Order Service (Port 3002)**: Maintenance lifecycle and staff registry.
- **Inventory Service (Port 3003)**: Logistics, parts consumption, and stock alerts.

### 4. AI Engine (Python/FastAPI)

The technical centerpiece of the system.

- **Port**: 8000
- **Algorithm**: Implements **Fractal Dimension (Box-Counting)** analysis via **NumPy**.
- **Function**: Processes raw sensor streams to generate predictive health scores and trigger autonomous work orders.

### 5. Persistence (SQLite)

A relational, zero-configuration database (`dev.db`) managed via **Prisma ORM**.

---

## 🛠 Getting Started

### Prerequisites

- **Node.js** (v18.0+)
- **Python** (v3.9+) with `fastapi`, `uvicorn`, and `numpy`
- **npm** (v9.0+)

### Full System Setup

Run the unified setup command to install all dependencies for all 6 components and initialize the database:

```bash
npm run setup
```

### Running the System

Launch the entire distributed ecosystem with a single command:

```bash
npm run dev:all
```

_Note: This will start the Frontend, Gateway, 3 Node Services, and the AI Engine simultaneously in a unified terminal view._

---

## 🧠 Core Features

- **Fractal Maintenance Scans**: Real-time diagnostic scanning of medical equipment.
- **Autonomous WO Generation**: Work orders are created automatically when equipment health drops below **65%**.
- **Interactive Staff Registry**: Assign technicians to tasks based on availability and specialization.
- **Logistics Integration**: Seamless parts consumption during work order completion.
- **Audit Ready**: Persistent maintenance logs stored in a relational schema.
