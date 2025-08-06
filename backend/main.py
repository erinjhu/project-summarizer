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
    return {
        "summary": f"Received repo URL: {repo_url}",
        "concepts": ["API", "React", "FastAPI"] 
    }

@app.post("/summarize-zip")
async def summarize_zip(file: UploadFile = File(...)):
    return {
        "summary": f"Received zip file: {file.filename}",
        "concepts": ["API", "React", "FastAPI"]  
    }