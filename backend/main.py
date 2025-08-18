from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gemini_utils import get_gemini_summary, GEMINI_API_KEY
from pydantic import BaseModel
from repo_utils import clone_repo, read_project_files, cleanup_repo
import re
import json

app = FastAPI()

class ResumeRequest(BaseModel):
    repo_url: str
    job_description: str = ""
    num_bullets: int = 3
    min_words: int = 13
    max_words: int = 15
    ref_bullets: str = ""
    keywords: list[str] = []
    complexity: int = 5
    stats: int = 5
    custom: str = ""

def clean_input(text: str) -> str:
    return text.replace('\n', ' ').replace('\r', ' ')




RESUME_PROMPT = """
User's project text: {project_text},
Job description: {job_description},
Number of bullets: {num_bullets},
Minimimum and max words per bullet: {min_words}, {max_words},
Reference bullets: {ref_bullets},
Keywords to include in the resume section: {keywords},
Complexity and number of statistics/numbers/percentages to include on a scale of 1 (less) to 10 (more): {complexity} and {stats},
Custom requets: {custom}

Generate resume bullets that follow the criteria. They should be tailored to the github repo project text and the job description if provided. They should highlight the impact of the project and the technical skills of the user, along with giving enough context to show the project is relevant and help the recruiter understand its purpose. Do not make up false information; use the information parsed from the github repo. Describe the user's project to prepare them for applying to the job in the description if pasted. 

The section title should be the title of the project. Or, make a better title that would make the user appear as a good candidate for the job in the provided job description.

Output it as a plain text JSON with no backticks. {{
  "section_title": "section title",
  "resume_bullets": [
    "Bullet 1",
    "Bullet 2",
    "Bullet 3"
  ]
}}
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

@app.post("/create-resume")
async def summarize_url_2(data: ResumeRequest):
    # data from frontend
    repo_url = data.repo_url
    job_description = clean_input(data.job_description)
    num_bullets = data.num_bullets
    min_words = data.min_words
    max_words = data.max_words
    ref_bullets = data.ref_bullets
    keywords = data.keywords
    complexity = data.complexity
    stats = data.stats
    custom = data.custom
    # parse the github repo
    repo_path = clone_repo(repo_url)
    try:
        project_text = read_project_files(repo_path)
    finally:
        cleanup_repo(repo_path)
    # Add job description to the prompt
    prompt = RESUME_PROMPT.format(
        job_description=job_description,
        num_bullets=num_bullets,
        min_words=min_words,
        max_words=max_words,
        ref_bullets=ref_bullets,
        keywords=keywords,
        complexity=complexity,
        stats=stats,
        custom=custom,
        project_text=project_text
    )
    # feed prompt into ai
    summary = get_gemini_summary(prompt, GEMINI_API_KEY)
    summary = re.sub(r"^```json\s*|```$", "", summary.strip(), flags=re.MULTILINE)
    print(summary)
    try:
        summary_json = json.loads(summary)
    except Exception:
        summary_json = {"raw": summary}
    return summary_json



