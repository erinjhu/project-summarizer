import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

# test cases
# 1) valid
# 2) invalid repo url
# 3) invalid job description
# 4) missing keywords
# 5) missing required fields

def test_valid_request():
    payload = {
        "repo_url": "https://github.com/erinjhu/project-summarizer",
        "job_description": "software engineer",
        "company_info": "waterloo",
        "interviewer_info": "Erin Hu",
        "ref_questions": "",
        "keywords": ["automation", "testing"],
        "complexity": 5,
        "stats": 5,
        "custom": "",
        "create_proj_notes": True,
        "create_role_notes": False,
        "create_company_notes": False,
        "create_interviewer_questions": False,
        "create_interview_practice": True
    }
    response = client.post("/create-interview-prep", json=payload)
    print(response.json())
    assert response.status_code == 200
    assert "practice_questions" in response.json()

def test_invalid_repo_url():
    payload = {
        "repo_url": "not_a_valid_url",
        "job_description": "software developer",
        "company_info": "Waterloo",
        "interviewer_info": "Erin Hu",
        "ref_questions": "",
        "keywords": ["automation", "testing"],
        "complexity": 5,
        "stats": 5,
        "custom": "",
        "create_proj_notes": True,
        "create_role_notes": False,
        "create_company_notes": False,
        "create_interviewer_questions": False,
        "create_interview_practice": True
    }
    response = client.post("/create-interview-prep", json=payload)
    print(response.json())
    assert response.status_code == 200
    assert "practice_questions" in response.json()

def test_invalid_job_description():
    payload = {
        "repo_url": "https://github.com/erinjhu/project-summarizer",
        "job_description": "",  # Invalid/empty job description
        "company_info": "Waterloo",
        "interviewer_info": "Erin Hu",
        "ref_questions": "",
        "keywords": ["automation", "testing"],
        "complexity": 5,
        "stats": 5,
        "custom": "",
        "create_proj_notes": True,
        "create_role_notes": False,
        "create_company_notes": False,
        "create_interviewer_questions": False,
        "create_interview_practice": True
    }
    response = client.post("/create-interview-prep", json=payload)
    print(response.json())
    assert response.status_code == 200
    assert "practice_questions" in response.json()

def test_missing_keywords():
    payload = {
        "repo_url": "https://github.com/erinjhu/project-summarizer",
        "job_description": "QA Automation Engineer",
        "company_info": "Waterloo",
        "interviewer_info": "Erin Hu",
        "ref_questions": "",
        "keywords": [],  # No keywords
        "complexity": 5,
        "stats": 5,
        "custom": "",
        "create_proj_notes": True,
        "create_role_notes": False,
        "create_company_notes": False,
        "create_interviewer_questions": False,
        "create_interview_practice": True
    }
    response = client.post("/create-interview-prep", json=payload)
    print(response.json())
    assert response.status_code == 200
    assert "practice_questions" in response.json()

def test_missing_required_fields():
    payload = {
        # Missing repo_url and job_description
        "company_info": "Waterloo",
        "interviewer_info": "Erin Hu",
        "ref_questions": "",
        "keywords": ["automation", "testing"],
        "complexity": 5,
        "stats": 5,
        "custom": "",
        "create_proj_notes": True,
        "create_role_notes": False,
        "create_company_notes": False,
        "create_interviewer_questions": False,
        "create_interview_practice": True
    }
    response = client.post("/create-interview-prep", json=payload)
    print(response.json())
    assert response.status_code == 200
    assert "practice_questions" in response.json()