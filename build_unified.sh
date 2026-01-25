#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Backend Dependencies
echo "Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
cd ..

# Install Frontend Dependencies
echo "Installing Frontend Dependencies..."
npm install

# Build Frontend (Optional but good for checking errors)
# npm run build
