#!/bin/bash
# Manual superuser creation script for Render.com Shell
# Run this if automatic creation fails

echo "========================================="
echo "🔧 Manual Superuser Setup for Render.com"
echo "========================================="
echo ""

# Navigate to backend directory
cd backend

echo "📋 Step 1: Running migrations..."
python manage.py migrate

echo ""
echo "👤 Step 2: Creating superuser..."
python manage.py create_default_superuser

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Admin credentials:"
echo "  URL:      https://quizai-d4ta.onrender.com/admin/"
echo "  Email:    admin@quizai.com"
echo "  Username: admin"
echo "  Password: QuizAI@Admin2026"
echo ""
echo "Try logging in now!"
