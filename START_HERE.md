# ⚡ START HERE - Automatic Deployment (No Shell Needed!)

## ⚠️ IMPORTANT: Blueprint Requires Payment Info

If you get "requires payment information":
**👉 Use Manual Setup Instead (Still FREE!)**
**See:** `FREE_MANUAL_DEPLOYMENT.md` for step-by-step guide

---

## 🎯 Quick Deploy - Choose Method:

### **Method A: Blueprint (Easiest, but requires payment info on file)**
1. Go to: https://dashboard.render.com/blueprints
2. Click **"New Blueprint Instance"**
3. Select repository: `dhanesh-surya/quizai`
4. Branch: `main`
5. Click **"Apply"**

**OR**

### **Method B: Manual Setup (100% FREE, no payment info needed) ⭐**
**👉 See detailed guide:** `FREE_MANUAL_DEPLOYMENT.md`

**Quick Summary:**
1. Create PostgreSQL database (free)
2. Create Web Service (free)
3. Set 8 environment variables
4. Deploy!

### **Step 2: Wait (~15 minutes)**
Render automatically:
- ✅ Creates PostgreSQL database
- ✅ Runs migrations
- ✅ Creates admin account
- ✅ Deploys your app

### **Step 3: Login!**
Visit: https://quizai-d4ta.onrender.com/admin/
- Email: `admin@quizai.com`
- Password: `QuizAI@Admin2026`

**Done!** 🎉

---

## 🔍 Alternative: Manual Setup (Without Blueprint)

If Blueprint doesn't work:

### **1. Create PostgreSQL Database**
- Dashboard → New + → PostgreSQL
- Name: `quizai-db`
- Plan: Free
- **Copy Internal Database URL**

### **2. Create Web Service**
- Dashboard → New + → Web Service
- Repository: `dhanesh-surya/quizai`
- Root Directory: `backend`
- Build Command: `bash build.sh`
- Start Command: `bash start_dev.sh`

### **3. Add Environment Variables**
In Environment tab, add:
- `DATABASE_URL` = (paste database URL)
- `DJANGO_SUPERUSER_EMAIL` = `admin@quizai.com`
- `DJANGO_SUPERUSER_USERNAME` = `admin`
- `DJANGO_SUPERUSER_PASSWORD` = `QuizAI@Admin2026`

### **4. Deploy**
- Click "Create Web Service"
- Wait for deployment
- Admin created automatically!

---

## ✅ Verify Deployment

Check logs for:
```
Creating default superuser...
✅ Superuser "admin" created successfully!
Your service is live!
```

Then test login at: https://quizai-d4ta.onrender.com/admin/

---

## 📚 More Info

**No Shell Access?** See: `NO_SHELL_DEPLOYMENT.md`

**Having Issues?** See:
- `ADMIN_LOGIN_FIX.md` - Login troubleshooting
- `RENDER_DEPLOYMENT_GUIDE.md` - Detailed guide

---

## 🎊 That's It!

**Everything is automatic - just deploy and login!** 🚀

No Shell needed • No manual commands • It just works™
