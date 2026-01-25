# Deploying MindSpark AI Quiz to Render.com (Dev Mode)

This guide helps you deploy using `npm run dev` and `python manage.py runserver`, as requested.

## 1. Backend (Web Service)

*   **Build Command**: `./backend/build.sh`
*   **Start Command**: `./backend/start_dev.sh`
    *   *Note: I created this script to automatically handle the `0.0.0.0:$PORT` binding required by Render.*
*   **Environment Variables**:
    *   `Note`: Add `DEBUG=True` if you want to see detailed errors (Caution: insecure).

## 2. Frontend (Web Service)

**Important**: Select **Web Service**, NOT Static Site, because `npm run dev` requires a running Node server.

*   **Build Command**: `npm install`
*   **Start Command**: `npm run dev`
*   **Environment Variables**:
    *   `VITE_API_BASE_URL`: The full URL of your backend (e.g., `https://quizmeai-0re6.onrender.com/api`)

## 3. Verify
After deploying both, ensure your Frontend Environment Variable `VITE_API_BASE_URL` points to the *exact* backend URL.
