# HealthMate AI - Sample Backend

This is a simple FastAPI backend for testing the HealthMate AI frontend.

## Quick Start

### 1. Install Dependencies

```bash
cd backend-example
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

Server will start at: http://localhost:8000

### 3. Test the API

Visit http://localhost:8000/docs for interactive API documentation.

Or test with curl:
```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I have a headache"}'
```

## Integration with Frontend

The frontend is already configured to connect to this backend at `http://localhost:8000`.

Make sure to:
1. Start this backend first: `python app.py`
2. Then start the frontend: `npm run dev` (from parent directory)

## Replace with Real AI

This is a DEMO backend with hardcoded responses. For production, replace the `/api/query` endpoint logic with:

### Option 1: Local LLM (Ollama)
```python
import ollama

response = ollama.chat(model='gemma', messages=[
    {'role': 'user', 'content': request.prompt}
])
return QueryResponse(response=response['message']['content'])
```

### Option 2: OpenAI
```python
from openai import OpenAI

client = OpenAI(api_key="your-key")
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": request.prompt}]
)
return QueryResponse(response=response.choices[0].message.content)
```

### Option 3: Google Gemini
```python
import google.generativeai as genai

genai.configure(api_key="your-key")
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content(request.prompt)
return QueryResponse(response=response.text)
```

## API Endpoints

- `GET /` - API info
- `POST /api/query` - Main query endpoint
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
