# Project Summarizer

Forgot what your project does? Paste in your GitHub repo URL to generate resume bullets and interview practice questions.

---

## Features

- **Resume Bullet Generator:**  
  Generate tailored resume bullets from your GitHub repo and job description.

- **Interview Practice:**  
  Generate practice interview questions and suggested answers based on your project and job description.

- **Customizable:**  
  Adjust complexity, keywords, and add custom instructions for more relevant results.

---

## Tech Stack

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python)
- **AI:** Google Gemini API

---

## Usage

1. **Enter your GitHub repo URL and job description.**
2. **Select which notes or questions to generate.**
3. **Adjust settings (complexity, keywords, etc.) as needed.**
4. **Click "Generate" to receive AI-powered summaries and questions.**
5. **Copy, save, or edit the generated content for your job applications or interview prep.**

---

## Environment Variables

- `GEMINI_API_KEY` — Your Google Gemini API key (required for backend).

---

## Troubleshooting

- **503 Service Unavailable:**  
  The Gemini API may be overloaded. Wait and try again later, or try changing the model in `backend/gemini_utils.py`.
- **API Key Issues:**  
  Ensure your `.env` file is present and the key is correct.



--- 

# To-Do's

- Change git command to use Linux file system instead of Windows for performance

---

# Development Environment

## Starting a Development Session

1. Clone the repository. 

2. Create a `.env` file in the `backend` directory with your Gemini API key:
  ```
  GEMINI_API_KEY=your_google_gemini_api_key
  ```

3. If in Windows, open the WSL terminal.

```
wsl
```

4. Start the Docker container

```
docker-compose up --build
```

5. The frontend will run at [http://localhost:3000](http://localhost:3000)

## Exiting a Development Session

1. In the terminal running `docker-compose up`, press Ctrl+C.

2. To remove containers and free resources, run `docker-compose down`.


