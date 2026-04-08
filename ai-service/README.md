# Fi-CMMS | AI Fractal Engine

A high-performance Python microservice that performs fractal dimension analysis on equipment sensor streams.

## Technical Stack

- **Framework**: FastAPI
- **Math Engine**: NumPy
- **Algorithm**: Box-Counting Fractal Dimension
- **Port**: 8000

## Endpoints

### `POST /predict`

Sends a time-series window and returns a health score (0-100).

- **Input**: `{ "asset_id": "...", "sensor_data": [ ... ] }`
- **Output**: `{ "health_score": 72.5, "fractal_dimension": 1.4 }`
