# NOVA - Team Productivity Platform

This is a Full-Stack Project Management Application built as part of the internship assignment for Sankar Group.

## Tech Stack
*   **Frontend:** Next.js (React), Tailwind CSS
*   **Backend:** FastAPI (Python), SQLAlchemy
*   **Database:** PostgreSQL (configured via `.env`)
*   **Authentication:** JWT (JSON Web Tokens)

## Features
*   **Authentication:** User sign-up and login with JWT.
*   **Projects:** Create, view, and delete projects.
*   **Tasks (Kanban):** Create tasks within projects, and move them between "To Do", "In Progress", and "Done" statuses.

## How to Run Locally

### 1. Backend (FastAPI)
1. Navigate to the `backend` folder: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\Activate.ps1` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt` (Note: ensure you install FastAPI, SQLAlchemy, psycopg2, pyjwt, passlib, bcrypt)
5. Set up your PostgreSQL database and update the `DATABASE_URL` in `backend/.env`
6. Run the server: `uvicorn app.main:app --reload`
   * The API will run at `http://localhost:8000`
   * Swagger Docs are available at `http://localhost:8000/docs`

### 2. Frontend (Next.js)
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open your browser to `http://localhost:3000`

## Deployment
*   **Frontend:** Can be easily deployed to [Vercel](https://vercel.com/) by importing the GitHub repository and setting the root directory to `frontend`.
*   **Backend:** Can be deployed to [Render](https://render.com/) as a Web Service running Python.
