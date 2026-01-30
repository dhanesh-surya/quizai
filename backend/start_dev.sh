#!/usr/bin/env bash
# Exit on error
set -o errexit

# Use the PORT environment variable provided by Render, default to 8000
PORT=${PORT:-8000}

# Start gunicorn
gunicorn mindspark_backend.wsgi:application --bind 0.0.0.0:$PORT --workers 4
