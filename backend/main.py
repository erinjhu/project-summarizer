from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from gemini_utils import get_gemini_summary, GEMINI_API_KEY
from typing import Optional
from pydantic import BaseModel
from repo_utils import clone_repo, read_project_files, cleanup_repo
import re
import json
import logging
from interview_utils import (
    generate_proj_notes,
    generate_role_notes,
    generate_company_notes,
    generate_interviewer_questions,
    generate_interview_practice,
)

# Set up logging
logger = logging.getLogger(__name__)

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

class InterviewPrepRequest(BaseModel):
    repo_url: str
    create_proj_notes: bool = False
    create_role_notes: bool = False
    create_company_notes: bool = False
    create_interviewer_questions: bool = False
    create_interview_practice: bool = False
    job_description: str = ""
    company_info: str = ""
    interviewer_info: str = ""
    ref_questions: str = ""
    keywords: list[str] = []
    complexity: int = 5
    stats: int = 5
    detail: int = 5 
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

Generate resume bullets that follow the criteria. They should be tailored to the github repo project text and the job description if provided. They should highlight the impact of the project and the technical skills of the user, along with giving enough context to show the project is relevant and help the recruiter understand its purpose. Do not make up false information; use the information parsed from the github repo. Describe the user's project to prepare them for applying to the job in the description if pasted. Be sure to include as many industry-related keywords as possible to help the candidate pass ATS screening. 

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
async def create_resume(data: ResumeRequest):
    try:
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
        
        # feed prompt into ai with error handling
        try:
            summary = get_gemini_summary(prompt, GEMINI_API_KEY)
            summary = re.sub(r"^```json\s*|```$", "", summary.strip(), flags=re.MULTILINE)
            logger.info("Successfully generated resume summary")
            
            try:
                summary_json = json.loads(summary)
            except json.JSONDecodeError:
                logger.warning("Failed to parse JSON response, returning raw text")
                summary_json = {"raw": summary}
                
            return summary_json
            
        except Exception as api_error:
            error_message = str(api_error)
            logger.error(f"Gemini API error: {error_message}")
            
            if "rate limit" in error_message.lower() or "quota" in error_message.lower():
                raise HTTPException(
                    status_code=429,
                    detail={
                        "error": "API rate limit exceeded",
                        "message": "The AI service is currently experiencing high demand. Please try again in a few minutes.",
                        "retry_after": 60
                    }
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail={
                        "error": "AI service error",
                        "message": "There was an error processing your request. Please try again later."
                    }
                )
                
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in create_resume: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "message": "An unexpected error occurred. Please try again later."
            }
        )

@app.post("/create-interview-prep")
async def create_interview_prep(data: InterviewPrepRequest):
    try:
        result = {}
        cleaned_job_description = clean_input(data.job_description) if data.job_description else None
        
        # Handle project notes generation
        if data.create_proj_notes:
            try:
                repo_path = clone_repo(data.repo_url)
                try:
                    project_text = read_project_files(repo_path)
                finally:
                    cleanup_repo(repo_path)
                result["proj_notes"] = generate_proj_notes(
                    project_text, cleaned_job_description, data.keywords, data.complexity, data.custom
                )
            except Exception as e:
                logger.error(f"Error generating project notes: {str(e)}")
                result["proj_notes"] = {"error": "Failed to generate project notes"}
        
        # Handle role notes generation
        if data.create_role_notes:
            try:
                result["role_notes"] = generate_role_notes(
                    cleaned_job_description, data.keywords, data.complexity, data.custom
                )
            except Exception as e:
                logger.error(f"Error generating role notes: {str(e)}")
                result["role_notes"] = {"error": "Failed to generate role notes"}
        
        # Handle company notes generation
        if data.create_company_notes:
            try:
                result["company_notes"] = generate_company_notes(
                    data.company_info, data.custom
                )
            except Exception as e:
                logger.error(f"Error generating company notes: {str(e)}")
                result["company_notes"] = {"error": "Failed to generate company notes"}
        
        # Handle interviewer questions generation
        if data.create_interviewer_questions:
            try:
                result["interviewer_questions"] = generate_interviewer_questions(
                    data.interviewer_info, data.ref_questions, data.keywords, data.complexity, data.custom
                )
            except Exception as e:
                logger.error(f"Error generating interviewer questions: {str(e)}")
                result["interviewer_questions"] = {"error": "Failed to generate interviewer questions"}
        
        # Handle interview practice questions generation
        if data.create_interview_practice:
            try: 
                repo_path = clone_repo(data.repo_url)
                try:
                    project_text = read_project_files(repo_path)
                    logger.info(f"Successfully read project files, length: {len(project_text) if project_text else 0}")
                finally:
                    cleanup_repo(repo_path)

                logger.info("Calling generate_interview_practice...") 
                print(generate_interview_practice(
                      project_text,
                    data.job_description,
                    data.company_info,
                    data.interviewer_info,
                    data.ref_questions,
                    data.keywords,
                    data.complexity,
                    data.detail,
                    data.custom
                ))
                print("hi")
                result["practice_questions"] = generate_interview_practice(
                    project_text,
                    data.job_description,
                    data.company_info,
                    data.interviewer_info,
                    data.ref_questions,
                    data.keywords,
                    data.complexity,
                    data.detail,
                    data.custom
                )
                
            except Exception as e:
                logger.error(f"Error generating interview practice: {str(e)}")
                result["practice_questions"] = {"error": "Failed to generate interview practice"}



        return result
        
    except Exception as e:
        logger.error(f"Unexpected error in create_interview_prep: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "message": "An unexpected error occurred while generating interview preparation materials."
            }
        )
