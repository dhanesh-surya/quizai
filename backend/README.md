# Django Backend Setup Guide

## 📋 Overview

This Django backend provides a complete REST API for the MindSpark AI Quiz application, including:
- User authentication with token-based auth
- Quiz generation using Gemini AI
- Quiz storage and retrieval
- Quiz attempt tracking and scoring
- Admin dashboard for analytics
- User profile and statistics

## 🚀 Quick Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Edit `.env` file and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

###6. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow  the prompts to create an admin account.

### 7. Run Development Server

```bash
python manage.py runserver 8000
```

The backend API will be available at `http://localhost:8000/`

## 📡 API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register/`
- Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "first_name": "John",
  "admin_code": "admin123"  // Optional, for admin registration
}
```
- Response:
```json
{
  "token": "abc123...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John",
    "is_admin": false
  }
}
```

#### Login
- **POST** `/api/auth/login/`
- Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Logout
- **POST** `/api/auth/logout/`
- Headers: `Authorization: Token abc123...`

#### Get Current User
- **GET** `/api/auth/me/`
- Headers: `Authorization: Token abc123...`

### Quiz Operations

#### Generate Quiz
- **POST** `/api/quiz/generate/`
- Headers: `Authorization: Token abc123...`
- Body:
```json
{
  "topic": "JavaScript",
  "difficulty": "Medium",
  "count": 10,
  "language": "en"
}
```

#### Submit Quiz
- **POST** `/api/quiz/submit/`
- Headers: `Authorization: Token abc123...`
- Body:
```json
{
  "quiz_id": 1,
  "answers": [
    {"question_id": 1, "selected_option": 2},
    {"question_id": 2, "selected_option": 0}
  ]
}
```

#### Get My Quizzes
- **GET** `/api/quizzes/my_quizzes/`
- Headers: `Authorization: Token abc123...`

#### Get Quiz Details
- **GET** `/api/quizzes/{id}/`
- Headers: `Authorization: Token abc123...`

### Quiz Attempts

#### Get My Quiz History
- **GET** `/api/attempts/my_history/`
- Headers: `Authorization: Token abc123...`

#### Get Quiz Statistics
- **GET** `/api/attempts/stats/`
- Headers: `Authorization: Token abc123...`

### Admin

#### Get Admin Dashboard
- **GET** `/api/admin/dashboard/`
- Headers: `Authorization: Token abc123...`
- Note: Requires admin privileges

## 🗄️ Database Models

### User Profile
- Extended user model with quiz statistics
- Admin flag for admin users
- Auto-calculated stats (average score, best score, etc.)

### Quiz
- Stores generated quizzes
- Links to user who created it
- Contains topic, difficulty, language

### Question
- Multiple choice questions
- Part of a quiz
- Has 4 options and correct answer index

### QuizAttempt
- Records when a user takes a quiz
- Stores score and percentage
- Links to quiz and user

### UserAnswer
- Individual answers to quiz questions
- Tracks whether answer was correct

## 🎨 Django Admin

Access the admin panel at `http://localhost:8000/admin/`

Features:
- View all users and their profiles
- Browse all quizzes and questions
- See quiz attempts and scores
- Analytics on user performance
- Inline editing of questions within quizzes

## 🔐 Authentication

This API uses **Token Authentication**. After login/register, include the token in all subsequent requests:

```
Authorization: Token your_token_here
```

The frontend should store this token (e.g., in localStorage) and include it in all API calls.

## 📊 Admin vs Regular Users

**Regular Users:**
- Can create quizzes
- Can view only their own quizzes
- Can view only their own quiz attempts
- Limited dashboard access

**Admin Users:**
- Can view ALL quizzes
- Can view ALL quiz attempts
- Full admin dashboard access with analytics
- Can manage users via Django admin panel

To make a user admin, either:
1. Use admin code `admin123` during registration
2. Set `is_admin=True` in UserProfile via Django admin

## ⚙️ Configuration

### Change Database

Edit `settings.py` to use PostgreSQL, MySQL, etc.:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'quiz_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS Settings

For production, update `CORS_ALLOWED_ORIGINS` in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
]
```

## 🧪 Testing the API

You can test the API using:

1. **cURL**:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

2. **Postman** or **Insomnia**
3. **Django REST Framework's browsable API** - just visit the endpoints in your browser

## 📦 Production Deployment

1. Set `DEBUG=False` in settings
2. Use a production database (PostgreSQL recommended)
3. Set up proper `ALLOWED_HOSTS`
4. Use environment variables for secrets
5. Set up static file serving
6. Use a production WSGI server (Gunicorn, uWSGI)
7. Set up HTTPS
8. Configure proper CORS settings

Example production setup with Gunicorn:
```bash
pip install gunicorn
gunicorn mindspark_backend.wsgi:application --bind 0.0.0.0:8000
```

## 🐛 Troubleshooting

### Issue: ModuleNotFoundError
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Issue: Database errors
- Run migrations: `python manage.py migrate`
- Check database configuration in settings.py

### Issue: CORS errors from frontend
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Ensure frontend URL is listed

### Issue: Token authentication not working
- Ensure token is included in request headers
- Token format: `Authorization: Token abc123...`

## 📝 Next Steps

1. Update `.env` with your Gemini API key
2. Run the setup commands above
3. Create a superuser for admin access
4. Test the API endpoints
5. Integrate with React frontend

For frontend integration, update the React app to call these API endpoints instead of using localStorage.
