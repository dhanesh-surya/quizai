from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Quiz(models.Model):
    """Model to store generated quizzes"""
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    topic = models.CharField(max_length=200)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Quizzes'
    
    def __str__(self):
        return f"{self.topic} - {self.difficulty} ({self.user.username})"
    
    @property
    def total_questions(self):
        return self.questions.count()


class Question(models.Model):
    """Model to store quiz questions"""
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.IntegerField(choices=[(0, 'A'), (1, 'B'), (2, 'C'), (3, 'D')])
    explanation = models.TextField()
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}..."
    
    @property
    def options(self):
        return [self.option_a, self.option_b, self.option_c, self.option_d]


class QuizAttempt(models.Model):
    """Model to store quiz attempts and results"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField()
    total_questions = models.IntegerField()
    score_percentage = models.IntegerField()
    completed_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.quiz.topic} - {self.score_percentage}%"


class UserAnswer(models.Model):
    """Model to store individual user answers"""
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.IntegerField()
    is_correct = models.BooleanField()
    
    def __str__(self):
        return f"{self.attempt.user.username} - Q{self.question.order} - {'✓' if self.is_correct else '✗'}"


class UserProfile(models.Model):
    """Extended user profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_admin = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    total_quizzes_taken = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    best_score = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def update_stats(self):
        """Update user statistics"""
        attempts = self.user.quiz_attempts.all()
        if attempts.exists():
            self.total_quizzes_taken = attempts.count()
            self.average_score = sum(a.score_percentage for a in attempts) / attempts.count()
            self.best_score = max(a.score_percentage for a in attempts)
            self.save()


