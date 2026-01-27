from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import (
    Quiz, Question, QuizAttempt, UserAnswer, UserProfile, SiteTheme,
    StatCard, Feature, Testimonial, FooterSection, FooterLink, 
    HeroSection, SectionHeading
)


class SiteThemeAdminForm(forms.ModelForm):
    """Custom form with color picker widgets"""
    
    class Meta:
        model = SiteTheme
        fields = '__all__'
        widgets = {
            # Background colors
            'background_color_1': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'background_color_2': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'background_color_3': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            # Color scheme
            'primary_color': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'secondary_color': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'accent_color': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'text_primary': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'text_secondary': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'text_muted': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            # Navbar colors
            'navbar_background': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
            'navbar_text': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 100px; height: 40px; cursor: pointer;'
            }),
        }



@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_admin', 'total_quizzes_taken', 'average_score', 'best_score']
    list_filter = ['is_admin']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['total_quizzes_taken', 'average_score', 'best_score']


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0
    fields = ['order', 'question_text', 'correct_option']
    readonly_fields = ['order']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['topic', 'user', 'difficulty', 'language', 'total_questions', 'created_at']
    list_filter = ['difficulty', 'language', 'created_at']
    search_fields = ['topic', 'user__username']
    readonly_fields = ['created_at', 'total_questions']
    inlines = [QuestionInline]
    
    def total_questions(self, obj):
        return obj.questions.count()
    total_questions.short_description = 'Questions'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'order', 'question_text_short', 'correct_option']
    list_filter = ['quiz__difficulty', 'quiz__topic']
    search_fields = ['question_text', 'quiz__topic']
    
    def question_text_short(self, obj):
        return obj.question_text[:50] + '...' if len(obj.question_text) > 50 else obj.question_text
    question_text_short.short_description = 'Question'


class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ['question', 'selected_option', 'is_correct']


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score_display', 'score_percentage', 'completed_at']
    list_filter = ['completed_at', 'quiz__difficulty']
    search_fields = ['user__username', 'quiz__topic']
    readonly_fields = ['completed_at']
    inlines = [UserAnswerInline]
    
    def score_display(self, obj):
        return f"{obj.score}/{obj.total_questions}"
    score_display.short_description = 'Score'


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt_user', 'question_short', 'selected_option', 'is_correct']
    list_filter = ['is_correct']
    search_fields = ['attempt__user__username', 'question__question_text']
    
    def attempt_user(self, obj):
        return obj.attempt.user.username
    attempt_user.short_description = 'User'
    
    def question_short(self, obj):
        return obj.question.question_text[:40] + '...'
    question_short.short_description = 'Question'


