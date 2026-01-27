from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class StatCard(models.Model):
    """Stats section - individual stat cards"""
    title = models.CharField(max_length=50, help_text="e.g., '10K+', '50K+', '95%'")
    subtitle = models.CharField(max_length=100, help_text="e.g., 'Active Learners', 'Quizzes Generated'")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Stat Card'
        verbose_name_plural = 'Stats Section'
    
    def __str__(self):
        return f"{self.title} - {self.subtitle}"


class Feature(models.Model):
    """Features section - individual feature cards"""
    ICON_CHOICES = [
        ('fa-robot', 'Robot (AI)'),
        ('fa-chart-line', 'Chart (Analytics)'),
        ('fa-certificate', 'Certificate'),
        ('fa-clock', 'Clock'),
        ('fa-infinity', 'Infinity'),
        ('fa-mobile-alt', 'Mobile'),
        ('fa-brain', 'Brain'),
        ('fa-graduation-cap', 'Graduation Cap'),
        ('fa-trophy', 'Trophy'),
        ('fa-star', 'Star'),
        ('fa-bolt', 'Lightning Bolt'),
        ('fa-users', 'Users'),
    ]
    
    GRADIENT_CHOICES = [
        ('from-blue-500 to-purple-600', 'Blue to Purple'),
        ('from-purple-500 to-pink-600', 'Purple to Pink'),
        ('from-pink-500 to-red-600', 'Pink to Red'),
        ('from-blue-500 to-cyan-500', 'Blue to Cyan'),
        ('from-green-500 to-emerald-600', 'Green to Emerald'),
        ('from-yellow-500 to-orange-600', 'Yellow to Orange'),
        ('from-indigo-500 to-blue-600', 'Indigo to Blue'),
        ('from-red-500 to-pink-600', 'Red to Pink'),
    ]
    
    title = models.CharField(max_length=100, help_text="Feature title")
    description = models.TextField(help_text="Feature description")
    icon = models.CharField(max_length=50, choices=ICON_CHOICES, default='fa-star')
    icon_gradient = models.CharField(max_length=100, choices=GRADIENT_CHOICES, default='from-blue-500 to-purple-600')
    order = models.IntegerField(default=0, help_text="Display order")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Feature'
        verbose_name_plural = 'Features Section'
    
    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """Testimonials section - individual testimonials"""
    name = models.CharField(max_length=100, help_text="Person's name")
    role = models.CharField(max_length=100, help_text="e.g., 'Medical Student', 'Software Developer'")
    testimonial = models.TextField(help_text="Their testimonial/review")
    rating = models.IntegerField(
        default=5, 
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Star rating (1-5)"
    )
    avatar_letter = models.CharField(max_length=1, help_text="First letter for avatar (auto-filled from name if empty)", blank=True)
    avatar_gradient = models.CharField(
        max_length=100, 
        default='from-indigo-500 to-purple-600',
        help_text="Avatar background gradient (Tailwind classes)"
    )
    order = models.IntegerField(default=0, help_text="Display order")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials Section'
    
    def save(self, *args, **kwargs):
        # Auto-fill avatar letter from name if not provided
        if not self.avatar_letter and self.name:
            self.avatar_letter = self.name[0].upper()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - {self.role}"


class FooterSection(models.Model):
    """Footer content manager - Single instance"""
    
    # Brand Info
    brand_name = models.CharField(max_length=100, default="MindSpark AI")
    brand_tagline = models.CharField(max_length=200, default="Empowering learners worldwide with AI-powered education.")
    brand_icon = models.CharField(max_length=50, default='fa-brain', help_text="FontAwesome icon class")
    
    # Copyright
    copyright_text = models.CharField(max_length=200, default="MindSpark AI Quiz. All rights reserved.")
    
    # Social Media Links
    twitter_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    
    # Updated timestamp
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Footer Content'
        verbose_name_plural = 'Footer Section'
    
    def __str__(self):
        return f"Footer - {self.brand_name}"
    
    @classmethod
    def get_footer(cls):
        """Get or create the singleton footer instance"""
        footer, created = cls.objects.get_or_create(pk=1)
        return footer


