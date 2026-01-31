# 🔧 Render.com Database Persistence Fix

## Problem
Your app was using SQLite database which is **ephemeral** on Render.com - it gets deleted every time your app restarts or redeploys. This causes all user data (usernames, passwords, etc.) to be lost.

## Solution
We've configured your app to use **PostgreSQL** in production (Render.com) which provides **persistent storage**.

---

## 📋 Steps to Deploy with PostgreSQL on Render.com

### 1. Create a PostgreSQL Database on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** button → Select **PostgreSQL**
3. Configure your database:
   - **Name**: `quizai-database` (or any name you prefer)
   - **Database**: `quizai_db`
   - **User**: `quizai_user`
   - **Region**: Choose the same region as your web service
   - **Plan**: **Free** (or paid if you need more)
4. Click **Create Database**
5. **IMPORTANT**: After creation, copy the **Internal Database URL** (it looks like: `postgresql://user:password@host/database`)

### 2. Update Your Web Service Environment Variables

1. Go to your web service: `quizai-d4ta`
2. Click **Environment** tab
3. Add a new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the **Internal Database URL** you copied from step 1.5
4. Click **Save Changes**

### 3. Deploy Your Updated Code

#### Option A: Push to GitHub (Recommended)
```bash
cd d:\NewMCQ
git add .
git commit -m "Fix: Switch to PostgreSQL for persistent database"
git push origin main
```

Your Render app will automatically redeploy.

#### Option B: Manual Redeploy
1. Go to your Render dashboard
2. Click on your web service
3. Click **Manual Deploy** → **Deploy latest commit**

### 4. Run Database Migrations

After deployment completes:

1. Go to your Render web service dashboard
2. Click **Shell** tab (or use SSH)
3. Run these commands:
```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

This will:
- Create all necessary database tables in PostgreSQL
- Create a new admin user (follow the prompts)

---

## ✅ Verification

1. Visit your app: https://quizai-d4ta.onrender.com/login/
2. Register a new user or login
3. Restart your Render service manually (Settings → Manual Deploy)
4. Check if the user still exists after restart ✨

---

## 🔍 What Changed?

### 1. Updated `requirements.txt`
Added PostgreSQL support:
```
psycopg2-binary==2.9.9
dj-database-url==2.1.0
```

### 2. Updated `settings.py`
- Now automatically detects `DATABASE_URL` environment variable
- Uses PostgreSQL when deployed to Render.com
- Still uses SQLite for local development (no DATABASE_URL)

---

## 🚀 Local Development

Your local development is **unchanged**:
- Still uses SQLite (`db.sqlite3`)
- No need to install PostgreSQL locally
- Same workflow as before

---

## 📝 Notes

- **Free PostgreSQL on Render**: 
  - 1GB storage
  - Automatically backed up
  - Perfect for testing and small apps
  
- **Data Persistence**: 
  - All data is now saved permanently
  - Survives app restarts and redeployments
  - Database runs separately from your app
  
- **Security**:
  - Database credentials are in environment variables
  - Never commit `DATABASE_URL` to git

---

## ⚠️ Important

After setting this up, you'll need to:
1. **Re-register all users** (old SQLite data won't transfer)
2. **Recreate admin user** using `createsuperuser`
3. **Re-upload any content** (events, questions, etc.)

This is a one-time migration. After this, all data will persist permanently! 🎉
