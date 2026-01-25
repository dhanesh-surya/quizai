# Deploying MindSpark AI Quiz to Render.com

This guide will help you deploy both your Django Backend and React Frontend to Render.com.

## Prerequisites

1.  **GitHub Account** with this repository pushed (Completed).
2.  **Render.com Account** (Create one if you don't have it).

---

## Part 1: Deploying the Backend (Web Service)

1.  **Create New Web Service**:
    *   Go to your [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository (`quizai`).

2.  **Configure Service**:
    *   **Name**: `mindspark-backend` (or similar)
    *   **Region**: Choose the one closest to you (e.g., Singapore, Oregon).
    *   **Branch**: `main`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `./backend/build.sh`
    *   **Start Command**: `cd backend && gunicorn mindspark_backend.wsgi:application`

3.  **Environment Variables**:
    *   Add the following Environment Variables in the "Environment" tab:
        *   `PYTHON_VERSION`: `3.11.0` (or your local version)
        *   `DJANGO_SECRET_KEY`: (Generate a strong random string)
        *   `GEMINI_API_KEY`: (Copy your Gemini API Key)
        *   `ALLOWED_HOSTS`: `*` (or your render URL after creation, e.g., `mindspark-backend.onrender.com`)
        *   `CSRF_TRUSTED_ORIGINS`: `https://YOUR-FRONTEND-URL.onrender.com` (You can update this AFTER deploying the frontend)

4.  **Create Web Service**:
    *   Click **Create Web Service**.
    *   Wait for the build to finish. Once "Live", copy the **Backend URL** (e.g., `https://mindspark-backend.onrender.com`).

---

## Part 2: Deploying the Frontend (Static Site)

1.  **Create New Static Site**:
    *   Go to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Static Site**.
    *   Connect the **same** GitHub repository (`quizai`).

2.  **Configure Site**:
    *   **Name**: `mindspark-frontend`
    *   **Branch**: `main`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`

3.  **Environment Variables**:
    *   Add the following Environment Variable:
        *   `VITE_API_BASE_URL`: **PASTE YOUR BACKEND URL HERE** + `/api`
            *   Example: `https://mindspark-backend.onrender.com/api`
            *   **Note**: Ensure there is no trailing slash after `/api`.

4.  **Create Static Site**:
    *   Click **Create Static Site**.
    *   Wait for the deployment to finish.

---

## Part 3: Final Integration

1.  **Update Backend CSRF Settings**:
    *   Copy your **Frontend URL** (e.g., `https://mindspark-frontend.onrender.com`).
    *   Go back to your **Backend Service** -> **Environment**.
    *   Edit/Add `CSRF_TRUSTED_ORIGINS` and set it to your frontend URL.
        *   Example: `https://mindspark-frontend.onrender.com`
    *   **Save Changes**. This will trigger a quick redeploy of the backend.

2.  **Verify**:
    *   Open your Frontend URL.
    *   Try to Register/Login.
    *   If you see "Network Error" or "Failed to Fetch", check:
        *   Did you set `VITE_API_BASE_URL` correctly?
        *   Is the Backend "Live"?
        *   Check the browser console (F12) for errors.

## Troubleshooting

-   **502 Bad Gateway**: This usually means the backend failed to start. Check the "Logs" tab in Render for Python errors.
-   **CORS Errors**: Ensure `CSRF_TRUSTED_ORIGINS` matches your frontend URL exactly (including `https://`).
