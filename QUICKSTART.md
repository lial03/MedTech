# Fi-CMMS Quickstart Guide

Follow these steps to get the full **Fractal-Informed CMMS** system running on your local machine.

## 1. Prerequisites
Ensure you have the following installed:
- **Node.js 18+**: For the frontend, gateway, and domain services.
- **Python 3.9+**: For the AI Fractal Engine.
- **npm / pip**: Package managers for Node and Python.

## 2. One-Command Setup
From the root directory, run the setup script. This will install dependencies for all services, initialize the SQLite database, and seed initial data.
```bash
npm run setup
```

## 3. Install Python Dependencies
The AI Engine requires `fastapi`, `uvicorn`, and `numpy`.
```bash
pip install -r ai-service/requirements.txt
```

## 4. Launch the System
Start all 6 system components (Frontend, Gateway, Assets, Work Orders, Inventory, AI) in a single unified terminal:
```bash
npm run dev:all
```

---

## 🏗 Component Map
Once the system is running, the following internal ports are active:
- **Dashboard (Frontend)**: [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:3000](http://localhost:3000)
- **Asset Service**: [http://localhost:3001](http://localhost:3001)
- **WorkOrder Service**: [http://localhost:3002](http://localhost:3002)
- **Inventory Service**: [http://localhost:3003](http://localhost:3003)
- **AI Fractal Engine**: [http://localhost:8000](http://localhost:8000)

## 🔐 Credentials
For the simulation, use any valid email to log in:
- **Email**: `admin@hospital.com`
- **Password**: `any`

---

## 🧪 Testing the "Predictive maintenance" loop
1. Go to the **Assets** page.
2. Select an equipment (e.g., `AST-003`).
3. Click **"Run Diagnostics"**.
4. The frontend sends sensor data to the **AI Engine (Python)**.
5. The AI Engine computes the fractal dimension and returns a health score.
6. If the score is `< 65%`, the **Asset Service** automatically triggers the **Work Order Service** to generate a new "Predictive" task.
7. Verification: Navigate to **Work Orders** and you will see the AI-generated task waiting for assignment.
