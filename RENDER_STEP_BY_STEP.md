# Step-by-Step Guide for Render.com

This guide assumes you want to deploy using `npm run dev` and `python manage.py runserver` (Dev Mode).

## Prerequisites
*   You have pushed your latest code to GitHub (I have done this for you).
*   You have a Render.com account.

---

## 1. Deploy the Backend (Python Service)

1.  **Dashboard**: Go to [dashboard.render.com](https://dashboard.render.com).
2.  **New**: Click **New +** -> **Web Service**.
3.  **Source**: Connect your `quizai` GitHub repository.
4.  **Configuration**:
    *   **Name**: `quiz-backend`
    *   **Runtime**: **Python 3**
    *   **Build Command**: `./backend/build.sh`
    *   **Start Command**: `./backend/start_dev.sh`
        *   *(This uses the script I made to run `python manage.py runserver` on the correct port)*
5.  **Environment Variables** (Scroll down to "Environment"):
    *   Click **Add Environment Variable** for each:
    *   `PYTHON_VERSION`: `3.11.0`
    *   `GEMINI_API_KEY`: *(Paste your Google Gemini API Key)*
    *   `ALLOWED_HOSTS`: `*`
6.  **Create**: Click **Create Web Service**.
7.  **Wait**: Wait for it to show "Live". **Copy the Backend URL** (e.g., `https://quiz-backend.onrender.com`).

---

## 2. Deploy the Frontend (Node Service)

*Note: Since you want "npm run dev", use a Web Service, NOT a Static Site.*

1.  **Dashboard**: Click **New +** -> **Web Service**.
2.  **Source**: Connect the **same** `quizai` repository.
3.  **Configuration**:
    *   **Name**: `quiz-frontend`
    *   **Runtime**: **Node**
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm run dev`
        *   *(I configured vite to work with this command automatically)*
4.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: **PASTE YOUR BACKEND URL** from step 1, followed by `/api`
        *   Example: `https://quiz-backend.onrender.com/api`
5.  **Create**: Click **Create Web Service**.

---

## 3. Final Connection

1.  **Get Frontend URL**: Once the Frontend is "Live", copy its URL (e.g., `https://quiz-frontend.onrender.com`).
2.  **Update Backend**:
    *   Go back to your **Backend Service** settings.
    *   Go to **Environment**.
    *   Add/Update `CSRF_TRUSTED_ORIGINS`: `https://quiz-frontend.onrender.com`
        *   *(Remove trailing slash if present)*
    *   **Save**. This will restart the backend.

## Done!
Visit your Frontend URL. It should load the React app (via `npm run dev`) and talk to the Python Backend (via `runserver`).
