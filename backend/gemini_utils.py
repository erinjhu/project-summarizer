from google import genai
from dotenv import load_dotenv
from google.genai.types import Tool, GenerateContentConfig
import os
import time
import random
from typing import Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# continue from here https://ai.google.dev/gemini-api/docs/url-context#python

load_dotenv()

client = genai.Client()
model_id = "gemini-2.5-pro"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

tools = [
    {"url_context": {}},
]

client = genai.Client()

def get_gemini_summary(prompt: str, api_key: str, max_retries: int = 3, base_delay: float = 1.0) -> str:
    """
    Get summary from Gemini API with retry logic and rate limiting.
    
    Args:
        prompt: The prompt to send to Gemini
        api_key: The API key for authentication
        max_retries: Maximum number of retry attempts
        base_delay: Base delay for exponential backoff (in seconds)
    
    Returns:
        The response text from Gemini API
    
    Raises:
        Exception: If all retries are exhausted
    """
    for attempt in range(max_retries + 1):
        try:
            # Add a small delay between requests to avoid rate limiting
            if attempt > 0:
                delay = base_delay * (2 ** (attempt - 1)) + random.uniform(0, 1)
                logger.info(f"Retrying in {delay:.2f} seconds (attempt {attempt + 1}/{max_retries + 1})")
                time.sleep(delay)
            
            response = client.models.generate_content(
                model=model_id, 
                contents=prompt,
                config=GenerateContentConfig(tools=tools,)
            )
            
            logger.info("Successfully received response from Gemini API")
            return response.text
            
        except Exception as e:
            error_message = str(e)
            logger.warning(f"Attempt {attempt + 1} failed: {error_message}")
            
            # Check if it's a rate limit error
            if "RATE_LIMIT_EXCEEDED" in error_message or "RESOURCE_EXHAUSTED" in error_message:
                if attempt < max_retries:
                    logger.info("Rate limit exceeded, will retry with exponential backoff")
                    continue
                else:
                    logger.error("Rate limit exceeded and max retries reached")
                    raise Exception("API rate limit exceeded. Please try again later or request a quota increase.")
            
            # Check if it's a quota exceeded error
            elif "QUOTA_EXCEEDED" in error_message:
                logger.error("API quota exceeded")
                raise Exception("API quota exceeded. Please check your Google Cloud Console for quota limits.")
            
            # For other errors, raise immediately
            else:
                logger.error(f"Unexpected error: {error_message}")
                raise Exception(f"API request failed: {error_message}")
    
    # This should never be reached, but just in case
    raise Exception("All retry attempts failed")

def check_api_quota() -> dict:
    """
    Check the current API quota status.
    This is a placeholder - you would need to implement actual quota checking
    using Google Cloud Console API or similar.
    """
    return {
        "status": "unknown",
        "message": "Quota checking not implemented. Check Google Cloud Console for quota details."
    }

# test_prompt = "summarize the job posting for the user to prepare for an interview using this url: "
# summ = get_gemini_summary(test_prompt, GEMINI_API_KEY)
# print(summ)
