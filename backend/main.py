from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gemini_utils import get_gemini_summary, GEMINI_API_KEY

app = FastAPI()

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. For production, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}

@app.post("/summarize-url")
async def summarize_url(request: Request):
    data = await request.json()
    test_text = data.get("repo_url", "Say hello!")  # Just use the input as test text
    prompt = f"Reply with 'Hello, world!' if you see this text: {test_text}"
    summary = get_gemini_summary(prompt, GEMINI_API_KEY)
    return {"summary": summary}

@app.post("/summarize-zip")
async def summarize_zip(file: UploadFile = File(...), summary_depth: str = "high"):
    summary = (
        f"High-level summary for {file.filename}" if summary_depth == "high"
        else f"Technical summary for {file.filename}"
    )
    return {
        "summary": summary,
        "concepts": ["API", "React", "FastAPI"]
    }