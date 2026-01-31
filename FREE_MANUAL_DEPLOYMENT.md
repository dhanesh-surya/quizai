# 🆓 FREE DEPLOYMENT WITHOUT PAYMENT INFO (Manual Setup)

## ⚠️ Blueprint Requires Payment Info

If you see: "Your render.yaml services require payment information on file"

**Solution:** Skip Blueprint and create services manually - still 100% FREE!

---

## 🚀 FREE MANUAL DEPLOYMENT (Step-by-Step)

### **Step 1: Create PostgreSQL Database (Free)**

1. **Go to Render Dashboard**
   👉 https://dashboard.render.com/

2. **Click "New +"** (top right)

3. **Select "PostgreSQL"**

4. **Configure Database:**
   - **Name**: `quizai-db`
   - **Database Name**: `quizai_database`
   - **User**: `quizai_user`
   - **Region**: Oregon (US West) or closest to you
   - **PostgreSQL Version**: 16
   - **Datadog API Key**: Leave blank
   - **Plan**: **Free** ← Make sure this is selected!

5. **Click "Create Database"**
   - Wait 2-3 minutes for provisioning
   - Status will change to "Available" (green)

6. **Copy Database URL:**
   - Once created, scroll to **"Connections"** section
   - Find **"Internal Database URL"**
   - Click the **copy icon** 📋
   - **Save this somewhere** - you'll need it in Step 2!

---

### **Step 2: Create Web Service (Free)**

1. **Click "New +"** again

2. **Select "Web Service"**

3. **Connect Repository:**
   - Click **"Connect GitHub"** (if not already connected)
   - Select repository: **quizai**
   - If you don't see it, authorize Render to access your repos

