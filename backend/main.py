from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gemini_utils import get_gemini_summary, GEMINI_API_KEY
from repo_utils import clone_repo, read_project_files, cleanup_repo
import re
import json

app = FastAPI()


# CHANGE PROMPT TEMPLATES TO THE ONE BELOW

PROMPT_TEMPLATES = {
    "general": "Put Summary as heading 1 (#). Output your response in Markdown. Only describe the core project and what the user created in their project. Instead of saying how the dependencies (or other files the user didn't create) work, describe how the user applied them. Give a high-level summary of the project, including what it does, how to use it, and its impact on users. Format your response with the following headings (##): What it is, Impact, How it Works. The how it works section should mention the tools applied and how. Each description should be 3-4 bullet points (- (bullet point text)). Do not start the output with three backticksmarkdown. Put a couple of line spaces under this section. \n",
    "resume": "Put Resume Bullets as heading 1 (#). Output your response in Markdown. Write 2-3 resume bullet points describing this project for a technical resume. Only describe the core project and what the user created in their project. Instead of saying how the dependencies (or other files the user didn't create) work, describe how the user applied them. Do not start the output with three backticksmarkdown.  Put a couple of line spaces under this section. \n",
    "technical": "Put Technical notes as heading 1 (#). Output your response in Markdown. List the main features and, for each, include 5 different programming concepts, tools, or frameworks and how they are applied. Only describe the core project and what the user created in their project. Instead of saying how the dependencies (or other files the user didn't create) work, describe how the user applied them. Format your response with each main feature as a heading  (##). Each main feature should have 3-5 concise bullet points (- (bullet point text)) explaining how the user integrated various concepts/tools/frameworks. The purpose of these notes is for the user to review how it works to prepare for an interviewDo not start the output with three backticksmarkdown.  Put a couple of line spaces under this section.  \n",
    "interview": "Put Interview Practice as heading 2 (#) Output your response in Markdown. Generate 5 practice interview questions about this project, focusing on its design and implementation. Do not start the output with three backticksmarkdown.  Put a couple of line spaces under this section. \n",
}

COMBINED_PROMPT = """
Given the following project files, output a JSON object with these keys:
- summary: {{ what_it_is: [...], impact: [...], how_it_works: [...] }}
- resume_bullets: [...]
- technical_notes: {{ feature_1: [...], feature_2: [...] }}
- interview_questions: [...]

Each key should have a list of concise bullet points or questions as appropriate. Do not include any text outside the JSON in your output. If there are dependencies, instead of saying how the dependencies (or other files the user didn't create) work, describe how the user applied them.

For impact, emphasize how the projects helps people/society, improves tech, and/or benefits something/someone in some way. Describe the project in a way that sells its capabilities and the potential of the user since this aims to help people applying to jobs. 

For the resume bullets, ensure they highlight the impac while highlighting the technical skills of the user. For the resume bullets, do not include backticks.

For the technical notes, the main features should be functionalities of the project. For their bullet points, explain what frameworks/tools/concepts the user applied in their project.

Project files:
{project_text}
"""

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
    prompt = COMBINED_PROMPT.format(project_text=project_text)
    summary = get_gemini_summary(prompt, GEMINI_API_KEY)
    summary = re.sub(r"^```json\s*|```$", "", summary.strip(), flags=re.MULTILINE)
    print(summary)
    # Try to parse as JSON
    import json
    try:
        summary_json = json.loads(summary)
    except Exception:
        summary_json = {"raw": summary}
    return summary_json