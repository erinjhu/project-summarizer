# filepath: c:\Users\Hu\Desktop\projects\project-summarizer\main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}