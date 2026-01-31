"""
Django management command to create a default superuser automatically.
This is useful for automated deployments on platforms like Render.com.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a default superuser if it does not exist'

    def handle(self, *args, **options):
        # Get superuser credentials from environment variables
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@quizai.com')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'QuizAI@Admin2026')
        username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')

        self.stdout.write(f'Attempting to create superuser: {username} ({email})')

        try:
            # Check if any superuser already exists
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                self.stdout.write(
                    self.style.WARNING(f'[WARNING] User with email "{email}" already exists.')
                )
                # Update to superuser and set password if not already
                if not user.is_superuser:
                    user.is_superuser = True
                    user.is_staff = True
                    user.set_password(password)
                    user.save()
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Updated user "{username}" to superuser!')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'User "{username}" is already a superuser. Skipping.')
                    )
                return

            if User.objects.filter(username=username).exists():
                user = User.objects.get(username=username)
                self.stdout.write(
                    self.style.WARNING(f'[WARNING] User with username "{username}" already exists.')
                )
                # Update to superuser and set password
                if not user.is_superuser:
                    user.is_superuser = True
                    user.is_staff = True
                    user.email = email
                    user.set_password(password)
                    user.save()
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Updated user "{username}" to superuser!')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'User "{username}" is already a superuser. Skipping.')
                    )
                return

            # Create new superuser
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'[SUCCESS] Superuser "{username}" created successfully!')
            )
            self.stdout.write(
                self.style.SUCCESS(f'   Email: {email}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'   Username: {username}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'   You can now login at /admin/')
            )

        except IntegrityError as e:
            self.stdout.write(
                self.style.ERROR(f'[ERROR] Integrity error creating superuser: {e}')
            )
            self.stdout.write(
                self.style.WARNING('Try running migrations first: python manage.py migrate')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'[ERROR] Error creating superuser: {e}')
            )
            import traceback
            self.stdout.write(traceback.format_exc())
