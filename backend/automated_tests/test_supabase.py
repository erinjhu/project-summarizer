import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure the parent directory is in the path so you can import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

def test_supabase_save():
    payload = {
        "repo_url": "https://github.com/octocat/Hello-World",
        "job_description": "QA Automation Engineer",
        "company_info": "Test Company",
        "interviewer_info": "Jane Doe",
        "ref_questions": "",
        "keywords": ["automation", "testing"],
        "complexity": 5,
        "stats": 5,
        "detail": 5,
        "custom": "",
        "create_proj_notes": False,
        "create_role_notes": False,
        "create_company_notes": False,
        "create_interviewer_questions": False,
        "create_interview_practice": True
    }
    response = client.post("/create-interview-prep", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "practice_questions" in data
