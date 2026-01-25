# 🔧 How to Create Django Admin Superuser

## The Issue:
You ran the command from the wrong directory. The `manage.py` file is in the `backend` folder, not the root.

## ✅ Correct Way to Create Superuser:

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Run the Create Superuser Command
```bash
python manage.py createsuperuser
```

### Step 3: Enter the Details
When prompted, enter:

1. **Username:** `admin` (or any username you prefer)
2. **Email:** `admin@example.com` (or press Enter to skip)
3. **Password:** `admin123` (or any secure password)
4. **Password (again):** `admin123` (confirm the password)

## 📋 Complete Example:

```bash
PS D:\mindspark-ai-quiz> cd backend
PS D:\mindspark-ai-quiz\backend> python manage.py createsuperuser

Username: admin
Email address: admin@example.com
Password: ********
Password (again): ********
Superuser created successfully.
```

## 🎯 After Creating Superuser:

You can access the Django admin panel at:
**http://localhost:8000/admin**

Login with:
- **Username:** admin
- **Password:** admin123 (or whatever you set)

## 💡 What You Can Do in Admin Panel:

- View all registered users
- See all generated quizzes and questions
- Check quiz attempts and scores
- View individual user answers
- Monitor user statistics
- Manage all data

## 🚀 Quick Commands Reference:

```bash
# From root directory
cd backend

# Create superuser
python manage.py createsuperuser

# Start Django server (if not running)
python manage.py runserver 8000

# View database shell
python manage.py shell

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

---

**Note:** The backend server is already running at http://localhost:8000, so you just need to create the superuser to access the admin panel!
