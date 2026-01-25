#!/usr/bin/env bash
# Exit on error
set -o errexit

cd "$(dirname "$0")"

# Use the PORT environment variable provided by Render, default to 8000
PORT=${PORT:-8000}
python manage.py runserver 0.0.0.0:$PORT
