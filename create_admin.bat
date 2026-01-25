@echo off
echo Creating Django Superuser...
echo.
cd backend
python manage.py createsuperuser --username admin --email admin@example.com --noinput
echo.
echo Superuser 'admin' created successfully!
echo.
echo You can now login to http://localhost:8000/admin
echo Username: admin
echo Password: You'll need to set this manually using: python manage.py changepassword admin
echo.
pause
