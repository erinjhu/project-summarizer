import re
import json
from gemini_utils import get_gemini_summary, GEMINI_API_KEY


def get_gemini(prompt: str) -> dict:
    summary = get_gemini_summary(prompt, GEMINI_API_KEY)
    summary = re.sub(r"^```json\s*|```$", "", summary.strip(), flags=re.MULTILINE)
    print(summary)
    try:
        summary_json = json.loads(summary)
    except Exception:
        summary_json = {"raw": summary}
    return summary_json

def generate_proj_notes(project_text, job_description, keywords, complexity, custom):
    prompt = PROJ_NOTES_PROMPT.format(
        project_text=project_text,
        job_description=job_description,
        keywords=", ".join(keywords),
        complexity=complexity,
        custom=custom
    )
    print("generating proj notes")
    summary_json = get_gemini(prompt)
    return summary_json 

def generate_role_notes(job_description, keywords, complexity, custom):
    prompt = ROLE_NOTES_PROMPT.format(
        job_description=job_description,
        keywords=", ".join(keywords),
        complexity=complexity,
        custom=custom
    )
    print(prompt)
    return prompt

def generate_company_notes(company, custom):
    prompt = COMPANY_NOTES_PROMPT.format(
        company=company,
        custom=custom
    )
    print(prompt)
    return prompt

def generate_interviewer_questions(interviewer, ref_questions, keywords, complexity, custom):
    prompt = INTERVIEWER_QUESTIONS_PROMPT.format(
        interviewer=interviewer,
        ref_questions=ref_questions,
        keywords=", ".join(keywords),
        complexity=complexity,
        custom=custom
    )
    print(prompt)
    return prompt

PROJ_NOTES_PROMPT = """
Project Notes: {project_text}
Job Description: {job_description}
Keywords: {keywords}
Complexity: {complexity}
Custom Instructions: {custom}

Summarize the key technical and impact highlights of this project for interview preparation. Focus on relevance to the job description and use the provided keywords.
"""

ROLE_NOTES_PROMPT = """
Role Notes:
Job Description: {job_description}
Keywords: {keywords}
Complexity: {complexity}
Custom Instructions: {custom}

Generate notes about the role based on the job description and keywords. Highlight responsibilities, required skills, and how your experience matches the role.
"""

COMPANY_NOTES_PROMPT = """
Company Notes:
Company Info: {company}
Custom Instructions: {custom}

Summarize important information about the company for interview prep. Include mission, culture, recent news, and how your background aligns with the company.
"""

INTERVIEWER_QUESTIONS_PROMPT = """
Interviewer Questions:
Interviewer Info: {interviewer}
Reference Questions: {ref_questions}
Keywords: {keywords}
Complexity: {complexity}
Custom Instructions: {custom}

Generate thoughtful questions to ask the interviewer. Use the provided info and keywords, and tailor questions to the role and company. Using the given info, generate conversations that show curiosity about the interviewer and build a genuine connection with them.
"""