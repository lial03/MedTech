import math
import os
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None

app = FastAPI(title="Fi-CMMS AI Engine - Quantum Edition")

class SensorData(BaseModel):
    data: List[float]
    assetName: Optional[str] = "Equipment"

def calculate_fractal_dimension(data: List[float]) -> float:
    """Computes fractal dimension using a box-counting approach."""
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
                count += math.ceil(y_range / box_size) or 1
        counts.append(count)
        
    log_box_sizes = np.log(1.0 / np.array(box_sizes))
    log_counts = np.log(np.array(counts))
    coeffs = np.polyfit(log_box_sizes, log_counts, 1)
    return abs(float(coeffs[0]))

def calculate_health_score(fractal_dim: float) -> int:
    """Normalizes fractal dimension to a 0-100 health score."""
    ideal_fd = 1.6
    deviation = abs(fractal_dim - ideal_fd)
    health_score = max(0, min(100, 100 - (deviation * 100)))
    return round(health_score)

async def get_gemini_diagnostics(asset_name: str, health_score: int, fd: float):
    """Generates human-readable diagnostics using Gemini."""
    if not model:
        return {
            "origin_analysis": f"Simulated: Fractal variance of {fd:.2f} suggests potential mechanical drift.",
            "tactical_steps": [
                "Inspect primary motor bearings for heat signature.",
                "Calibrate internal pressure sensors.",
                "Verify power supply stability (12V rail)."
            ]
        }
    
    prompt = f"""
    Analyze the following equipment health status for a medical {asset_name}:
    Health Score: {health_score}%
    Fractal Dimension of Sensor Data: {fd:.4f}
    
    The health score is below the 65% safety threshold.
    Based on this fractal 'roughness', interpret the likely physical cause of the anomaly.
    Provide:
    1. A one-sentence 'origin_analysis' of the structural integrity.
    2. Three prioritized 'tactical_steps' for a technician to perform immediately.
    
    Format the response as JSON:
    {{
        "origin_analysis": "...",
        "tactical_steps": ["step 1", "step 2", "step 3"]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        import json
        # Extract JSON from response text (handling potential markdown formatting)
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "origin_analysis": "AI Diagnostic temporarily unavailable. Fractal anomaly confirmed.",
            "tactical_steps": ["Perform standard physical inspection.", "Check log files.", "Run manual self-test."]
        }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-engine", "gemini_active": model is not None}

@app.post("/predict")
async def predict_health(payload: SensorData):
    try:
        fd = calculate_fractal_dimension(payload.data)
        score = calculate_health_score(fd)
        
        # Determine if we need deep diagnostics
        diagnostics = None
        if score < 65:
            diagnostics = await get_gemini_diagnostics(payload.assetName, score, fd)
            
        return {
            "fractalDimension": round(fd, 4),
            "healthScore": score,
            "status": "success" if score > 40 else "warning",
            "diagnostics": diagnostics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
