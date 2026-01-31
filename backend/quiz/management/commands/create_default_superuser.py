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
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')
        username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')

        try:
            # Check if superuser already exists
            if User.objects.filter(email=email).exists():
                self.stdout.write(
                    self.style.WARNING(f'Superuser with email "{email}" already exists. Skipping creation.')
                )
                return

            if User.objects.filter(username=username).exists():
                self.stdout.write(
                    self.style.WARNING(f'User with username "{username}" already exists. Skipping creation.')
                )
                return

            # Create superuser
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ Superuser "{username}" created successfully!')
            )
            self.stdout.write(
                self.style.SUCCESS(f'   Email: {email}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'   You can now login at /admin/')
            )

        except IntegrityError as e:
            self.stdout.write(
                self.style.WARNING(f'Superuser already exists or integrity error: {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating superuser: {e}')
            )
