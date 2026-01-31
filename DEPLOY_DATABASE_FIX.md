# Quick Start: Fixing Database Persistence ⚡

## What's the Problem?
Your Render.com app loses all data (users, passwords, etc.) when it restarts because it was using **SQLite** which is temporary on Render.

## What's the Solution?
We've configured your app to use **PostgreSQL** - a persistent database that keeps data forever!

---

## 🎯 Quick Setup (5 minutes)

### Step 1: Push Updated Code to GitHub
```bash
cd d:\NewMCQ
git add .
git commit -m "Fix: Add PostgreSQL for persistent database"
git push origin main
```

### Step 2: Deploy on Render
1. **Option A**: If you're using `render.yaml` (Blueprint):
   - Go to https://dashboard.render.com/blueprints
   - Click on your blueprint
   - Click **Sync** to redeploy with the new database configuration
   - Render will automatically create the PostgreSQL database!

2. **Option B**: Manual setup:
   - Create PostgreSQL database: https://dashboard.render.com/ → New + → PostgreSQL
   - Name: `quizai-db`, Plan: **Free**
   - Copy the **Internal Database URL**
   - Go to your web service → Environment
   - Add: `DATABASE_URL` = (paste the URL)
   - Your app will auto-redeploy

### Step 3: Test It! ✅
1. Visit https://quizai-d4ta.onrender.com/login/
2. Register a new user
3. Manually restart your service (Dashboard → Manual Deploy)
4. Login again - **user should still exist!** 🎉

---

## 📦 What We Changed

- ✅ Added PostgreSQL support to `requirements.txt`
- ✅ Updated `settings.py` to use PostgreSQL in production
- ✅ Added database configuration to `render.yaml`
- ✅ Your local dev still uses SQLite (no changes needed!)

---

## ⚠️ One-Time Migration Note

After switching to PostgreSQL, you'll need to:
- Re-register users (old SQLite data won't transfer)
- Recreate admin user: Run in Render Shell:
  ```bash
  cd backend && python manage.py createsuperuser
  ```

---

## 🆘 Need Help?

See the full guide: `RENDER_DATABASE_FIX.md`

**Database URL Format:**
```
postgresql://username:password@hostname:port/database
```

**Render gives you this automatically when you create a PostgreSQL database!**
