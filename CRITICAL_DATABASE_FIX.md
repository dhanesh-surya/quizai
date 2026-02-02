# 🚨 CRITICAL: Users Deleted After Render Restart - FIX

## ❌ The Problem:

**Users disappear after each Render restart!**
- Register user → Works
- Render restarts → User gone
- Cannot login with previous credentials

**Root Cause:** Database data is NOT persisting because:
- PostgreSQL database not connected properly
- OR DATABASE_URL environment variable not set
- App is using SQLite (which is ephemeral on Render)

---

## ✅ SOLUTION: Verify & Fix Database Connection

### **Step 1: Check if PostgreSQL Database Exists**

1. **Go to Render Dashboard**
   👉 https://dashboard.render.com/

2. **Click "Databases" in sidebar**

3. **Look for PostgreSQL database:**
   - Should be named: `quizai-db` or similar
   - Status should be: **Available** (green)

**If database doesn't exist:**
- You MUST create it (see Step 4 below)

**If database exists:**
- Continue to Step 2

---

### **Step 2: Check DATABASE_URL Environment Variable**

1. **Go to your Web Service** (not database)
   - Dashboard → Web Services → Click your service

2. **Click "Environment" tab**

3. **Look for `DATABASE_URL` variable:**

**Is DATABASE_URL set?**
- ✅ **YES, it's there** → Go to Step 3
- ❌ **NO, missing** → Go to Step 4

---

### **Step 3: Verify DATABASE_URL is Correct**

**If DATABASE_URL exists, check its value:**

Should look like:
```
postgresql://user:password@host:5432/database_name
```

**Is it pointing to your PostgreSQL database?**
- ✅ **YES** → Database connected, skip to Step 5
- ❌ **NO or wrong** → Update it (see Step 4)

---

### **Step 4: Create/Connect PostgreSQL Database**

#### **Option A: Create NEW PostgreSQL Database**

1. **Dashboard → New + → PostgreSQL**

2. **Configure:**
   - **Name**: `quizai-db`
   - **Database Name**: `quizai_database`
   - **User**: `quizai_user`
   - **Region**: Same as your web service
   - **PostgreSQL Version**: 16
   - **Plan**: **Free**

3. **Click "Create Database"**
   - Wait 2-3 minutes for provisioning
   - Status will change to "Available"

4. **Get Database URL:**
   - On database page, find **"Connections"** section
   - Look for **"Internal Database URL"**
   - Click **copy icon** 📋
   - Example:
     ```
     postgresql://quizai_user:xxxxx@dpg-xxxx.oregon-postgres.render.com/quizai_database
     ```

---

#### **Option B: Link Existing Database**

If you already created a database:

1. **Go to your database page**
2. **Copy "Internal Database URL"**
3. **Go to your web service**
4. **Environment tab**
5. **Add/Update environment variable:**
   - **Key**: `DATABASE_URL`
   - **Value**: (paste the database URL)
6. **Click "Save Changes"**

---

### **Step 5: Add Required Environment Variables**

**In your Web Service → Environment tab, ensure these are set:**

| Key | Value | Required |
|-----|-------|----------|
| `DATABASE_URL` | postgresql://... | ✅ YES |
| `DJANGO_SUPERUSER_EMAIL` | admin@quizai.com | ✅ YES |
| `DJANGO_SUPERUSER_USERNAME` | admin | ✅ YES |
| `DJANGO_SUPERUSER_PASSWORD` | QuizAI@Admin2026 | ✅ YES |
| `DJANGO_SETTINGS_MODULE` | mindspark_backend.settings | ✅ YES |
| `PYTHON_VERSION` | 3.13.4 | ✅ YES |

**Click "Save Changes"** after adding any missing variables.

---

### **Step 6: Force Redeploy**

After setting DATABASE_URL:

1. **In your web service**
2. **Click "Manual Deploy"** (top right)
3. **Select "Clear build cache & deploy"**
4. **Click "Deploy"**

**This will:**
- ✅ Connect to PostgreSQL
- ✅ Run migrations (create tables)
- ✅ Create superuser
- ✅ All data will persist!

---

### **Step 7: Verify Database Connection**

**After deployment completes (~10-15 min):**

1. **Check Logs** (Logs tab):
   ```
   Look for:
   ✅ Connecting to PostgreSQL...
   ✅ Running migrations...
   ✅ Operations to perform: 50 migrations
   ✅ Applying auth.0001_initial... OK
   ✅ Creating default superuser...
   ✅ [SUCCESS] Superuser "admin" created successfully!
   ✅ Your service is live!
   ```

