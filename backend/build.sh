#!/usr/bin/env bash
# Exit on error
set -o errexit

# Switch to backend directory (if not already there)
cd backend || true

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate
