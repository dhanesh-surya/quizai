# How to Get Google OAuth2 Credentials

Follow these steps to generate the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` needed for Gmail registration.

### 1. Create a Project in Google Cloud Console
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown (top left) and select **New Project**.
3. Give it a name like `MindSpark-AI-Quiz` and click **Create**.
4. Ensure the new project is selected in the dropdown.

### 2. Configure OAuth Consent Screen
1. Navigate to **APIs & Services > OAuth consent screen** from the left sidebar.
2. Choose **External** (unless you have a Google Workspace organization) and click **Create**.
3. **App Information**: 
   - Fill in **App name** (e.g., MindSpark AI).
   - Select **User support email**.
   - Fill in **Developer contact information**.
4. Click **Save and Continue** until you reach the dashboard (you can skip Scopes and Test Users for now, but adding your own email as a Test User is recommended for development).

### 3. Create Credentials
1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. **Application type**: Select **Web application**.
4. **Name**: `MindSpark Development`.
5. **Authorized JavaScript origins**:
   - `http://127.0.0.1:8000`
   - `http://localhost:8000`
6. **Authorized redirect URIs**:
   - `http://127.0.0.1:8000/accounts/google/login/callback/`
   - `http://localhost:8000/accounts/google/login/callback/`
7. Click **Create**.

### 4. Copy Your Keys
A window will pop up with your **Client ID** and **Client Secret**.
1. Copy these values.
2. Open your `backend/.env` file.
3. Replace the placeholders with your actual keys:

```env
GOOGLE_CLIENT_ID=your-copied-client-id
GOOGLE_CLIENT_SECRET=your-copied-client-secret
```

### 5. (Important) Test Users
Since your app is in "Testing" status on Google, you **must** add your email address to the **Test users** list in the **OAuth consent screen** section, otherwise Google will block your login attempts with a "403 Access Denied" error.
