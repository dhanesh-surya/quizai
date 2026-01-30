# Render.com Deployment Fix - JWT Module Error

## Problem
The deployment on Render.com was failing with the error:
```
ModuleNotFoundError: No module named 'jwt'
```

This occurred because `django-allauth` requires the `PyJWT` library to handle Google OAuth2 authentication, but the dependency wasn't being installed correctly.

## Root Causes Identified

1. **Missing PyJWT Version**: The `requirements.txt` had `PyJWT` listed but without a specific version, which could cause installation issues.

2. **Build Script Path Issues**: The `build.sh` script had a `cd backend || true` command that was causing path confusion when Render.com executed it.

3. **Python Version Mismatch**: The `render.yaml` specified Python 3.11.0, but the error logs showed Python 3.13.4 was being used.

4. **Development Server in Production**: The start script was using Django's development server (`runserver`) instead of a production-ready server like Gunicorn.

## Changes Made

### 1. Updated `backend/requirements.txt`
- Added specific version for `PyJWT==2.8.0` (compatible with Python 3.13 and django-allauth)
- Added `pycparser` as an explicit dependency (required by cryptography)

### 2. Updated `backend/build.sh`
- Removed the problematic `cd backend || true` command
- Added `pip install --upgrade pip` to ensure latest pip version
- Script now assumes it's running from the backend directory (as configured in render.yaml)

### 3. Updated `render.yaml`
- Added `rootDir: backend` to set the working directory
- Changed build command from `./backend/build.sh` to `bash build.sh`
- Changed start command from `./backend/start_dev.sh` to `bash start_dev.sh`
- Updated Python version from 3.11.0 to 3.13.4 to match what Render is actually using

### 4. Updated `backend/start_dev.sh`
- Replaced `python manage.py runserver` with `gunicorn mindspark_backend.wsgi:application`
- Configured Gunicorn with 4 workers for better performance
- Removed the `cd` command that was no longer needed

## Expected Result

After these changes, Render.com should:
1. Successfully install all Python dependencies including PyJWT
2. Complete the build process without errors
3. Start the application using Gunicorn (production-ready server)
4. Successfully handle Google OAuth2 authentication via django-allauth

## Deployment URL
https://quizai-d4ta.onrender.com

## Next Steps

1. Monitor the Render.com build logs to confirm successful deployment
2. Test the Google OAuth2 login functionality
3. Verify all application features are working correctly

## Verification Commands (Local Testing)

To test these changes locally:

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Verify PyJWT is installed
python -c "import jwt; print(jwt.__version__)"

# Test with Gunicorn
gunicorn mindspark_backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

## Commit Information
- **Commit Message**: "Fix Render.com deployment: Add PyJWT dependency and update build configuration"
- **Files Changed**: 
  - `backend/requirements.txt`
  - `backend/build.sh`
  - `backend/start_dev.sh`
  - `render.yaml`
