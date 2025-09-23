from supabase_client import supabase
import json
from typing import Optional, Dict, Any

def save_generated_content(
    repo_url: str,
    job_description: str,
    content_type: str,
    data: Dict[Any, Any]
) -> bool:
    """Save generated content to database"""
    try:
        result = supabase.table("generated_content").insert({
            "repo_url": repo_url,
            "job_description": job_description,
            "content_type": content_type,
            "generated_data": data
        }).execute()
        return True
    except Exception as e:
        print(f"Error saving to database: {e}")
        return False

def get_cached_content(
    repo_url: str,
    job_description: str,
    content_type: str
) -> Optional[Dict[Any, Any]]:
    """Get cached content from database"""
    try:
        result = supabase.table("generated_content").select("generated_data").eq(
            "repo_url", repo_url
        ).eq(
            "job_description", job_description
        ).eq(
            "content_type", content_type
        ).order("created_at", desc=True).limit(1).execute()
        
        if result.data:
            return result.data[0]["generated_data"]
        return None
    except Exception as e:
        print(f"Error fetching from database: {e}")
        return None