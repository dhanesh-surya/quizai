# ✅ DEPLOYMENT CHECKLIST

## Code Status
- ✅ PostgreSQL support added to requirements.txt
- ✅ settings.py updated for PostgreSQL
- ✅ render.yaml updated with database configuration
- ✅ All changes committed to git
- ✅ Code pushed to GitHub (commit: acae189)

---

## Next: Deploy on Render.com

### Quick Steps (5 minutes):

#### 1️⃣ Create PostgreSQL Database
- [ ] Go to https://dashboard.render.com/
- [ ] Click **New + → PostgreSQL**
- [ ] Name: `quizai-db`
- [ ] Plan: **Free**
- [ ] Click **Create Database**
- [ ] Copy **Internal Database URL**

#### 2️⃣ Link to Web Service
- [ ] Go to your web service: **quizai-d4ta**
- [ ] Click **Environment** tab
- [ ] Add environment variable:
  - Key: `DATABASE_URL`
  - Value: (paste Internal Database URL)
- [ ] Click **Save Changes**
- [ ] Wait for auto-redeploy (~5-10 min)

#### 3️⃣ Verify Deployment
- [ ] Check **Logs** tab for successful deployment
- [ ] Visit: https://quizai-d4ta.onrender.com/
- [ ] Register a new user
- [ ] Manual Deploy → Deploy latest commit (force restart)
- [ ] Login again - user should still exist! ✅

#### 4️⃣ Create Admin User (Optional)
- [ ] In web service, click **Shell** tab
- [ ] Run: `cd backend && python manage.py createsuperuser`
- [ ] Access admin at: https://quizai-d4ta.onrender.com/admin/

---

## Expected Timeline
- Database creation: ~2-3 minutes
- Service redeployment: ~5-10 minutes
- **Total**: ~10-15 minutes

---

## 🆘 Need Help?
See detailed guide: `RENDER_DEPLOYMENT_GUIDE.md`

---

## 🎯 Success Criteria
✅ No more data loss on restart
✅ Users persist across deployments
✅ Database shows "Available" status
✅ App accessible at https://quizai-d4ta.onrender.com/
