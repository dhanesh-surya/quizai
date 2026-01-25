import os

file_path = r'd:\vidmcq\backend\start_dev.sh'
content = b"""#!/usr/bin/env bash
# Exit on error
set -o errexit

cd "$(dirname "$0")"

# Use the PORT environment variable provided by Render, default to 8000
PORT=${PORT:-8000}
python manage.py runserver 0.0.0.0:$PORT
"""

with open(file_path, 'wb') as f:
    f.write(content.replace(b'\r\n', b'\n'))

print(f"Successfully rewrote {file_path} with LF line endings.")
