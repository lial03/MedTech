import math
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="Fi-CMMS AI Engine")

class SensorData(BaseModel):
    data: List[float]

def calculate_fractal_dimension(data: List[float]) -> float:
    """
    Computes fractal dimension using a box-counting approach.
    Matches the TypeScript implementation for consistency.
    """
    if len(data) < 2:
        return 1.0
        
    y = np.array(data)
    n_points = len(y)
    box_sizes = [2, 4, 8, 16]
    counts = []
    
    for box_size in box_sizes:
        count = 0
        for i in range(0, n_points, box_size):
            segment = y[i : i + box_size]
            if len(segment) > 0:
                y_range = np.max(segment) - np.min(segment)
                # Count boxes needed to cover the range vertical-wise
                count += math.ceil(y_range / box_size) or 1
        counts.append(count)
        
    # Log-Log linear regression to find the slope (Fractal Dimension)
    log_box_sizes = np.log(1.0 / np.array(box_sizes))
    log_counts = np.log(np.array(counts))
    
    coeffs = np.polyfit(log_box_sizes, log_counts, 1)
    return abs(float(coeffs[0]))

def calculate_health_score(fractal_dim: float) -> int:
    """
    Normalizes fractal dimension to a 0-100 health score.
    Ideal FD is ~1.6.
    """
    ideal_fd = 1.6
    deviation = abs(fractal_dim - ideal_fd)
    health_score = max(0, min(100, 100 - (deviation * 100)))
    return round(health_score)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-engine"}

@app.post("/predict")
def predict_health(payload: SensorData):
    try:
        fd = calculate_fractal_dimension(payload.data)
        score = calculate_health_score(fd)
        return {
            "fractalDimension": round(fd, 4),
            "healthScore": score,
            "status": "success" if score > 40 else "warning"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