4. **Configure Service:**
   
   **Basic Settings:**
   - **Name**: `quizai-backend` (or any name you like)
   - **Region**: **Same as database** (Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend` ← Important!
   - **Runtime**: **Python 3**

   **Build & Deploy Settings:**
   - **Build Command**: `bash build.sh`
   - **Start Command**: `bash start_dev.sh`

5. **Scroll Down - Don't Click Create Yet!**

---

### **Step 3: Add Environment Variables**

Still on the same page, scroll to **"Environment Variables"** section:

**Click "Add Environment Variable"** for each of these:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.13.4` |
| `DJANGO_SETTINGS_MODULE` | `mindspark_backend.settings` |
| `ALLOWED_HOSTS` | `*` |
| `DATABASE_URL` | **Paste the URL you copied in Step 1** |
| `DJANGO_SUPERUSER_EMAIL` | `admin@quizai.com` |
| `DJANGO_SUPERUSER_USERNAME` | `admin` |
| `DJANGO_SUPERUSER_PASSWORD` | `QuizAI@Admin2026` |
| `GEMINI_API_KEY` | `AIzaSyBxh0DL5762JnNgb6duv1auLWD153dAnqc` |

**How to add each one:**
1. Click "+ Add Environment Variable"
2. Type the Key
3. Type or paste the Value
4. Repeat for all 8 variables

---

### **Step 4: Select Free Plan**

Scroll down to **"Instance Type"**:
- **Plan**: Select **"Free"** ← Make sure this is selected!
- This gives you:
  - ✅ 512 MB RAM
  - ✅ 0.1 CPU
  - ✅ Good enough for testing!

---

### **Step 5: Create Service**

1. **Review your settings:**
   - ✅ Root Directory: `backend`
   - ✅ Build Command: `bash build.sh`
   - ✅ Start Command: `bash start_dev.sh`
   - ✅ All 8 environment variables added
   - ✅ Free plan selected

2. **Click "Create Web Service"**

3. **Deployment Starts Automatically!**
   - You'll see build logs streaming
   - This takes ~10-15 minutes

---

### **Step 6: Monitor Deployment**

Watch the logs for these key messages:

```
✅ Installing dependencies...
✅ Collecting static files...
✅ Running migrations...
✅ Creating default superuser...
✅ Superuser "admin" created successfully!
   Email: admin@quizai.com
✅ Build successful!
✅ Starting server...
✅ Your service is live!
```

---

### **Step 7: Get Your URL**

Once deployment completes:
1. At the top of the page, you'll see your service URL
2. It will be something like: `https://quizai-backend-xxxx.onrender.com`
3. **Save this URL!**

---

### **Step 8: Test Admin Login**

1. **Visit your admin panel:**
   - Your URL + `/admin/`
   - Example: `https://quizai-backend-xxxx.onrender.com/admin/`

2. **Login with:**
   - **Email**: `admin@quizai.com`
   - **Password**: `QuizAI@Admin2026`

3. **✅ Success!**
   - You should see the Django admin dashboard
   - Admin account was created automatically during build!

---

## ✅ Summary of What You Created

| Resource | Type | Cost |
|----------|------|------|
| PostgreSQL Database | `quizai-db` | **FREE** |
| Web Service | Your app | **FREE** |
| **Total Monthly Cost** | | **$0.00** |

**Limits on Free Tier:**
- Web service sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds to wake up
- Database: 1GB storage, 90 days retention
- Perfect for testing and small projects!

---

## 🔄 What Happens Automatically

Even with manual setup, the build script runs automatically:

1. **On Every Deploy:**
   - Installs dependencies
   - Runs migrations
   - Collects static files
   - **Creates superuser** ← Automatic!

2. **Superuser Creation:**
   - Uses environment variables you set
   - Creates admin@quizai.com
   - Sets password: QuizAI@Admin2026
   - Only creates if doesn't exist

---

## 🎯 Environment Variables Explained

| Variable | Purpose |
|----------|---------|
| `PYTHON_VERSION` | Specifies Python 3.13.4 |
| `DJANGO_SETTINGS_MODULE` | Points to Django settings |
| `ALLOWED_HOSTS` | Allows all hosts (for testing) |
| `DATABASE_URL` | **PostgreSQL connection** ← Critical! |
| `DJANGO_SUPERUSER_EMAIL` | Admin email |
| `DJANGO_SUPERUSER_USERNAME` | Admin username |
| `DJANGO_SUPERUSER_PASSWORD` | Admin password |
| `GEMINI_API_KEY` | For AI quiz generation |

---

## 🐛 Troubleshooting

### **Error: "relation does not exist"**
**Cause:** DATABASE_URL not set or incorrect

**Fix:**
1. Go to service → **Environment** tab
2. Check `DATABASE_URL` is set correctly
3. Should start with: `postgresql://`
4. Redeploy: Manual Deploy → Deploy latest commit

---

### **Error: "No module named 'psycopg2'"**
**Cause:** Dependencies not installed

**Fix:**
1. Check `requirements.txt` includes `psycopg2-binary`
2. Redeploy with clear cache: Manual Deploy → Clear build cache & deploy

---

### **Admin Login Fails**
**Possible causes:**
1. Build hasn't completed yet
2. Environment variables not set
3. Superuser creation failed

**Fix:**
1. Check logs for "Superuser created successfully"
2. Verify environment variables in Environment tab
3. Try both email and username for login
4. Redeploy if needed

---

### **Service URL Shows 404**
**Cause:** Root directory might be wrong

**Fix:**
1. Settings → Build & Deploy
2. Verify **Root Directory** = `backend`
3. Save and redeploy

---

## 🔧 After Deployment

### **Update Your Code:**
1. Push changes to GitHub
2. Render auto-deploys (if enabled in Settings)
3. Or click "Manual Deploy" → "Deploy latest commit"

### **View Logs:**
- Click **"Logs"** tab
- See real-time application logs
- Debug issues

### **Update Environment Variables:**
- Click **"Environment"** tab
- Add, edit, or remove variables
- Click "Save" - service redeploys automatically

---

## 💡 Pro Tips

1. **Enable Auto-Deploy:**
   - Settings → Build & Deploy
   - Auto-Deploy: **Yes**
   - Every git push triggers deployment

2. **Custom Domain (Optional):**
   - Settings → Custom Domains
   - Add your own domain
   - Free HTTPS included!

3. **Monitor Usage:**
   - Dashboard shows usage stats
   - Free tier limits clearly marked

4. **Database Backups:**
   - Free tier: 7 days retention
   - Can download backups manually

---

## 📊 Comparison: Blueprint vs Manual

| Feature | Blueprint | Manual |
|---------|-----------|--------|
| **Payment Info Required** | Yes | **No** |
| **Setup Time** | 5 minutes | 10 minutes |
| **Still Free** | Yes | Yes |
| **Auto Superuser** | Yes | Yes |
| **Difficulty** | Easier | Easy |

**Recommendation:** Use manual setup if you don't want to add payment info!

---

## 🎊 Success Checklist

After completing all steps:

- [ ] PostgreSQL database created (Status: Available)
- [ ] Web service created (Status: Live)
- [ ] All 8 environment variables set
- [ ] Build completed successfully
- [ ] Logs show "Superuser created successfully"
- [ ] Can access main site URL
- [ ] Can login to /admin/
- [ ] ✅ Everything working!

---

## 🔗 Quick Reference

**After Setup:**
- **Dashboard**: https://dashboard.render.com/
- **Your Service**: Click on it to see logs, settings
- **Admin Login**: YourURL/admin/
- **Credentials**: admin@quizai.com / QuizAI@Admin2026

---

**Follow these steps and you'll have a fully working app - 100% FREE, no payment info needed!** 🚀