class SiteTheme(models.Model):
    """Model to store website theme customization"""
    
    # Background Options
    BACKGROUND_TYPE_CHOICES = [
        ('solid', 'Solid Color'),
        ('gradient', 'Gradient'),
        ('image', 'Background Image'),
    ]
    
    # Font Family Options
    FONT_FAMILY_CHOICES = [
        ('inter', 'Inter (Modern Sans-serif)'),
        ('outfit', 'Outfit (Display Font)'),
        ('roboto', 'Roboto (Clean & Professional)'),
        ('poppins', 'Poppins (Geometric Sans)'),
        ('montserrat', 'Montserrat (Urban & Stylish)'),
        ('lato', 'Lato (Humanist Sans)'),
        ('opensans', 'Open Sans (Friendly & Open)'),
        ('raleway', 'Raleway (Elegant Thin)'),
    ]
    
    # Animation Speed Options
    ANIMATION_SPEED_CHOICES = [
        ('slow', 'Slow (1.5s)'),
        ('normal', 'Normal (1s)'),
        ('fast', 'Fast (0.5s)'),
        ('none', 'No Animations'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=100, unique=True, help_text="Theme name (e.g., 'Dark Blue', 'Light Mode')")
    is_active = models.BooleanField(default=False, help_text="Only one theme can be active at a time")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Background Settings
    background_type = models.CharField(max_length=20, choices=BACKGROUND_TYPE_CHOICES, default='gradient')
    background_color_1 = models.CharField(max_length=7, default='#0f172a', help_text="Primary background color (hex)")
    background_color_2 = models.CharField(max_length=7, default='#581c87', help_text="Secondary color for gradients (hex)")
    background_color_3 = models.CharField(max_length=7, default='#0f172a', help_text="Tertiary color for gradients (hex)")
    background_image = models.ImageField(upload_to='theme_backgrounds/', null=True, blank=True)
    background_opacity = models.IntegerField(default=100, help_text="Background opacity (0-100)")
    
    # Primary Colors
    primary_color = models.CharField(max_length=7, default='#3b82f6', help_text="Primary brand color (hex)")
    secondary_color = models.CharField(max_length=7, default='#a855f7', help_text="Secondary accent color (hex)")
    accent_color = models.CharField(max_length=7, default='#ec4899', help_text="Accent/highlight color (hex)")
    
    # Text Colors
    text_primary = models.CharField(max_length=7, default='#ffffff', help_text="Primary text color (hex)")
    text_secondary = models.CharField(max_length=7, default='#d1d5db', help_text="Secondary text color (hex)")
    text_muted = models.CharField(max_length=7, default='#9ca3af', help_text="Muted text color (hex)")
    
    # Navigation Bar
    navbar_background = models.CharField(max_length=7, default='#1e293b', help_text="Navbar background color (hex)")
    navbar_text = models.CharField(max_length=7, default='#ffffff', help_text="Navbar text color (hex)")
    navbar_opacity = models.IntegerField(default=90, help_text="Navbar opacity (0-100)")
    navbar_blur = models.BooleanField(default=True, help_text="Enable glassmorphism blur effect")
    
    # Typography
    font_family = models.CharField(max_length=50, choices=FONT_FAMILY_CHOICES, default='inter')
    font_size_base = models.IntegerField(default=16, help_text="Base font size in pixels (14-20)")
    font_size_heading = models.IntegerField(default=36, help_text="Heading font size in pixels (24-48)")
    line_height = models.FloatField(default=1.6, help_text="Line height multiplier (1.2-2.0)")
    
    # Card/Glass Effects
    card_background_opacity = models.IntegerField(default=12, help_text="Card background opacity (0-100)")
    card_border_opacity = models.IntegerField(default=25, help_text="Card border opacity (0-100)")
    card_blur_amount = models.IntegerField(default=16, help_text="Blur amount in pixels (0-32)")
    card_shadow = models.BooleanField(default=True, help_text="Enable card shadows")
    
    # Buttons
    button_style = models.CharField(max_length=20, choices=[
        ('gradient', 'Gradient'),
        ('solid', 'Solid Color'),
        ('outline', 'Outline'),
    ], default='gradient')
    button_rounded = models.IntegerField(default=12, help_text="Button border radius in pixels (0-24)")
    button_shadow = models.BooleanField(default=True, help_text="Enable button shadows")
    
    # Animations
    animation_speed = models.CharField(max_length=20, choices=ANIMATION_SPEED_CHOICES, default='normal')
    enable_hover_effects = models.BooleanField(default=True, help_text="Enable hover animations")
    enable_page_transitions = models.BooleanField(default=True, help_text="Enable page transition effects")
    enable_floating_orbs = models.BooleanField(default=True, help_text="Enable floating background orbs")
    orb_opacity = models.IntegerField(default=30, help_text="Orb opacity (0-100)")
    
    # Advanced
    custom_css = models.TextField(blank=True, null=True, help_text="Custom CSS code (advanced users)")
    
    class Meta:
        ordering = ['-is_active', '-updated_at']
        verbose_name = 'Site Theme'
        verbose_name_plural = 'Site Themes'
    
    def __str__(self):
        return f"{self.name} {'(Active)' if self.is_active else ''}"
    
    def save(self, *args, **kwargs):
        # Ensure only one theme is active
        if self.is_active:
            SiteTheme.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)
    
    @classmethod
    def get_active_theme(cls):
        """Get the currently active theme"""
        theme = cls.objects.filter(is_active=True).first()
        if not theme:
            # Create default theme if none exists
            theme = cls.objects.create(
                name='Default Theme',
                is_active=True,
            )
        return theme
    
    def get_background_css(self):
        """Generate CSS for background"""
        if self.background_type == 'solid':
            return f"background: {self.background_color_1};"
        elif self.background_type == 'gradient':
            return f"background: linear-gradient(135deg, {self.background_color_1}, {self.background_color_2}, {self.background_color_3});"
        elif self.background_type == 'image' and self.background_image:
            return f"background-image: url('{self.background_image.url}'); background-size: cover; background-position: center;"
        return ""
    
    def get_animation_duration(self):
        """Get animation duration based on speed"""
        speeds = {
            'slow': '1.5s',
            'normal': '1s',
            'fast': '0.5s',
            'none': '0s',
        }
        return speeds.get(self.animation_speed, '1s')
    
    def get_font_family_css(self):
        """Get font family CSS"""
        fonts = {
            'inter': "'Inter', sans-serif",
            'outfit': "'Outfit', sans-serif",
            'roboto': "'Roboto', sans-serif",
            'poppins': "'Poppins', sans-serif",
            'montserrat': "'Montserrat', sans-serif",
            'lato': "'Lato', sans-serif",
            'opensans': "'Open Sans', sans-serif",
            'raleway': "'Raleway', sans-serif",
        }
        return fonts.get(self.font_family, "'Inter', sans-serif")


# Import homepage content models
from .models_homepage import (
    StatCard, Feature, Testimonial, FooterSection, 
    FooterLink, HeroSection, SectionHeading
)
