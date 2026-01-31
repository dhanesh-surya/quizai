#!/bin/bash
# =============================================================================
# Render.com Setup Script
# =============================================================================
# This script sets up the Django application on Render.com
# Run this in Render Shell after first deployment
#
# Usage: bash setup_render.sh
# =============================================================================

set -e  # Exit on any error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 QuizAI - Render.com Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Navigate to backend directory
echo "📁 Navigating to backend directory..."
cd backend || { echo "❌ Error: backend directory not found"; exit 1; }
echo "✅ In backend directory"
echo ""

# Check Python version
echo "🐍 Checking Python version..."
python --version
echo ""

# Install/upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip --quiet
echo "✅ Pip upgraded"
echo ""

# Install dependencies (in case they're not installed)
echo "📦 Installing dependencies..."
pip install -r requirements.txt --quiet
echo "✅ Dependencies installed"
echo ""

# Run database migrations
echo "🗄️  Running database migrations..."
python manage.py migrate --noinput
echo "✅ Migrations completed"
echo ""

# Collect static files
echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput --clear
echo "✅ Static files collected"
echo ""

# Create default superuser
echo "👤 Creating default superuser..."
python manage.py create_default_superuser
echo ""

# Check if superuser was created
echo "🔍 Verifying superuser creation..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
admin_user = User.objects.filter(email='admin@quizai.com').first()
if admin_user and admin_user.is_superuser:
    print('✅ Superuser verified: admin@quizai.com')
else:
    print('⚠️  Warning: Superuser may not be created correctly')
"
echo ""

# Populate homepage content (if command exists)
echo "📄 Checking for homepage content..."
if python manage.py help populate_homepage &> /dev/null; then
    echo "📄 Populating homepage content..."
    python manage.py populate_homepage
    echo "✅ Homepage content populated"
else
    echo "ℹ️  Homepage population command not found (skipping)"
fi
echo ""

# Display final status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your application is ready!"
echo ""
echo "📊 Admin Panel:"
echo "   URL:      https://quizai-d4ta.onrender.com/admin/"
echo "   Email:    admin@quizai.com"
echo "   Username: admin"
echo "   Password: QuizAI@Admin2026"
echo ""
echo "🏠 Main Site:"
echo "   URL: https://quizai-d4ta.onrender.com/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 You can now login and start using your application!"
echo ""
