from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client()

def get_gemini_summary(prompt: str, api_key: str) -> str:
    prompt = "Explain how AI works in a few words"
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )
    print(response.text)
    return response.text