class FooterLink(models.Model):
    """Footer links organized in columns"""
    COLUMN_CHOICES = [
        ('product', 'Product'),
        ('company', 'Company'),
        ('support', 'Support'),
        ('legal', 'Legal'),
    ]
    
    footer = models.ForeignKey(FooterSection, on_delete=models.CASCADE, related_name='links', default=1)
    column = models.CharField(max_length=20, choices=COLUMN_CHOICES, default='product')
    text = models.CharField(max_length=100, help_text="Link text")
    url = models.CharField(max_length=200, help_text="URL or Django URL name (e.g., '#features' or 'login')")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['column', 'order']
        verbose_name = 'Footer Link'
        verbose_name_plural = 'Footer Links'
    
    def __str__(self):
        return f"{self.column.title()}: {self.text}"


class HeroSection(models.Model):
    """Hero section content - Single instance"""
    
    # Badge
    badge_text = models.CharField(max_length=100, default="AI-Powered Learning Platform")
    
    # Heading
    heading_line1 = models.CharField(max_length=100, default="Transform Your Learning")
    heading_line2 = models.CharField(max_length=100, default="with ")
    heading_highlight = models.CharField(max_length=100, default="AI-Generated Quizzes")
    
    # Subheading
    subheading = models.TextField(
        default="Experience personalized learning powered by advanced AI. Generate custom quizzes on any topic, track your progress, and achieve your learning goals faster."
    )
    
    # Call to Action Buttons
    cta_primary_text = models.CharField(max_length=50, default="Start Learning Free")
    cta_primary_url = models.CharField(max_length=200, default="register", help_text="Django URL name or path")
    
    cta_secondary_text = models.CharField(max_length=50, default="See How It Works")
    cta_secondary_url = models.CharField(max_length=200, default="#how-it-works")
    
    # Updated timestamp
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Hero Section'
        verbose_name_plural = 'Hero Section'
    
    def __str__(self):
        return f"Hero Section - {self.heading_line1}"
    
    @classmethod
    def get_hero(cls):
        """Get or create the singleton hero instance"""
        hero, created = cls.objects.get_or_create(pk=1)
        return hero


class SectionHeading(models.Model):
    """Section headings for Features and Testimonials"""
    SECTION_CHOICES = [
        ('features', 'Features Section'),
        ('testimonials', 'Testimonials Section'),
        ('how_it_works', 'How It Works Section'),
        ('cta', 'Call to Action Section'),
    ]
    
    section = models.CharField(max_length=20, choices=SECTION_CHOICES, unique=True)
    title = models.CharField(max_length=200, help_text="Main heading")
    subtitle = models.TextField(help_text="Subheading/description")
    
    class Meta:
        verbose_name = 'Section Heading'
        verbose_name_plural = 'Section Headings'
    
    def __str__(self):
        return f"{self.get_section_display()}"
    
    @classmethod
    def get_heading(cls, section_name):
        """Get or create a section heading"""
        defaults = {
            'features': {
                'title': 'Powerful Features for <span class="gradient-text">Effective Learning</span>',
                'subtitle': 'Everything you need to accelerate your learning journey'
            },
            'testimonials': {
                'title': 'What Our <span class="gradient-text">Learners Say</span>',
                'subtitle': 'Join thousands of satisfied learners'
            },
            'how_it_works': {
                'title': 'How <span class="gradient-text">MindSpark AI</span> Works',
                'subtitle': 'Get started in three simple steps'
            },
            'cta': {
                'title': 'Ready to Transform Your Learning?',
                'subtitle': 'Join thousands of learners who are already achieving their goals with MindSpark AI'
            }
        }
        
        heading, created = cls.objects.get_or_create(
            section=section_name,
            defaults=defaults.get(section_name, {
                'title': f'{section_name.title()} Section',
                'subtitle': 'Section description'
            })
        )
        return heading
