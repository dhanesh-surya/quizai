# 🚀 DEPLOY TO RENDER.COM - Step-by-Step Guide

## ✅ Code Status
- **Git Status**: All changes committed and pushed
- **Latest Commit**: `acae189` - "Fix: Switch to PostgreSQL for persistent database on Render.com"
- **GitHub Repo**: https://github.com/dhanesh-surya/quizai.git

---

## 📋 Deployment Instructions

### **Option 1: Automatic Deployment (Recommended)**

If your Render.com service is connected to GitHub, it should **auto-deploy** when it detects the new commit!

#### Check Auto-Deployment Status:
1. Go to: https://dashboard.render.com/
2. Find your service: **quizai-d4ta** (or similar name)
3. Look for deployment status:
   - 🟡 **In Progress**: Wait for it to complete
   - 🟢 **Live**: Deployment successful
   - 🔴 **Failed**: Check logs and follow manual steps below

---

### **Option 2: Manual Deployment**

If auto-deployment didn't start, follow these steps:

#### Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**:
   - https://dashboard.render.com/

2. **Create New Database**:
   - Click **"New +"** button (top right)
   - Select **"PostgreSQL"**

3. **Configure Database**:
   - **Name**: `quizai-db`
   - **Database**: `quizai_database`
   - **User**: `quizai_user`
   - **Region**: Choose same as your web service (e.g., Oregon, Frankfurt, etc.)
   - **PostgreSQL Version**: 16 (or latest)
   - **Plan**: **Free**

4. **Create Database**:
   - Click **"Create Database"**
   - Wait for provisioning (~2-3 minutes)

5. **Copy Database URL**:
   - Once created, you'll see database details
   - Find **"Internal Database URL"** (looks like: `postgresql://user:pass@host/db`)
   - Click **copy icon** to copy it

#### Step 2: Link Database to Web Service

1. **Go to Your Web Service**:
   - From dashboard, click on your web service: **quizai-d4ta**

2. **Add Environment Variable**:
   - Click **"Environment"** tab (left sidebar)
   - Scroll to **"Environment Variables"** section
   - Click **"Add Environment Variable"**

3. **Add DATABASE_URL**:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL you copied
   - Click **"Save Changes"**

4. **Service Will Auto-Redeploy**:
   - Render will automatically rebuild and redeploy your app
   - This takes ~5-10 minutes

#### Step 3: Manual Deploy (If Needed)

If the service doesn't auto-redeploy:

1. **In your web service dashboard**:
   - Click **"Manual Deploy"** button (top right)
   - Select **"Deploy latest commit"**
   - Click **"Deploy"**

2. **Monitor Deployment**:
   - Watch the **"Logs"** tab
   - Look for:
     - `Installing dependencies...`
     - `Collecting static files...`
     - `Running migrations...`
     - `Starting server...`

---

## 🎯 Verify Deployment

### 1. Check Build Logs
In the **Logs** tab, you should see:
```
> pip install -r requirements.txt
> Successfully installed psycopg2-binary-2.9.9 dj-database-url-2.1.0
> python manage.py migrate
> Running migrations:
>   Applying contenttypes.0001_initial... OK
>   Applying auth.0001_initial... OK
>   ...
> Your deployment is live!
```

### 2. Test Your Application
1. **Visit**: https://quizai-d4ta.onrender.com/
2. **Register a new user**
3. **Login** with the new credentials
4. **Verify data persistence**:
   - Go back to Render dashboard
   - Click **"Manual Deploy"** → **"Deploy latest commit"** (to force restart)
   - Wait for deployment to complete
   - Try logging in again
   - ✅ **User should still exist!**

---

## 🔧 Alternative: Using render.yaml Blueprint

If you set up your service using `render.yaml`:

1. **Go to Blueprints**:
   - https://dashboard.render.com/blueprints

2. **Find Your Blueprint**:
   - Look for blueprint connected to your GitHub repo

3. **Sync/Apply Changes**:
   - Click **"Sync"** or **"Apply"** button
   - Render will automatically:
     - Create PostgreSQL database
     - Connect it to your web service
     - Deploy the latest code

---

## 🎨 Create Admin User (First Time Only)

After deployment completes, create a superuser:

1. **Open Shell**:
   - In your web service dashboard
   - Click **"Shell"** tab (left sidebar)
   - A terminal will open

2. **Run Commands**:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

3. **Follow Prompts**:
   - Email: your-email@example.com
   - Password: (enter password)
   - Password (again): (confirm)

4. **Access Admin**:
   - Visit: https://quizai-d4ta.onrender.com/admin/
   - Login with your superuser credentials

---

## 🐛 Troubleshooting

### Deployment Failed?

1. **Check Logs**:
   - Go to **Logs** tab
   - Look for error messages (usually in red)

2. **Common Issues**:

   **Error: "No module named 'psycopg2'"**
   - Solution: Make sure `requirements.txt` has `psycopg2-binary==2.9.9`
   - Redeploy

   **Error: "relation does not exist"**
   - Solution: Database not migrated
   - Check build logs for migration errors
   - Manually run migrations in Shell:
     ```bash
     cd backend && python manage.py migrate
     ```

   **Error: "could not connect to server"**
   - Solution: DATABASE_URL not set correctly
   - Verify the environment variable in **Environment** tab
   - Make sure you copied the **Internal** Database URL, not External

### Still Having Issues?

1. **Check Database Status**:
   - Go to your PostgreSQL database in dashboard
   - Make sure status is **"Available"** (green)

2. **Check Environment Variables**:
   - In web service → Environment tab
   - Verify `DATABASE_URL` exists and is not empty

3. **Force Clean Deploy**:
   - Delete the service
   - Create new service from GitHub repo
   - Use the updated `render.yaml` which will auto-create database

---

## 📊 Expected Result

After successful deployment:

✅ **Database**: PostgreSQL instance running (Free plan)
✅ **Web Service**: Connected to database via DATABASE_URL
✅ **Data Persistence**: Users, passwords, and all data survive restarts
✅ **Auto-Migrations**: Database schema updates automatically on deploy
✅ **Static Files**: All CSS/JS served correctly

---

## 🔗 Important URLs

- **Your Live App**: https://quizai-d4ta.onrender.com/
- **Admin Panel**: https://quizai-d4ta.onrender.com/admin/
- **Render Dashboard**: https://dashboard.render.com/
- **GitHub Repo**: https://github.com/dhanesh-surya/quizai

---

## 💡 Pro Tips

1. **Free Tier Limitations**:
   - Free services sleep after 15 mins of inactivity
   - First request after sleep takes ~30 seconds
   - Database has 1GB storage limit

2. **Keep Service Awake**:
   - Use a service like UptimeRobot to ping your app every 5-10 mins

3. **Monitor Database Usage**:
   - Check database dashboard for storage usage
   - Free tier = 1GB max

4. **Backup Data**:
   - Render auto-backups on Free tier (7 days retention)
   - For manual backup: `pg_dump` via Shell

---

**Your code is ready! Follow the steps above to complete deployment.** 🚀
