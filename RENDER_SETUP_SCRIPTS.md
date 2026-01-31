# 🚀 Render.com Setup Scripts

## Quick Reference

### **Method 1: Full Setup Script (Recommended)**
```bash
bash setup_render.sh
```

### **Method 2: Quick One-Liner**
```bash
bash quick_setup.sh
```

### **Method 3: Manual Commands**
```bash
cd backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py create_default_superuser
```

---

## 📋 Detailed Instructions

### **Step 1: Access Render Shell**

1. Go to: https://dashboard.render.com/
2. Click your web service: **quizai-d4ta** (or backend)
3. Click **"Shell"** tab in the left sidebar
4. Wait for terminal to load (~5-10 seconds)

### **Step 2: Run Setup Script**

#### **Option A: Full Setup (Best for first-time setup)**

Copy and paste this into Render Shell:

```bash
bash setup_render.sh
```

**This will:**
- ✅ Navigate to backend directory
- ✅ Upgrade pip
- ✅ Install dependencies
- ✅ Run database migrations
- ✅ Collect static files
- ✅ Create superuser automatically
- ✅ Verify superuser creation
- ✅ Populate homepage content (if applicable)
- ✅ Display admin credentials

**Time:** ~2-3 minutes

---

#### **Option B: Quick Setup (Fast)**

Copy and paste this into Render Shell:

```bash
bash quick_setup.sh
```

**This will:**
- ✅ Run migrations
- ✅ Collect static files  
- ✅ Create superuser
- ✅ Show success message

**Time:** ~1 minute

---

#### **Option C: Manual Step-by-Step**

If scripts don't work, run manually:

```bash
# 1. Navigate to backend
cd backend

# 2. Run migrations
python manage.py migrate

# 3. Collect static files
python manage.py collectstatic --noinput

# 4. Create superuser
python manage.py create_default_superuser

# 5. Verify
echo "✅ Setup complete!"
```

---

## 🔐 Admin Credentials

After running any setup script, you can login with:

```
URL:      https://quizai-d4ta.onrender.com/admin/
Email:    admin@quizai.com
Username: admin
Password: QuizAI@Admin2026
```

---

## ✅ Verification

### **Test Admin Login:**
1. Visit: https://quizai-d4ta.onrender.com/admin/
2. Login with credentials above
3. Should see Django Admin dashboard ✅

### **Test User Registration:**
1. Visit: https://quizai-d4ta.onrender.com/register/
2. Create a test user
3. Login with test user
4. User should persist even after app restart ✅

---

## 🔄 When to Re-run

Run these scripts when:
- 🆕 First-time deployment
- 🗄️ After database changes/migrations
- 👤 If admin account is deleted
- 🔄 After major updates
- 🚨 If something breaks

---

## 📊 Script Details

### **setup_render.sh (Full Setup)**
- Complete setup with error handling
- Detailed output and verification
- Checks Python version
- Verifies superuser creation
- Best for troubleshooting

### **quick_setup.sh (Quick Setup)**
- Minimal, fast execution
- One-liner command
- Essential tasks only
- Best for regular updates

---

## 🐛 Troubleshooting

### **Error: "bash: setup_render.sh: No such file or directory"**

**Solution:** The script file doesn't exist on Render yet.

Run manual commands instead:
```bash
cd backend
python manage.py migrate
python manage.py create_default_superuser
```

---

### **Error: "Permission denied"**

**Solution:** Make script executable:
```bash
chmod +x setup_render.sh
bash setup_render.sh
```

---

### **Error: "ModuleNotFoundError"**

**Solution:** Install dependencies first:
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py create_default_superuser
```

---

### **Superuser Already Exists**

**Output:**
```
⚠️ User with email "admin@quizai.com" already exists.
✅ Updated user "admin" to superuser!
```

**This is OK!** The script updated the existing user to have admin privileges.

---

## 📝 What Each Script Does

### **Migrations:**
```bash
python manage.py migrate
```
- Creates database tables
- Applies schema changes
- Required before creating users

### **Static Files:**
```bash
python manage.py collectstatic --noinput
```
- Collects CSS, JS, images
- Required for admin panel styling
- Makes site look correct

### **Superuser Creation:**
```bash
python manage.py create_default_superuser
```
- Creates admin account
- Email: admin@quizai.com
- Password: QuizAI@Admin2026
- Required for /admin/ access

---

## 🎯 Recommended Workflow

### **First Deployment:**
1. Deploy app on Render
2. Wait for deployment to complete
3. Open Render Shell
4. Run: `bash setup_render.sh`
5. Test admin login
6. ✅ Done!

### **After Code Updates:**
1. Push code to GitHub
2. Render auto-deploys (or manual deploy)
3. If migrations changed, run: `bash quick_setup.sh`
4. ✅ Done!

### **Regular Maintenance:**
- Scripts can be re-run safely anytime
- They won't duplicate data
- Existing superuser will be updated, not duplicated

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Render Dashboard | https://dashboard.render.com/ |
| Admin Panel | https://quizai-d4ta.onrender.com/admin/ |
| Main Site | https://quizai-d4ta.onrender.com/ |
| GitHub Repo | https://github.com/dhanesh-surya/quizai |

---

## 💡 Pro Tips

1. **Bookmark Render Shell** - You'll use it often
2. **Save credentials** - Keep admin password secure
3. **Run after deployments** - Ensures everything is set up
4. **Check logs** - Look for errors in Render logs
5. **Test immediately** - Verify admin login after setup

---

## 🎊 Success Checklist

After running setup script:

- [ ] Script completed without errors
- [ ] Saw "✅ Setup complete!" message
- [ ] Admin URL accessible
- [ ] Can login with admin@quizai.com
- [ ] Admin dashboard loads correctly
- [ ] Can create/edit content
- [ ] Main site loads properly

---

**Quick Start:** Just run `bash setup_render.sh` in Render Shell! 🚀
