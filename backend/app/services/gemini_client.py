import os
import google.generativeai as genai
from fastapi.concurrency import run_in_threadpool
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def generate_gemini_response(prompt: str):
    model = genai.GenerativeModel('gemini-pro')
    response = await run_in_threadpool(model.generate_content, prompt)
    return response.text