@admin.register(SiteTheme)
class SiteThemeAdmin(admin.ModelAdmin):
    """Admin interface for Site Theme management"""
    
    form = SiteThemeAdminForm  # Use custom form with color pickers
    
    list_display = [
        'name', 
        'is_active_badge', 
        'background_type',
        'primary_color_preview',
        'secondary_color_preview',
        'font_family',
        'animation_speed',
        'created_by',
        'updated_at'
    ]
    
    list_filter = [
        'is_active',
        'background_type',
        'font_family',
        'animation_speed',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'name',
        'created_by__username'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'preview_colors',
        'preview_background'
    ]
    
    actions = ['activate_theme', 'duplicate_theme']
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name',
                'is_active',
                'created_by',
                ('created_at', 'updated_at'),
            )
        }),
        ('Background Settings', {
            'fields': (
                'background_type',
                'preview_background',
                ('background_color_1', 'background_color_2', 'background_color_3'),
                'background_opacity',
                'background_image',
            ),
            'classes': ('collapse',)
        }),
        ('Color Scheme', {
            'fields': (
                'preview_colors',
                ('primary_color', 'secondary_color', 'accent_color'),
                ('text_primary', 'text_secondary', 'text_muted'),
            ),
            'classes': ('collapse',)
        }),
        ('Navigation Bar', {
            'fields': (
                ('navbar_background', 'navbar_text'),
                'navbar_opacity',
                'navbar_blur',
            ),
            'classes': ('collapse',)
        }),
        ('Typography', {
            'fields': (
                'font_family',
                ('font_size_base', 'font_size_heading'),
                'line_height',
            ),
            'classes': ('collapse',)
        }),
        ('Card & Glass Effects', {
            'fields': (
                ('card_background_opacity', 'card_border_opacity'),
                'card_blur_amount',
                'card_shadow',
            ),
            'classes': ('collapse',)
        }),
        ('Button Styles', {
            'fields': (
                'button_style',
                'button_rounded',
                'button_shadow',
            ),
            'classes': ('collapse',)
        }),
        ('Animations & Effects', {
            'fields': (
                'animation_speed',
                ('enable_hover_effects', 'enable_page_transitions'),
                'enable_floating_orbs',
                'orb_opacity',
            ),
            'classes': ('collapse',)
        }),
        ('Advanced Customization', {
            'fields': (
                'custom_css',
            ),
            'classes': ('collapse',),
            'description': 'Add custom CSS code for advanced styling'
        }),
    )
    
    def is_active_badge(self, obj):
        """Display active status as a colored badge"""
        if obj.is_active:
            return format_html(
                '<span style="background-color: #10b981; color: white; padding: 3px 10px; '
                'border-radius: 12px; font-weight: bold; font-size: 11px;">ACTIVE</span>'
            )
        return format_html(
            '<span style="background-color: #6b7280; color: white; padding: 3px 10px; '
            'border-radius: 12px; font-size: 11px;">Inactive</span>'
        )
    is_active_badge.short_description = 'Status'
    
    def primary_color_preview(self, obj):
        """Display primary color as a colored box"""
        return format_html(
            '<div style="width: 40px; height: 20px; background-color: {}; '
            'border: 1px solid #ccc; border-radius: 4px;"></div>',
            obj.primary_color
        )
    primary_color_preview.short_description = 'Primary'
    
    def secondary_color_preview(self, obj):
        """Display secondary color as a colored box"""
        return format_html(
            '<div style="width: 40px; height: 20px; background-color: {}; '
            'border: 1px solid #ccc; border-radius: 4px;"></div>',
            obj.secondary_color
        )
    secondary_color_preview.short_description = 'Secondary'
    
    def preview_colors(self, obj):
        """Display all colors in a preview row"""
        colors = [
            ('Primary', obj.primary_color),
            ('Secondary', obj.secondary_color),
            ('Accent', obj.accent_color),
            ('Text Primary', obj.text_primary),
            ('Text Secondary', obj.text_secondary),
            ('Text Muted', obj.text_muted),
        ]
        
        html = '<div style="display: flex; gap: 10px; flex-wrap: wrap;">'
        for name, color in colors:
            html += f'''
                <div style="text-align: center;">
                    <div style="width: 60px; height: 40px; background-color: {color}; 
                         border: 2px solid #ddd; border-radius: 6px; margin-bottom: 4px;"></div>
                    <div style="font-size: 10px; color: #666;">{name}</div>
                    <div style="font-size: 9px; color: #999; font-family: monospace;">{color}</div>
                </div>
            '''
        html += '</div>'
        return format_html(html)
    preview_colors.short_description = 'Color Preview'
    
    def preview_background(self, obj):
        """Display background preview"""
        if obj.background_type == 'solid':
            style = f'background-color: {obj.background_color_1};'
        elif obj.background_type == 'gradient':
            style = f'background: linear-gradient(135deg, {obj.background_color_1}, {obj.background_color_2}, {obj.background_color_3});'
        else:
            style = 'background-color: #f0f0f0;'
        
        return format_html(
            '<div style="width: 200px; height: 60px; {}; border: 2px solid #ddd; '
            'border-radius: 8px;"></div>',
            style
        )
    preview_background.short_description = 'Background Preview'
    
    def activate_theme(self, request, queryset):
        """Admin action to activate selected theme"""
        if queryset.count() > 1:
            self.message_user(request, "Please select only one theme to activate.", level='error')
            return
        
        theme = queryset.first()
        theme.is_active = True
        theme.save()
        self.message_user(request, f'Theme "{theme.name}" has been activated successfully!')
    activate_theme.short_description = "Activate selected theme"
    
    def duplicate_theme(self, request, queryset):
        """Admin action to duplicate selected themes"""
        for theme in queryset:
            theme.pk = None
            theme.id = None
            theme.name = f"{theme.name} (Copy)"
            theme.is_active = False
            theme.save()
        
        self.message_user(request, f'{queryset.count()} theme(s) duplicated successfully!')
    duplicate_theme.short_description = "Duplicate selected themes"
    
    def save_model(self, request, obj, form, change):
        """Set created_by to current user if not set"""
        if not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    class Media:
        css = {
            'all': ('admin/css/theme_admin.css',)
        }
        js = ('admin/js/theme_admin.js',)


