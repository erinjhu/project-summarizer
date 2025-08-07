from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gemini_utils import get_gemini_summary, GEMINI_API_KEY
from repo_utils import clone_repo, read_project_files, cleanup_repo

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

# @app.post("/summarize-url")
# async def summarize_url(request: Request):
#     data = await request.json()
#     test_text = data.get("repo_url", "Say hello!")  # Just use the input as test text
#     prompt = f"Reply with 'Hello, world!' if you see this text: {test_text}"
#     summary = get_gemini_summary(prompt, GEMINI_API_KEY)
#     return {"summary": summary}

@app.post("/summarize-url")
async def summarize_url(request: Request):
    data = await request.json()
    repo_url = data.get("repo_url")
    repo_path = clone_repo(repo_url)
    try:
        project_text = read_project_files(repo_path)
    finally:
        cleanup_repo(repo_path)
    prompt = f"""
    Given the following project files, list the main features with brief descriptions, the programming concepts/tools/frameworks used, and generate 5 practice interview questions about this project. Please format your answer as JSON with keys: features, concepts, interview_questions.

    {project_text}
    """
    summary = get_gemini_summary(prompt, GEMINI_API_KEY)
    return {"summary": summary}