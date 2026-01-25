import urllib.request
import json
import urllib.error
import time
import random

suffix = int(time.time())
url = "http://localhost:8000/api/auth/register/"
data = {
    "username": f"debug_user_{suffix}",
    "email": f"debug{suffix}@example.com",
    "password": "password123",
    "first_name": "Debug"
}
headers = {'Content-Type': 'application/json'}
req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers)
print(f"Registering user: {data['username']}")
try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(e)