# ============================================
# Homepage Content Management Admin
# ============================================

@admin.register(StatCard)
class StatCardAdmin(admin.ModelAdmin):
    """Admin for Stats section cards"""
    list_display = ['title', 'subtitle', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title', 'subtitle']
    ordering = ['order']


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    """Admin for Features section"""
    list_display = ['title', 'icon_preview', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active', 'icon']
    search_fields = ['title', 'description']
    ordering = ['order']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'description', 'is_active')
        }),
        ('Design', {
            'fields': ('icon', 'icon_gradient', 'order')
        }),
    )
    
    def icon_preview(self, obj):
        """Display icon preview"""
        return format_html(
            '<div class="w-10 h-10 bg-gradient-to-br {} rounded-lg flex items-center justify-center">'
            '<i class="fas {} text-white"></i></div>',
            obj.icon_gradient,
            obj.icon
        )
    icon_preview.short_description = 'Icon'


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """Admin for Testimonials section"""
    list_display = ['name', 'role', 'rating_display', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active', 'rating']
    search_fields = ['name', 'role', 'testimonial']
    ordering = ['order']
    
    fieldsets = (
        ('Person Info', {
            'fields': ('name', 'role', 'rating', 'is_active')
        }),
        ('Testimonial', {
            'fields': ('testimonial',)
        }),
        ('Design', {
            'fields': ('avatar_letter', 'avatar_gradient', 'order')
        }),
    )
    
    def rating_display(self, obj):
        """Display stars for rating"""
        stars = '⭐' * obj.rating
        return format_html('<span style="font-size: 16px;">{}</span>', stars)
    rating_display.short_description = 'Rating'


class FooterLinkInline(admin.TabularInline):
    """Inline admin for footer links"""
    model = FooterLink
    extra = 1
    fields = ['column', 'text', 'url', 'order', 'is_active']
    ordering = ['column', 'order']


@admin.register(FooterSection)
class FooterSectionAdmin(admin.ModelAdmin):
    """Admin for Footer section - Singleton"""
    list_display = ['brand_name', 'updated_at']
    
    fieldsets = (
        ('Brand Information', {
            'fields': ('brand_name', 'brand_tagline', 'brand_icon')
        }),
        ('Copyright', {
            'fields': ('copyright_text',)
        }),
        ('Social Media Links', {
            'fields': ('twitter_url', 'linkedin_url', 'github_url', 'facebook_url', 'instagram_url'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [FooterLinkInline]
    
    def has_add_permission(self, request):
        """Only allow one footer instance"""
        return not FooterSection.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of footer"""
        return False


@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    """Admin for individual footer links"""
    list_display = ['text', 'column', 'url', 'order', 'is_active']
    list_editable = ['column', 'order', 'is_active']
    list_filter = ['column', 'is_active']
    search_fields = ['text', 'url']
    ordering = ['column', 'order']


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    """Admin for Hero section - Singleton"""
    list_display = ['heading_line1', 'updated_at']
    
    fieldsets = (
        ('Badge', {
            'fields': ('badge_text',)
        }),
        ('Heading', {
            'fields': ('heading_line1', 'heading_line2', 'heading_highlight')
        }),
        ('Subheading', {
            'fields': ('subheading',)
        }),
        ('Call to Action Buttons', {
            'fields': (
                ('cta_primary_text', 'cta_primary_url'),
                ('cta_secondary_text', 'cta_secondary_url'),
            )
        }),
    )
    
    def has_add_permission(self, request):
        """Only allow one hero instance"""
        return not HeroSection.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of hero"""
        return False


@admin.register(SectionHeading)
class SectionHeadingAdmin(admin.ModelAdmin):
    """Admin for section headings"""
    list_display = ['section', 'title_preview']
    list_filter = ['section']
    
    fieldsets = (
        ('Section', {
            'fields': ('section',)
        }),
        ('Heading Content', {
            'fields': ('title', 'subtitle'),
            'description': 'You can use HTML in the title field, e.g., <span class="gradient-text">highlighted text</span>'
        }),
    )
    
    def title_preview(self, obj):
        """Show title without HTML"""
        import re
        clean_title = re.sub(r'<[^>]+>', '', obj.title)
        return clean_title[:50] + '...' if len(clean_title) > 50 else clean_title
    title_preview.short_description = 'Title'
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of default section headings"""
        return False