2. **Check for DATABASE_URL in logs:**
   - Should NOT see: "Using SQLite"
   - SHOULD see: PostgreSQL connection messages

---

### **Step 8: Test Data Persistence**

1. **Register a new user:**
   - Go to: https://quizai-d4ta.onrender.com/register/
   - Create account: testuser / TestPass123!
   - Login successfully

2. **Force restart (simulate the issue):**
   - Go to Render dashboard
   - Manual Deploy → Deploy latest commit
   - Wait for redeploy

3. **Try logging in again:**
   - Go to: https://quizai-d4ta.onrender.com/login/
   - Username: testuser
   - Password: TestPass123!
   - ✅ **Should work!** User persists!

---

## 🔍 How to Check Which Database You're Using

### **Method 1: Check Logs**

Look in deployment logs for:

**Using SQLite (BAD):**
```
DATABASES = {'ENGINE': 'django.db.backends.sqlite3'}
```

**Using PostgreSQL (GOOD):**
```
Connecting to PostgreSQL...
DATABASE_URL detected
```

### **Method 2: Check Settings**

Your `settings.py` checks `DATABASE_URL`:
- If `DATABASE_URL` exists → PostgreSQL ✅
- If `DATABASE_URL` missing → SQLite ❌ (ephemeral!)

---

## 🎯 Quick Diagnosis Checklist

Run through this:

- [ ] PostgreSQL database created on Render?
- [ ] Database status is "Available" (green)?
- [ ] `DATABASE_URL` environment variable set?
- [ ] `DATABASE_URL` points to PostgreSQL database?
- [ ] Redeployed after setting `DATABASE_URL`?
- [ ] Logs show "PostgreSQL" not "SQLite"?
- [ ] Migrations ran successfully?
- [ ] Superuser created during build?
- [ ] Test user persists after restart?

**All checked?** → Data will persist! ✅

---

## 🐛 Common Issues & Fixes

### **Issue: "Role does not exist"**
**Cause:** Database URL has wrong username
**Fix:** Copy Internal Database URL again from database page

### **Issue: "Password authentication failed"**
**Cause:** Database URL has wrong password
**Fix:** Use Internal Database URL, not External

### **Issue: "Connection refused"**
**Cause:** Using External URL instead of Internal
**Fix:** Make sure to use **Internal Database URL**

### **Issue: Still using SQLite**
**Cause:** DATABASE_URL not set or typo in name
**Fix:** 
- Check exact spelling: `DATABASE_URL` (all caps)
- No spaces before/after
- Save changes and redeploy

---

## 📊 What Should Happen After Fix

**Before Fix (SQLite - Ephemeral):**
```
1. User registers → Saved to SQLite (in container)
2. Render restarts → Container destroyed
3. SQLite file deleted → All users gone!
4. User tries to login → "Invalid username" ❌
```

**After Fix (PostgreSQL - Persistent):**
```
1. User registers → Saved to PostgreSQL (external)
2. Render restarts → Container destroyed
3. PostgreSQL unaffected → Users still there!
4. User tries to login → Success! ✅
```

---

## ⚡ IMMEDIATE ACTION REQUIRED

**Do this NOW to fix the issue:**

1. **Dashboard** → **Databases**
   - Check if PostgreSQL exists

2. **If NO database:**
   - Create one (Free plan)
   - Get Internal Database URL

3. **Web Service** → **Environment**
   - Add `DATABASE_URL` = (paste database URL)

4. **Save Changes**

5. **Manual Deploy** → **Clear build cache & deploy**

6. **Wait 15 minutes**

7. **Test:**
   - Register user
   - Restart service
   - Login again → Should work!

---

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com/
- **Create Database**: Dashboard → New + → PostgreSQL
- **Your Web Service**: Dashboard → Web Services
- **Environment Variables**: Web Service → Environment tab

---

## 📝 Expected Environment Variables

```bash
# Required for PostgreSQL persistence
DATABASE_URL=postgresql://quizai_user:xxxxx@dpg-xxxx.oregon-postgres.render.com/quizai_database

# Superuser credentials
DJANGO_SUPERUSER_EMAIL=admin@quizai.com
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=QuizAI@Admin2026

# Django settings
DJANGO_SETTINGS_MODULE=mindspark_backend.settings
PYTHON_VERSION=3.13.4
ALLOWED_HOSTS=*
```

---

**THE ISSUE: DATABASE_URL is not set → using SQLite → data lost on each restart!**

**THE FIX: Create PostgreSQL + Set DATABASE_URL → persistent storage → data survives restarts!**

**Go to Render dashboard NOW and follow Step 4 to create/connect PostgreSQL database!** 🚀
