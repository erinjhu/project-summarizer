import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure the parent directory is in the path so you can import main and database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app
from database import supabase

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

    # Query Supabase to check if the data was saved
    result = supabase.table("generated_content").select("*").eq(
        "repo_url", payload["repo_url"]
    ).eq(
        "job_description", payload["job_description"]
    ).eq(
        "content_type", "interview_practice"
    ).order("created_at", desc=True).limit(1).execute()

    assert result.data, "No data found in Supabase for this request"
    saved = result.data[0]["generated_data"]
    print("Generated data from Supabase:")
    print(saved)