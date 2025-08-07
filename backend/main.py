from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gemini_utils import get_gemini_summary, GEMINI_API_KEY
from repo_utils import clone_repo, read_project_files, cleanup_repo

app = FastAPI()

PROMPT_TEMPLATES = {
    "general": "Give a high-level summary of the project, including what it does, how to use it, and its impact on users.\n",
    "resume": "Write 2-3 resume bullet points describing this project for a technical resume.\n",
    "technical": "List the main features and, for each, include 5 different programming concepts, tools, or frameworks and how they are applied.\n",
    "interview": "Generate 5 practice interview questions about this project, focusing on its design and implementation.\n",
}

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
    selected_options = data.get("selected_options", [])  # <-- get from request
    repo_path = clone_repo(repo_url)
    try:
        project_text = read_project_files(repo_path)
    finally:
        cleanup_repo(repo_path)
    prompt_parts = [PROMPT_TEMPLATES[opt] for opt in selected_options if opt in PROMPT_TEMPLATES]
    prompt = "\n".join(prompt_parts) + f"\n\n{project_text}"
    summary = get_gemini_summary(prompt, GEMINI_API_KEY)
    return {"summary": summary}