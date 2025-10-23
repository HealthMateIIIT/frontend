"""
HealthMate AI - Sample Backend API (FastAPI)
This is a simple example backend for testing the frontend.
Replace with your actual AI/ML logic.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="HealthMate AI API", version="1.0.0")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str

class QueryResponse(BaseModel):
    response: str

# Sample responses for demo
SAMPLE_RESPONSES = {
    "headache": "Headaches can have many causes. If it's mild, try:\n\n1. Rest in a quiet, dark room\n2. Stay hydrated\n3. Apply a cold or warm compress\n4. Take over-the-counter pain relievers if needed\n\n⚠️ Seek immediate medical attention if you experience:\n- Sudden, severe headache\n- Headache with fever, stiff neck, or confusion\n- Headache after head injury",
    
    "fever": "For a fever:\n\n1. Stay hydrated - drink plenty of fluids\n2. Rest and avoid strenuous activities\n3. Dress in light, comfortable clothing\n4. Take fever-reducing medications if appropriate\n\n⚠️ Seek medical care if:\n- Temperature above 103°F (39.4°C)\n- Fever lasts more than 3 days\n- Accompanied by severe symptoms",
    
    "cold": "For common cold symptoms:\n\n1. Get plenty of rest\n2. Stay hydrated with water, tea, or soup\n3. Use a humidifier\n4. Gargle with salt water for sore throat\n5. Use over-the-counter cold medicines if needed\n\n💡 Most colds resolve in 7-10 days. Contact a doctor if symptoms worsen or persist.",
}

@app.get("/")
def read_root():
    return {
        "message": "HealthMate AI API",
        "status": "running",
        "endpoints": ["/api/query"]
    }

@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Process health-related queries and return AI-generated responses.
    
    TODO: Replace this with your actual AI/ML model logic:
    - Local LLM (Gemma, Mistral via Ollama)
    - Remote LLM (OpenAI, Claude, Gemini)
    - Symptom classification ML model
    """
    
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    prompt = request.prompt.lower()
    
    # Simple keyword matching for demo (replace with actual AI)
    response_text = None
    for keyword, response in SAMPLE_RESPONSES.items():
        if keyword in prompt:
            response_text = response
            break
    
    if not response_text:
        response_text = (
            "Thank you for your question. I'm here to help with health-related queries.\n\n"
            "I can provide information about common symptoms like headaches, fever, colds, and more.\n\n"
            "⚠️ Remember: This is for informational purposes only. "
            "Always consult a qualified healthcare professional for medical advice.\n\n"
            "Could you describe your symptoms in more detail?"
        )
    
    return QueryResponse(response=response_text)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    print("🩺 HealthMate AI Backend Starting...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    print("\n⚠️  This is a DEMO backend. Replace with actual AI logic!\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
