# How Your Application Runs on Render

## The Concept
On your local computer, you run `npm run dev` manually. When you close the terminal, the site stops.

On Render (Cloud Hosting), it works differently:
1.  **Deployment**: When you push code, Render creates a virtual computer (container).
2.  **Start**: It automatically runs your `Start Command` (`npm run dev` / `runserver`).
3.  **Loop**: It keeps that command running 24/7 (or until it sleeps on the free tier).

## The Flow
1.  **User Visits URL** (`https://your-frontend.onrender.com`)
    *   The **Frontend Service** (which is already running `npm run dev`) immediately responds with the React App.
2.  **Page Loads**
    *   The React App loads in the user's browser.
3.  **Data Fetching**
    *   The React App sends a request to `https://your-backend.onrender.com`.
    *   The **Backend Service** (which is already running `python runserver`) receives the request and sends back data.

## Automatic "Wake Up" (Free Tier)
*   **Active**: If users are visiting, everything stays running fast.
*   **Inactive**: If no one visits for 15 mins, Render pauses the server to save money.
*   **Wake Up**: The next time someone visits, Render detects it and automatically runs your start command again. This causes a ~45 second delay for the first person, but works normally afterwards.
