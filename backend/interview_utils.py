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
    notes = get_gemini(prompt)
    return notes 

def generate_role_notes(job_description, keywords, complexity, custom):
    prompt = ROLE_NOTES_PROMPT.format(
        job_description=job_description,
        keywords=", ".join(keywords),
        complexity=complexity,
        custom=custom
    )
    print("generating role notes")
    notes = get_gemini(prompt)
    return notes

def generate_company_notes(company, custom):
    prompt = COMPANY_NOTES_PROMPT.format(
        company=company,
        custom=custom
    )
    print("generating company notes")
    notes = get_gemini(prompt)
    return notes

def generate_interviewer_questions(interviewer, ref_questions, keywords, complexity, custom):
    prompt = INTERVIEWER_QUESTIONS_PROMPT.format(
        interviewer=interviewer,
        ref_questions=ref_questions,
        keywords=", ".join(keywords),
        complexity=complexity,
        custom=custom
    )
    print("generating interviewer questions")
    notes = get_gemini(prompt)
    return notes

def generate_interview_practice(project_text, job_description, company_info, interviewer, ref_questions, keywords, complexity, detail, custom):
    prompt = INTERVIEW_PRACTICE_PROMPT.format(
        project_text=project_text,
        job_description=job_description,
        company_info=company_info,
        interviewer=interviewer,
        ref_questions=ref_questions,
        keywords=", ".join(keywords),
        detail=detail,
        complexity=complexity,
        custom=custom
    )
    print("generating interview practice")
    notes = get_gemini(prompt)
    print(notes)
    return notes


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

Summarize the given job description from the provided text or url. Generate notes about the role based on the job description and keywords to help the user prepare for a job interview. These notes should be concise; only include the most important info and cut out any fluff. The purpose is for key points that the user should be familiar with so that they are prepared for the job interview. Focus on the job responsibilities.
"""

COMPANY_NOTES_PROMPT = """
Company Notes:
Company Info: {company}
Custom Instructions: {custom}

Summarize important information about the company for interview prep. Include mission, culture, and recent news.
"""

INTERVIEWER_QUESTIONS_PROMPT = """
Interviewer Questions:
Interviewer Info: {interviewer}
Reference Questions: {ref_questions}
Keywords to include: {keywords}
Complexity: {complexity}
Custom Instructions: {custom}

Generate thoughtful questions to ask the interviewer. Use the provided info and keywords, and tailor questions to the role and company. Using the given info, generate conversations that show curiosity about the interviewer and build a genuine connection with them. if you are unable to get info from the linkedin url explain why.
"""

INTERVIEW_PRACTICE_PROMPT = """
Project Notes: {project_text}
Job Description: {job_description}
Company Info: {company_info}
Interviewer Info: {interviewer}
Refrence Questions: {ref_questions}
Keywords to include: {keywords}
Level of complexity: {complexity}
Level of detail: {detail}
Custom instructions: {custom}

The user is preparing for a job interview. Using the above information, generate 5 interview practice questions that an interviewer might ask the user about the project that is described in the project notes. 

Output your response as a plain text JSON with no backticks. {{
  "section_title": "section title",
  "interview_questions": [
    {"question": "Question 1", "answer": "Suggested answer 1"},
    {"question": "Question 2", "answer": "Suggested answer 2"}
  ]
}}


"""

COMMON_INSTRUCTIONS = """

"""