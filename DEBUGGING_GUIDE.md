# 🔧 Fixing "Invalid Token" Error

## The Issue
You're getting an "Invalid token" error when trying to login or sign up.

## ✅ What I've Done

### 1. Added Better Error Logging
- Updated `apiService.ts` to log all API requests and responses
- Now you can see exactly what's happening in the browser console

### 2. Updated CORS Settings
- Added support for both port 3000 and 5173 (Vite's default)
- Added all necessary CORS headers and methods

### 3. Created API Test Page
- Created `api-test.html` to test the backend directly
- This will help us identify if the issue is with the backend or frontend

## 🔍 How to Debug

### Step 1: Check Browser Console
1. Open the app at http://localhost:3000
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Try to login/register
5. Look for the API request logs - they will show:
   - The URL being called
   - The response status
   - Any error messages

### Step 2: Test Backend Directly
1. Open `api-test.html` in your browser (just double-click it)
2. Click "Test Register" to create a new user
3. Check if it works

### Step 3: Check Backend Server
Make sure the backend is running on port 8000:
```bash
# You should see this running:
python manage.py runserver 8000
```

Visit: http://localhost:8000/api/auth/register/
- If you see a Django REST framework page, the backend is working

## 🎯 Most Likely Causes

### 1. **Wrong Port**
The frontend might be running on port 5173 (Vite) instead of 3000.
- Check which port shows in your terminal when you run `npm run dev`
- The URL should match what's in CORS settings

### 2. **Backend Not Running**
- Make sure `python manage.py runserver 8000` is running
- Check http://localhost:8000/admin to see if Django is responding

### 3. **CSRF Token Issue**
- Django might be requiring CSRF tokens
- The updated settings should fix this

## 🚀 Quick Fix Steps

### Option 1: Restart Both Servers
```bash
# Stop both servers (Ctrl+C)

# Terminal 1 - Backend
cd backend
python manage.py runserver 8000

# Terminal 2 - Frontend  
npm run dev
```

### Option 2: Check the Actual Port
Look at your terminal where `npm run dev` is running.
It should say something like:
```
VITE v6.4.1  ready in 3014 ms
➜  Local:   http://localhost:3000/
```

If it says port 5173, that's fine - I've already added it to CORS settings.

### Option 3: Test with the Test Page
1. Open `api-test.html` in your browser
2. Click "Test Register"
3. If this works, the backend is fine
4. If this fails, there's a backend issue

## 📝 What to Check

Open browser console (F12) and look for:
```
API Request: { url: "http://localhost:8000/api/auth/register/", ... }
API Response: { status: 201, ok: true }
```

Or errors like:
```
API Error Data: { detail: "..." }
```

## 🔧 Next Steps

1. **Check the browser console** - This will show the exact error
2. **Try the test page** - This will confirm if backend works
3. **Share the console error** - Tell me what error you see

The updated code now has detailed logging, so we can see exactly what's failing!

---

**After you try logging in again, please:**
1. Open browser console (F12)
2. Look for the red error messages
3. Tell me what it says

This will help me fix the exact issue! 🎯
