# Project Summarizer

Forgot what your project does? Paste in your GitHub repo URL to generate resume bullets and interview practice questions.

## Features

- **Resume Bullet Generator:**  
  Generate tailored resume bullets from your GitHub repo and job description.

- **Interview Practice:**  
  Generate practice interview questions and suggested answers based on your project and job description.

- **Customizable:**  
  Adjust complexity, keywords, and add custom instructions for more relevant results.


## Tech Stack

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python)
- **AI:** Google Gemini API
- **CI/CD:** Docker, GitHub Actions

## How to Use

1. **Enter your GitHub repo URL and job description.**
2. **Select which notes or questions to generate.**
3. **Adjust settings (complexity, keywords, etc.) as needed.**
4. **Click "Generate" to receive AI-powered summaries and questions.**
5. **Copy, save, or edit the generated content for your job applications or interview prep.**

## GitHub Actions

- When a pull request is created on the main branch, the following process will occur:
  - On a VM with Ubuntu, the code and its dependencies will be installed
  - Automated tests in `backend/automated_tests`will run to catch issues before merging

## Troubleshooting

- **503 Service Unavailable:**  
  The Gemini API may be overloaded. Wait and try again later, or try changing the model in `backend/gemini_utils.py`.
- **API Key Issues:**  
  Ensure your `.env` file is present and the key is correct.

--- 

# To-Do's

- Change git command to use Linux file system instead of Windows for performance


# Development Guide

## Initial Setup

1. Clone the repository. 

2. Create a `.env` file in the `backend` directory with your Gemini API key:
  ```
  GEMINI_API_KEY=your_google_gemini_api_key
  ```

3. If in Windows, open the WSL terminal.

```
wsl
```

## Starting the Docker Container

1. Start the Docker container

```
docker-compose up --build
```

2. The frontend will run at [http://localhost:3000](http://localhost:3000)


