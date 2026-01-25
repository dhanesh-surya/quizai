#!/usr/bin/env bash
# Exit on error
set -o errexit

# Start Backend in Background
echo "Starting Backend..."
cd backend
# Use PORT environment variable specifically for backend or default to 8000
BACKEND_PORT=${PORT:-8000}
python manage.py runserver 0.0.0.0:$BACKEND_PORT &

# Save Backend PID
BACKEND_PID=$!

# Switch back to root
cd ..

# Start Frontend
echo "Starting Frontend..."
# Note: In a real single-container setup, you'd need a proxy or different ports.
# Assuming Render is configured to route traffic or this is for a specific 'monolith' setup attempt.
npm run dev

# Wait for processes
wait $BACKEND_PID
