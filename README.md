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
- **Other:** Pydantic, httpx, dotenv

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/project-summarizer.git
cd project-summarizer
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

- Create a `.env` file in the `backend` directory with your Gemini API key:
  ```
  GEMINI_API_KEY=your_google_gemini_api_key
  ```

- Start the backend server:
  ```bash
  uvicorn main:app --reload
  ```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

- The frontend will run at [http://localhost:3000](http://localhost:3000)

---

## Usage

1. **Enter your GitHub repo URL and job description.**
2. **Select which notes or questions to generate.**
3. **Adjust settings (complexity, keywords, etc.) as needed.**
4. **Click "Generate" to receive AI-powered summaries and questions.**
5. **Copy, save, or edit the generated content for your job applications or interview prep.**

---

## API Endpoints

- `POST /create-resume`  
  Generate resume bullets from repo and job description.

- `POST /create-interview-prep`  
  Generate project notes and interview practice questions.

---

## Environment Variables

- `GEMINI_API_KEY` — Your Google Gemini API key (required for backend).

---

## Troubleshooting

- **503 Service Unavailable:**  
  The Gemini API may be overloaded. Wait and try again later, or try changing the model in `backend/gemini_utils.py`.
- **CORS Issues:**  
  The backend allows all origins for development. For production, restrict `allow_origins` in `main.py`.
- **API Key Issues:**  
  Ensure your `.env` file is present and the key is correct.

