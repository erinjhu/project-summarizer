from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

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
    repo_url = data.get("repo_url")
    summary_depth = data.get("summary_depth", "high")
    summary = (
        f"High-level summary for {repo_url}" if summary_depth == "high"
        else f"Technical summary for {repo_url}"
    )
    return {
        "summary": summary,
        "concepts": ["API", "React", "FastAPI"] 
    }

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