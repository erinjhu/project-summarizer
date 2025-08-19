from google import genai
from dotenv import load_dotenv
from google.genai.types import Tool, GenerateContentConfig
import os

# continue from here https://ai.google.dev/gemini-api/docs/url-context#python

load_dotenv()

client = genai.Client()
model_id = "gemini-2.5-flash"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

tools = [
    {"url_context": {}},
]


client = genai.Client()

def get_gemini_summary(prompt: str, api_key: str) -> str:
    response = client.models.generate_content(
        model=model_id, contents=prompt,
        config=GenerateContentConfig(tools=tools,)
    )
    print(response.text)
    return response.text

# test_prompt = "summarize the job posting for the user to prepare for an interview using this url: "
# summ = get_gemini_summary(test_prompt, GEMINI_API_KEY)
# print(summ)
