@echo off
echo ========================================
echo MindSpark AI Quiz - Backend Setup
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
echo ✓ Virtual environment created
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate
echo ✓ Virtual environment activated
echo.

echo Step 3: Installing dependencies...
pip install -r requirements.txt
echo ✓ Dependencies installed
echo.

echo Step 4: Running migrations...
python manage.py makemigrations
python manage.py migrate
echo ✓ Database migrations completed
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file and add your GEMINI_API_KEY
echo 2. Create admin user: python manage.py createsuperuser
echo 3. Start server: python manage.py runserver 8000
echo.
echo Press any key to exit...
pause > nul
