#!/bin/bash
# Quick setup script - Run in Render Shell
cd backend && python manage.py migrate && python manage.py collectstatic --noinput && python manage.py create_default_superuser && echo "✅ Setup complete! Login at: https://quizai-d4ta.onrender.com/admin/ with admin@quizai.com / QuizAI@Admin2026"
